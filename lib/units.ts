import { RawNutrition, NormalizedNutritionValues } from "./schemas";

/**
 * Normalizes raw nutrition table data into structured per-100g and per-serving numbers.
 * Crucial rule: Unknown or unlisted values must remain `null`. Never guess or convert null to 0!
 */

export function saltToSodiumMg(saltG: number | null | undefined): number | null {
  if (saltG === null || saltG === undefined || isNaN(saltG)) return null;
  // 1g salt contains ~0.4g (400mg) sodium. Formula: sodium (mg) = (salt (g) / 2.5) * 1000 = salt (g) * 400
  return Math.round(saltG * 400);
}

export function sodiumMgToSaltG(sodiumMg: number | null | undefined): number | null {
  if (sodiumMg === null || sodiumMg === undefined || isNaN(sodiumMg)) return null;
  // salt (g) = (sodium (mg) * 2.5) / 1000
  return Number(((sodiumMg * 2.5) / 1000).toFixed(2));
}

export function kjToKcal(kj: number | null | undefined): number | null {
  if (kj === null || kj === undefined || isNaN(kj)) return null;
  return Math.round(kj / 4.184);
}

export interface NormalizedNutritionPair {
  basis: "per_100g" | "per_serving" | "both" | "unknown";
  servingSizeDisplay: string | null;
  per100g: NormalizedNutritionValues;
  perServing: NormalizedNutritionValues | null;
  missingFields: string[];
  uncertainFields: string[];
}

export function normalizeNutritionData(raw: RawNutrition): NormalizedNutritionPair {
  const servingSize = raw.servingSize && raw.servingSize > 0 ? raw.servingSize : null;
  const servingUnit = raw.servingUnit || "g";
  const servingSizeDisplay = servingSize ? `${servingSize} ${servingUnit}` : null;

  // Resolve sodium and salt cross-dependency if one is missing
  let sodiumMg = raw.sodiumMg ?? null;
  let saltG = raw.saltG ?? null;

  if (sodiumMg === null && saltG !== null) {
    sodiumMg = saltToSodiumMg(saltG);
  } else if (saltG === null && sodiumMg !== null) {
    saltG = sodiumMgToSaltG(sodiumMg);
  }

  const baseValues: NormalizedNutritionValues = {
    caloriesKcal: raw.caloriesKcal ?? null,
    proteinG: raw.proteinG !== undefined && raw.proteinG !== null ? Number(raw.proteinG.toFixed(1)) : null,
    carbohydratesG: raw.carbohydratesG !== undefined && raw.carbohydratesG !== null ? Number(raw.carbohydratesG.toFixed(1)) : null,
    totalSugarsG: raw.totalSugarsG !== undefined && raw.totalSugarsG !== null ? Number(raw.totalSugarsG.toFixed(1)) : null,
    addedSugarsG: raw.addedSugarsG !== undefined && raw.addedSugarsG !== null ? Number(raw.addedSugarsG.toFixed(1)) : null,
    totalFatG: raw.totalFatG !== undefined && raw.totalFatG !== null ? Number(raw.totalFatG.toFixed(1)) : null,
    saturatedFatG: raw.saturatedFatG !== undefined && raw.saturatedFatG !== null ? Number(raw.saturatedFatG.toFixed(1)) : null,
    transFatG: raw.transFatG !== undefined && raw.transFatG !== null ? Number(raw.transFatG.toFixed(2)) : null,
    cholesterolMg: raw.cholesterolMg ?? null,
    sodiumMg: sodiumMg !== null ? Math.round(sodiumMg) : null,
    saltG: saltG !== null ? Number(saltG.toFixed(2)) : null,
    fibreG: raw.fibreG !== undefined && raw.fibreG !== null ? Number(raw.fibreG.toFixed(1)) : null,
    micronutrients: raw.micronutrients || [],
  };

  // Determine missing fields list
  const criticalNutrients: Array<keyof NormalizedNutritionValues> = [
    "caloriesKcal",
    "proteinG",
    "carbohydratesG",
    "totalSugarsG",
    "addedSugarsG",
    "totalFatG",
    "saturatedFatG",
    "transFatG",
    "sodiumMg",
    "fibreG",
  ];

  const missingFields: string[] = [];
  criticalNutrients.forEach((key) => {
    if (baseValues[key] === null) {
      missingFields.push(key);
    }
  });

  const basis = raw.basis || (servingSize ? "per_serving" : "per_100g");

  let per100g: NormalizedNutritionValues;
  let perServing: NormalizedNutritionValues | null = null;

  if (basis === "per_100g") {
    per100g = { ...baseValues };
    if (servingSize && (servingUnit === "g" || servingUnit === "ml")) {
      const factor = servingSize / 100;
      perServing = scaleNutritionValues(baseValues, factor);
    }
  } else if (basis === "per_serving") {
    perServing = { ...baseValues };
    if (servingSize && (servingUnit === "g" || servingUnit === "ml") && servingSize > 0) {
      const factor = 100 / servingSize;
      per100g = scaleNutritionValues(baseValues, factor);
    } else {
      // If per_serving was reported but serving weight is unknown, per100g cannot be safely calculated
      per100g = { ...baseValues };
    }
  } else {
    // Both or unknown: treat base values as per100g
    per100g = { ...baseValues };
    if (servingSize) {
      const factor = servingSize / 100;
      perServing = scaleNutritionValues(baseValues, factor);
    }
  }

  return {
    basis,
    servingSizeDisplay,
    per100g,
    perServing,
    missingFields,
    uncertainFields: [],
  };
}

function scaleNutritionValues(values: NormalizedNutritionValues, factor: number): NormalizedNutritionValues {
  const scale = (val: number | null, decimals = 1): number | null => {
    if (val === null || val === undefined) return null;
    return Number((val * factor).toFixed(decimals));
  };

  return {
    caloriesKcal: values.caloriesKcal !== null ? Math.round(values.caloriesKcal * factor) : null,
    proteinG: scale(values.proteinG, 1),
    carbohydratesG: scale(values.carbohydratesG, 1),
    totalSugarsG: scale(values.totalSugarsG, 1),
    addedSugarsG: scale(values.addedSugarsG, 1),
    totalFatG: scale(values.totalFatG, 1),
    saturatedFatG: scale(values.saturatedFatG, 1),
    transFatG: scale(values.transFatG, 2),
    cholesterolMg: scale(values.cholesterolMg, 1),
    sodiumMg: values.sodiumMg !== null ? Math.round(values.sodiumMg * factor) : null,
    saltG: scale(values.saltG, 2),
    fibreG: scale(values.fibreG, 1),
    micronutrients: values.micronutrients.map((m) => ({
      ...m,
      amount: m.amount !== null && m.amount !== undefined ? Number((m.amount * factor).toFixed(2)) : null,
    })),
  };
}
