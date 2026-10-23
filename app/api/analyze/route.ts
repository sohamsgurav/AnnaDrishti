import { NextRequest, NextResponse } from "next/server";
import { validateImageFile } from "@/lib/validation";
import { extractLabelFromImage } from "@/lib/gemini";
import { assembleAnalysisResult } from "@/lib/result";
import { UserPreferences, UserPreferencesSchema } from "@/lib/schemas";
import { checkRateLimit, logSecurityAudit } from "@/lib/security";
import { memoryCache } from "@/lib/cache";

export const maxDuration = 60; // Allow sufficient time for vision OCR

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      logSecurityAudit("rate_limit_exceeded", { ip });
      return NextResponse.json(
        { error: "Too many analysis requests. Please wait a moment before trying again." },
        { status: 429, headers: { "Retry-After": "30" } }
      );
    }

    const contentType = req.headers.get("content-type") || "";

    let imageBase64 = "";
    let mimeType = "image/jpeg";
    let preferences: UserPreferences = { allergens: [], dietaryPreferences: [], goals: [] };
    let presetId: string | undefined = undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      const prefString = formData.get("preferences") as string | null;
      const preset = formData.get("presetId") as string | null;

      if (preset) {
        presetId = preset;
      }

      if (prefString) {
        try {
          const parsedPrefs = JSON.parse(prefString);
          preferences = UserPreferencesSchema.parse(parsedPrefs);
        } catch (e) {
          console.warn("Invalid preferences JSON:", e);
        }
      }

      if (presetId) {
        // Preset selected
      } else if (file) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          return NextResponse.json(
            { error: validation.error || "Invalid image upload" },
            { status: 400 }
          );
        }

        mimeType = file.type || "image/jpeg";
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        imageBase64 = buffer.toString("base64");
      } else {
        return NextResponse.json(
          { error: "No image file or preset ID provided." },
          { status: 400 }
        );
      }
    } else {
      // JSON body
      const body = await req.json();
      presetId = body.presetId;
      imageBase64 = body.imageBase64 || "";
      mimeType = body.mimeType || "image/jpeg";

      if (body.preferences) {
        try {
          preferences = UserPreferencesSchema.parse(body.preferences);
        } catch (e) {
          console.warn("Invalid preferences:", e);
        }
      }

      if (!presetId && !imageBase64) {
        return NextResponse.json(
          { error: "Please upload an image file or choose a sample preset." },
          { status: 400 }
        );
      }
    }

    // 2. Intelligent Caching & Deduplication Check
    const cacheKey = presetId ? `preset:${presetId}` : memoryCache.generateHash(imageBase64);
    const cachedExtraction = memoryCache.getExtraction(cacheKey);

    let rawData;
    let isDemo = false;
    let demoMessage: string | undefined = undefined;

    if (cachedExtraction) {
      logSecurityAudit("ocr_cache_hit", { cacheKey: cacheKey.substring(0, 16), presetId });
      rawData = cachedExtraction;
      isDemo = Boolean(presetId);
      demoMessage = presetId ? "Loaded from verified sample dataset." : "Retrieved from recent scan cache.";
    } else {
      logSecurityAudit("ocr_vision_call", { mimeType, presetId });
      const extraction = await extractLabelFromImage(imageBase64, mimeType, presetId);
      rawData = extraction.raw;
      isDemo = extraction.isDemo;
      demoMessage = extraction.demoMessage;

      // Store in memory cache
      memoryCache.setExtraction(cacheKey, rawData);
    }

    // 3. Deterministic Normalization, Restrictions, Rating & Verified Alternatives
    const analysisResult = await assembleAnalysisResult({
      raw: rawData,
      preferences,
      isDemo,
      demoMessage,
    });

    return NextResponse.json(analysisResult, {
      status: 200,
      headers: {
        "X-RateLimit-Remaining": String(rateCheck.remaining),
      },
    });
  } catch (error: any) {
    console.error("POST /api/analyze error:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to analyze label image. Please check the photo and retry.",
      },
      { status: 500 }
    );
  }
}
