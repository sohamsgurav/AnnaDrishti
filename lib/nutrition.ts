import { NormalizedNutritionValues } from "./schemas";

/**
 * Standard adult reference daily values based on ICMR-NIN (Indian Council of Medical Research -
 * National Institute of Nutrition) & WHO Dietary Guidelines for a 2,000 kcal diet.
 */
export const DAILY_REFERENCE_VALUES = {
  caloriesKcal: 2000,
  proteinG: 54, // ICMR 2020 adult reference
  carbohydratesG: 275,
  totalSugarsG: 50,
  addedSugarsG: 25, // WHO < 25g/day strict recommendation
  totalFatG: 67, // < 30% of energy
  saturatedFatG: 22, // < 10% of energy
  transFatG: 2, // FSSAI mandated < 2% total fat
  sodiumMg: 2000, // ICMR/WHO limit (equivalent to 5g salt)
  saltG: 5,
  fibreG: 30, // ICMR 2020 recommended intake for Indian adults
};

export type TrafficLightLevel = "low" | "medium" | "high";

export interface NutrientAssessment {
  nutrient: string;
  name: string;
  amount: number | null;
  unit: string;
  level: TrafficLightLevel;
  percentDailyValue: number | null; // Based on per-serving or per-100g
  benchmarkText: string;
  isDesirableWhenHigh: boolean; // true for fibre, protein; false for sugar, sodium, sat fat
}

/**
 * Evaluates traffic-light level per 100g of solid food according to standard UK/FSSAI nutritional profiling.
 */
export function evaluateTrafficLight(nutrient: string, valPer100g: number | null): TrafficLightLevel {
  if (valPer100g === null || valPer100g === undefined) return "medium";

  switch (nutrient) {
    case "totalSugarsG":
    case "addedSugarsG":
      if (valPer100g <= 5) return "low";
      if (valPer100g > 22.5) return "high";
      return "medium";

    case "saturatedFatG":
      if (valPer100g <= 1.5) return "low";
      if (valPer100g > 5.0) return "high";
      return "medium";

    case "totalFatG":
      if (valPer100g <= 3.0) return "low";
      if (valPer100g > 17.5) return "high";
      return "medium";

    case "sodiumMg":
      if (valPer100g <= 120) return "low";
      if (valPer100g > 600) return "high";
      return "medium";

    case "saltG":
      if (valPer100g <= 0.3) return "low";
      if (valPer100g > 1.5) return "high";
      return "medium";

    case "fibreG":
      if (valPer100g >= 6) return "high";
      if (valPer100g >= 3) return "medium";
      return "low";

    case "proteinG":
      if (valPer100g >= 12) return "high";
      if (valPer100g >= 6) return "medium";
      return "low";

    default:
      return "medium";
  }
}

export function assessNutritionProfile(
  per100g: NormalizedNutritionValues,
  perServing: NormalizedNutritionValues | null
): NutrientAssessment[] {
  const effective = perServing || per100g;

  const nutrients: Array<{
    key: keyof NormalizedNutritionValues;
    name: string;
    unit: string;
    rdi: number;
    isDesirableHigh: boolean;
  }> = [
    { key: "caloriesKcal", name: "Energy", unit: "kcal", rdi: DAILY_REFERENCE_VALUES.caloriesKcal, isDesirableHigh: false },
    { key: "proteinG", name: "Protein", unit: "g", rdi: DAILY_REFERENCE_VALUES.proteinG, isDesirableHigh: true },
    { key: "carbohydratesG", name: "Carbohydrates", unit: "g", rdi: DAILY_REFERENCE_VALUES.carbohydratesG, isDesirableHigh: false },
    { key: "totalSugarsG", name: "Total Sugars", unit: "g", rdi: DAILY_REFERENCE_VALUES.totalSugarsG, isDesirableHigh: false },
    { key: "addedSugarsG", name: "Added Sugars", unit: "g", rdi: DAILY_REFERENCE_VALUES.addedSugarsG, isDesirableHigh: false },
    { key: "totalFatG", name: "Total Fat", unit: "g", rdi: DAILY_REFERENCE_VALUES.totalFatG, isDesirableHigh: false },
    { key: "saturatedFatG", name: "Saturated Fat", unit: "g", rdi: DAILY_REFERENCE_VALUES.saturatedFatG, isDesirableHigh: false },
    { key: "transFatG", name: "Trans Fat", unit: "g", rdi: DAILY_REFERENCE_VALUES.transFatG, isDesirableHigh: false },
    { key: "sodiumMg", name: "Sodium", unit: "mg", rdi: DAILY_REFERENCE_VALUES.sodiumMg, isDesirableHigh: false },
    { key: "fibreG", name: "Dietary Fibre", unit: "g", rdi: DAILY_REFERENCE_VALUES.fibreG, isDesirableHigh: true },
  ];

  return nutrients.map((item) => {
    const valPer100g = per100g[item.key] as number | null;
    const effectiveVal = effective[item.key] as number | null;
    const level = evaluateTrafficLight(item.key, valPer100g);
    const percentDailyValue =
      effectiveVal !== null && effectiveVal !== undefined
        ? Math.round((effectiveVal / item.rdi) * 100)
        : null;

    let benchmarkText = "";
    if (valPer100g !== null) {
      if (item.isDesirableHigh) {
        benchmarkText = level === "high" ? "Rich source (≥6g/100g)" : level === "medium" ? "Good source (≥3g/100g)" : "Low content";
      } else {
        benchmarkText = level === "high" ? "High (> threshold)" : level === "medium" ? "Moderate" : "Low (favourable)";
      }
    } else {
      benchmarkText = "Not declared on label";
    }

    return {
      nutrient: item.key,
      name: item.name,
      amount: effectiveVal,
      unit: item.unit,
      level,
      percentDailyValue,
      benchmarkText,
      isDesirableWhenHigh: item.isDesirableHigh,
    };
  });
}
