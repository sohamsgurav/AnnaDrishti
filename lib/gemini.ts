import { GoogleGenerativeAI } from "@google/generative-ai";
import { RawExtraction, RawExtractionSchema } from "./schemas";
import { DEMO_PRESETS } from "./sample-data";

const EXTRACTION_SYSTEM_PROMPT = `You are AnnaDrishti Vision — an expert food label OCR and packaging analysis intelligence engine.
Your task is to transcribe and extract ONLY the visible packaging and nutritional data from the provided food label image.

CRITICAL EXTRACTION RULES:
1. Do NOT guess, extrapolate, or infer any missing numbers or ingredients. If a nutrient or ingredient is not printed or is unreadable/blurry, you MUST set its value to null.
2. Preserve the exact wording and order of ingredients as printed on the label.
3. Identify whether the nutrition table values are declared 'per_100g', 'per_serving', or 'both'.
4. Extract serving size (numeric) and serving unit (e.g. 'g' or 'ml') if explicitly stated.
5. Extract all nutrients in their standard units:
   - caloriesKcal (in kcal; convert from kJ only if kJ is explicitly printed: 1 kcal = 4.184 kJ)
   - proteinG (grams)
   - carbohydratesG (grams)
   - totalSugarsG (grams)
   - addedSugarsG (grams, or null if not declared)
   - totalFatG (grams)
   - saturatedFatG (grams)
   - transFatG (grams)
   - sodiumMg (milligrams; if only salt is given, salt in grams, set sodiumMg to null)
   - saltG (grams)
   - fibreG (grams, or null if not declared)
6. Extract listed micronutrients (vitamins, minerals) with their amounts, units, and % RDA if printed.
7. Separate direct allergen statements ('Contains Wheat, Milk, Soy') from precautionary 'May Contain' statements ('May contain traces of Peanuts').
8. Explicitly list any missingFields (e.g. ['addedSugarsG', 'fibreG']) and uncertainFields (e.g. if text is partially cropped or blurry).
9. Add short, professional extractionNotes regarding image legibility and panel completeness.

You MUST reply with ONLY a single, valid JSON object matching this exact schema:
{
  "productName": string | null,
  "brand": string | null,
  "category": string | null,
  "ingredientsText": string | null,
  "ingredients": string[],
  "nutrition": {
    "basis": "per_100g" | "per_serving" | "both" | "unknown",
    "servingSize": number | null,
    "servingUnit": string | null,
    "caloriesKcal": number | null,
    "proteinG": number | null,
    "carbohydratesG": number | null,
    "totalSugarsG": number | null,
    "addedSugarsG": number | null,
    "totalFatG": number | null,
    "saturatedFatG": number | null,
    "transFatG": number | null,
    "sodiumMg": number | null,
    "saltG": number | null,
    "fibreG": number | null,
    "micronutrients": [
      { "name": string, "amount": number | null, "unit": string | null, "percentRda": number | null }
    ],
    "allergenStatements": string[],
    "mayContainStatements": []
  },
  "missingFields": string[],
  "uncertainFields": string[],
  "extractionNotes": string[]
}`;

export interface ExtractionResult {
  raw: RawExtraction;
  isDemo: boolean;
  demoMessage?: string;
  modelUsed?: string;
}

export async function extractLabelFromImage(
  imageBase64: string,
  mimeType: string,
  presetId?: string
): Promise<ExtractionResult> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  // If specific demo preset was selected, or if API key is missing
  if (presetId) {
    const preset = DEMO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      return {
        raw: preset.rawExtraction,
        isDemo: true,
        demoMessage: `Demo Mode Active: Simulating analysis using verified label data for "${preset.name}".`,
      };
    }
  }

  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.length < 10) {
    // Graceful fallback to demo mode when API key is not yet configured
    const defaultPreset = DEMO_PRESETS[0]; // Classic Bhujia Sev
    return {
      raw: defaultPreset.rawExtraction,
      isDemo: true,
      demoMessage:
        "Demo Mode: GEMINI_API_KEY is not configured in .env.local. Displaying verified sample analysis for demonstration. Add your free Gemini API key to scan live custom labels.",
    };
  }

  // Live Vision API call
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for fast and accurate multimodal OCR
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1, // Low temperature for high factual accuracy
      },
    });

    const result = await model.generateContent([
      {
        text: EXTRACTION_SYSTEM_PROMPT,
      },
      {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: imageBase64,
        },
      },
    ]);

    const responseText = result.response.text();
    if (!responseText) {
      throw new Error("Empty response received from Gemini Vision model.");
    }

    // Clean JSON response if enclosed in markdown code fences
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    const parsed = JSON.parse(cleanJson);
    const validated = RawExtractionSchema.parse(parsed);

    return {
      raw: validated,
      isDemo: false,
      modelUsed: "gemini-1.5-flash",
    };
  } catch (error: any) {
    console.error("Gemini Vision API extraction error:", error);
    // If rate limited or quota exceeded, fall back safely with an explanatory note
    if (error.status === 429 || error.message?.includes("RESOURCE_EXHAUSTED")) {
      const fallback = DEMO_PRESETS[0];
      return {
        raw: fallback.rawExtraction,
        isDemo: true,
        demoMessage: "Gemini API rate limit reached. Displaying verified sample label data for evaluation.",
      };
    }
    throw new Error(
      `Failed to analyze label image: ${error.message || "Unrecognized label structure or network error"}`
    );
  }
}
