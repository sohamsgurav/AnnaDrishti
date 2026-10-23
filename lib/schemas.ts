import { z } from "zod";

// Micronutrient entry
export const MicronutrientSchema = z.object({
  name: z.string(),
  amount: z.number().nullable().optional(),
  unit: z.string().nullable().optional(),
  percentRda: z.number().nullable().optional(),
});
export type Micronutrient = z.infer<typeof MicronutrientSchema>;

// Raw Nutrition Data extracted from image by Vision Model
export const RawNutritionSchema = z.object({
  basis: z.enum(["per_100g", "per_serving", "both", "unknown"]).default("unknown"),
  servingSize: z.number().nullable().optional(),
  servingUnit: z.string().nullable().optional(),
  caloriesKcal: z.number().nullable().optional(),
  proteinG: z.number().nullable().optional(),
  carbohydratesG: z.number().nullable().optional(),
  totalSugarsG: z.number().nullable().optional(),
  addedSugarsG: z.number().nullable().optional(),
  totalFatG: z.number().nullable().optional(),
  saturatedFatG: z.number().nullable().optional(),
  transFatG: z.number().nullable().optional(),
  cholesterolMg: z.number().nullable().optional(),
  sodiumMg: z.number().nullable().optional(),
  saltG: z.number().nullable().optional(),
  fibreG: z.number().nullable().optional(),
  micronutrients: z.array(MicronutrientSchema).default([]),
  allergenStatements: z.array(z.string()).default([]),
  mayContainStatements: z.array(z.string()).default([]),
});
export type RawNutrition = z.infer<typeof RawNutritionSchema>;

// Raw Extraction result directly from Vision Model
export const RawExtractionSchema = z.object({
  productName: z.string().nullable().optional(),
  brand: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  ingredientsText: z.string().nullable().optional(),
  ingredients: z.array(z.string()).default([]),
  nutrition: RawNutritionSchema.default({}),
  missingFields: z.array(z.string()).default([]),
  uncertainFields: z.array(z.string()).default([]),
  extractionNotes: z.array(z.string()).default([]),
});
export type RawExtraction = z.infer<typeof RawExtractionSchema>;

// Normalized Nutrition Values (computed per 100g and per serving)
export const NormalizedNutritionValuesSchema = z.object({
  caloriesKcal: z.number().nullable(),
  proteinG: z.number().nullable(),
  carbohydratesG: z.number().nullable(),
  totalSugarsG: z.number().nullable(),
  addedSugarsG: z.number().nullable(),
  totalFatG: z.number().nullable(),
  saturatedFatG: z.number().nullable(),
  transFatG: z.number().nullable(),
  cholesterolMg: z.number().nullable(),
  sodiumMg: z.number().nullable(),
  saltG: z.number().nullable(),
  fibreG: z.number().nullable(),
  micronutrients: z.array(MicronutrientSchema),
});
export type NormalizedNutritionValues = z.infer<typeof NormalizedNutritionValuesSchema>;

// User Preferences / Dietary Restrictions
export const UserPreferencesSchema = z.object({
  allergens: z.array(z.string()).default([]),
  dietaryPreferences: z.array(z.string()).default([]),
  goals: z.array(z.string()).default([]),
  customServingSize: z.number().optional(),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;

// Ingredient Intelligence finding
export const IngredientFindingSchema = z.object({
  ingredient: z.string(),
  cleanName: z.string(),
  insNumber: z.string().nullable().optional(),
  purpose: z.string(), // e.g. "Natural Emulsifier", "Preservative", "Artificial Sweetener", "Primary Whole Grain"
  category: z.enum([
    "whole_food",
    "sweetener",
    "fat_oil",
    "preservative",
    "emulsifier_stabilizer",
    "color_flavor",
    "acid_regulator",
    "fortification",
    "other"
  ]),
  evidenceSummary: z.string(),
  context: z.string(), // dosage, scientific consensus, FSSAI / Codex context
  severity: z.enum(["favorable", "neutral", "watch", "caution"]),
  confidence: z.enum(["high", "medium", "uncertain"]),
  source: z.string(), // e.g. "FSSAI Guidelines / Codex Alimentarius"
});
export type IngredientFinding = z.infer<typeof IngredientFindingSchema>;

// Restriction match status
export const RestrictionCheckSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(["allergen", "dietary_preference"]),
  status: z.enum(["match", "no_match_detected", "uncertain", "may_contain_match"]),
  matchedText: z.string().nullable(),
  isDirectIngredient: z.boolean(),
  isMayContain: z.boolean(),
  explanation: z.string(),
});
export type RestrictionCheck = z.infer<typeof RestrictionCheckSchema>;

// Rating score breakdown
export const RatingDimensionSchema = z.object({
  dimension: z.string(),
  name: z.string(),
  score: z.number(), // -10 to +10 contribution
  maxScore: z.number(),
  status: z.enum(["positive", "neutral", "warning", "missing"]),
  observedValue: z.string(),
  benchmark: z.string(),
  reason: z.string(),
});
export type RatingDimension = z.infer<typeof RatingDimensionSchema>;

// Overall Transparent Product Rating (AnnaDrishti Index v1.0)
export const ProductRatingSchema = z.object({
  score: z.number().min(0).max(100),
  band: z.enum(["green", "amber", "red"]),
  headline: z.string(),
  summary: z.string(),
  formulaVersion: z.literal("AnnaDrishti Index v1.0"),
  breakdown: z.array(RatingDimensionSchema),
  penalties: z.array(z.string()),
  bonuses: z.array(z.string()),
  limitations: z.array(z.string()),
  fssaiDisclaimer: z.string(),
});
export type ProductRating = z.infer<typeof ProductRatingSchema>;

// Alternatives Product
export const AlternativeProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  category: z.string(),
  source: z.literal("Open Food Facts"),
  productUrl: z.string().optional(),
  comparisonGoal: z.string(), // e.g. "Lower Sugar (-62%)", "Higher Fibre (+4g/100g)"
  nutriments: z.object({
    caloriesKcal: z.number().nullable().optional(),
    sugarsG: z.number().nullable().optional(),
    fibreG: z.number().nullable().optional(),
    sodiumMg: z.number().nullable().optional(),
    proteinG: z.number().nullable().optional(),
    saturatedFatG: z.number().nullable().optional(),
  }),
  differenceHighlights: z.array(z.string()),
});
export type AlternativeProduct = z.infer<typeof AlternativeProductSchema>;

// Complete Analysis Result
export const AnalysisResultSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  isDemo: z.boolean().default(false),
  product: z.object({
    name: z.string(),
    brand: z.string().nullable(),
    category: z.string().nullable(),
  }),
  nutrition: z.object({
    basis: z.enum(["per_100g", "per_serving", "both", "unknown"]),
    servingSizeDisplay: z.string().nullable(),
    per100g: NormalizedNutritionValuesSchema,
    perServing: NormalizedNutritionValuesSchema.nullable(),
    missingFields: z.array(z.string()),
    uncertainFields: z.array(z.string()),
  }),
  ingredientFindings: z.array(IngredientFindingSchema),
  ingredientsOriginalText: z.string().nullable(),
  restrictionChecks: z.array(RestrictionCheckSchema),
  rating: ProductRatingSchema,
  alternatives: z.array(AlternativeProductSchema),
  dataQuality: z.object({
    confidence: z.enum(["high", "medium", "low"]),
    completenessPercent: z.number(),
    notes: z.array(z.string()),
    warnings: z.array(z.string()),
    canUserEdit: z.boolean(),
  }),
  disclaimer: z.string(),
});
export type AnalysisResult = z.infer<typeof AnalysisResultSchema>;
