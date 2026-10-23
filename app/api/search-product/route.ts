import { NextRequest, NextResponse } from "next/server";
import { searchAndMatchProduct } from "@/lib/product-search";
import { checkRateLimit, sanitizeInput, logSecurityAudit } from "@/lib/security";
import { memoryCache } from "@/lib/cache";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const rawQuery = body.query?.trim();

    if (!rawQuery) {
      return NextResponse.json(
        { error: "Please enter a product description or name." },
        { status: 400 }
      );
    }

    // Sanitize user text input against XSS
    const sanitizedQuery = sanitizeInput(rawQuery);

    // Check query cache
    const cached = memoryCache.getSearch(sanitizedQuery);
    if (cached) {
      logSecurityAudit("product_search_cache_hit", { query: sanitizedQuery });
      return NextResponse.json(cached, { status: 200 });
    }

    logSecurityAudit("product_search_lookup", { query: sanitizedQuery });
    const searchResult = await searchAndMatchProduct(sanitizedQuery);

    // Save to cache
    memoryCache.setSearch(sanitizedQuery, searchResult);

    return NextResponse.json(searchResult, { status: 200 });
  } catch (error: any) {
    console.error("POST /api/search-product error:", error);
    return NextResponse.json(
      { error: "Product search failed. Please try again or upload a photo of the label." },
      { status: 500 }
    );
  }
}
