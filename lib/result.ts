import {
  RawExtraction,
  UserPreferences,
  AnalysisResult,
  NormalizedNutritionValues,
} from "./schemas";
import { normalizeNutritionData } from "./units";
import { analyzeIngredient } from "./ingredients";
import { checkRestrictions } from "./restrictions";
import { calculateProductRating } from "./rating";
import { findVerifiedAlternatives } from "./alternatives";

export interface AssemblyOptions {
  raw: RawExtraction;
  preferences?: UserPreferences;
  isDemo?: boolean;
  demoMessage?: string;
  imageThumbnailUrl?: string;
}

export async function assembleAnalysisResult(options: AssemblyOptions): Promise<AnalysisResult> {
  const { raw, preferences, isDemo = false, demoMessage } = options;

  // 1. Normalize Nutrition
  const normalizedNutrition = normalizeNutritionData(raw.nutrition);

  // 2. Analyze Ingredients
  const ingredientsList = raw.ingredients && raw.ingredients.length > 0
    ? raw.ingredients
    : raw.ingredientsText
    ? raw.ingredientsText.split(/[,;\n]/).map((s) => s.trim()).filter((s) => s.length > 0)
    : [];

  const ingredientFindings = ingredientsList.map((ing) => analyzeIngredient(ing));

  // 3. Restriction Matching
  const selectedRestrictions = [
    ...(preferences?.allergens || []),
    ...(preferences?.dietaryPreferences || []),
  ];

  const restrictionChecks = checkRestrictions(
    selectedRestrictions,
    ingredientsList,
    raw.nutrition.allergenStatements || [],
    raw.nutrition.mayContainStatements || [],
    raw.ingredientsText
  );

  const hasAllergenMatch = restrictionChecks.some(
    (check) => check.status === "match" && check.type === "allergen"
  );

  // 4. Transparent Rating Engine (AnnaDrishti Index v1.0)
  const rating = calculateProductRating(
    normalizedNutrition.per100g,
    normalizedNutrition.missingFields,
    hasAllergenMatch
  );

  // 5. Alternatives Lookup (Live Open Food Facts or verified fallback)
  const userGoal = preferences?.goals?.[0] || "general";
  const alternatives = await findVerifiedAlternatives({
    category: raw.category,
    productName: raw.productName,
    goal: userGoal,
    currentNutrition: normalizedNutrition.per100g,
  });

  // 6. Data Quality & Confidence Assessment
  const warnings: string[] = [];
  const notes: string[] = [...(raw.extractionNotes || [])];

  if (demoMessage) {
    notes.unshift(demoMessage);
  }

  if (normalizedNutrition.missingFields.length > 0) {
    warnings.push(
      `Incomplete nutrition table: ${normalizedNutrition.missingFields.join(", ")} not declared on label.`
    );
  }

  if (raw.uncertainFields && raw.uncertainFields.length > 0) {
    warnings.push(`Low-confidence text fields: ${raw.uncertainFields.join(", ")}. Please review.`);
  }

  // Calculate completeness score (percentage of 10 standard nutrients present)
  const totalNutrientSlots = 10;
  const presentNutrientSlots = totalNutrientSlots - normalizedNutrition.missingFields.length;
  const completenessPercent = Math.max(0, Math.round((presentNutrientSlots / totalNutrientSlots) * 100));

  let confidence: "high" | "medium" | "low" = "high";
  if (completenessPercent < 50 || raw.uncertainFields?.length > 1) {
    confidence = "low";
  } else if (completenessPercent < 80 || raw.uncertainFields?.length > 0) {
    confidence = "medium";
  }

  return {
    id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    isDemo,
    product: {
      name: raw.productName || "Packaged Food Product",
      brand: raw.brand || null,
      category: raw.category || "General Packaged Food",
    },
    nutrition: {
      basis: normalizedNutrition.basis,
      servingSizeDisplay: normalizedNutrition.servingSizeDisplay,
      per100g: normalizedNutrition.per100g,
      perServing: normalizedNutrition.perServing,
      missingFields: normalizedNutrition.missingFields,
      uncertainFields: raw.uncertainFields || [],
    },
    ingredientFindings,
    ingredientsOriginalText: raw.ingredientsText || null,
    restrictionChecks,
    rating,
    alternatives,
    dataQuality: {
      confidence,
      completenessPercent,
      notes,
      warnings,
      canUserEdit: true,
    },
    disclaimer:
      "AnnaDrishti is an informational platform for food literacy and packaged label intelligence. It does NOT provide medical advice, diagnose allergies, or predict individual clinical outcomes. Always inspect physical packaging, manufacturing lot declarations, and consult qualified healthcare professionals for severe dietary restrictions or allergies.",
  };
}
