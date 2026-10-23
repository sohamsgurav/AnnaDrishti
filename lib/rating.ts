import { NormalizedNutritionValues, ProductRating, RatingDimension } from "./schemas";

export function calculateProductRating(
  per100g: NormalizedNutritionValues,
  missingFields: string[],
  hasAllergenMatch: boolean = false
): ProductRating {
  let score = 50; // Start at neutral baseline
  const breakdown: RatingDimension[] = [];
  const penalties: string[] = [];
  const bonuses: string[] = [];
  const limitations: string[] = [];

  // 1. Sugar Assessment (Target: < 5g/100g low; > 22.5g/100g high)
  const sugar = per100g.totalSugarsG ?? per100g.addedSugarsG;
  if (sugar === null) {
    breakdown.push({
      dimension: "sugars",
      name: "Sugar Content",
      score: 0,
      maxScore: 10,
      status: "missing",
      observedValue: "Not declared",
      benchmark: "Low: ≤5g/100g | High: >22.5g/100g",
      reason: "Sugar data not visible on label; cannot verify impact.",
    });
    limitations.push("Sugar content was unlisted or unreadable on the package.");
    score -= 4; // Missing critical field penalty
  } else if (sugar <= 5) {
    score += 8;
    bonuses.push("Low total sugar content (≤5g/100g).");
    breakdown.push({
      dimension: "sugars",
      name: "Sugar Content",
      score: 8,
      maxScore: 10,
      status: "positive",
      observedValue: `${sugar}g / 100g`,
      benchmark: "Low: ≤5g/100g",
      reason: "Favourable low-sugar formulation.",
    });
  } else if (sugar > 22.5) {
    score -= 20;
    penalties.push(`High in sugar (${sugar}g/100g exceeds high threshold of 22.5g).`);
    breakdown.push({
      dimension: "sugars",
      name: "Sugar Content",
      score: -20,
      maxScore: 10,
      status: "warning",
      observedValue: `${sugar}g / 100g`,
      benchmark: "High: >22.5g/100g",
      reason: "Exceeds recommended healthy sugar threshold.",
    });
  } else if (sugar > 12) {
    score -= 8;
    penalties.push(`Moderate-to-high sugar (${sugar}g/100g).`);
    breakdown.push({
      dimension: "sugars",
      name: "Sugar Content",
      score: -8,
      maxScore: 10,
      status: "warning",
      observedValue: `${sugar}g / 100g`,
      benchmark: "Medium: 5.1–22.5g/100g",
      reason: "Moderate sugar content; limit frequent intake.",
    });
  } else {
    breakdown.push({
      dimension: "sugars",
      name: "Sugar Content",
      score: 3,
      maxScore: 10,
      status: "neutral",
      observedValue: `${sugar}g / 100g`,
      benchmark: "Medium: 5–12g/100g",
      reason: "Moderate sugar level within acceptable bounds.",
    });
  }

  // 2. Saturated Fat Assessment (Target: ≤ 1.5g low; > 5.0g high)
  const satFat = per100g.saturatedFatG;
  if (satFat === null) {
    breakdown.push({
      dimension: "saturated_fat",
      name: "Saturated Fat",
      score: 0,
      maxScore: 8,
      status: "missing",
      observedValue: "Not declared",
      benchmark: "Low: ≤1.5g/100g | High: >5.0g/100g",
      reason: "Saturated fat not declared on the package.",
    });
    limitations.push("Saturated fat breakdown was not declared.");
    score -= 4;
  } else if (satFat <= 1.5) {
    score += 8;
    bonuses.push("Low saturated fat (≤1.5g/100g).");
    breakdown.push({
      dimension: "saturated_fat",
      name: "Saturated Fat",
      score: 8,
      maxScore: 8,
      status: "positive",
      observedValue: `${satFat}g / 100g`,
      benchmark: "Low: ≤1.5g/100g",
      reason: "Heart-favourable low saturated fat content.",
    });
  } else if (satFat > 5.0) {
    score -= 15;
    penalties.push(`High saturated fat (${satFat}g/100g exceeds 5g threshold).`);
    breakdown.push({
      dimension: "saturated_fat",
      name: "Saturated Fat",
      score: -15,
      maxScore: 8,
      status: "warning",
      observedValue: `${satFat}g / 100g`,
      benchmark: "High: >5.0g/100g",
      reason: "High saturated fat; watch for cardiovascular risk.",
    });
  } else {
    breakdown.push({
      dimension: "saturated_fat",
      name: "Saturated Fat",
      score: 2,
      maxScore: 8,
      status: "neutral",
      observedValue: `${satFat}g / 100g`,
      benchmark: "Moderate: 1.6–5.0g/100g",
      reason: "Moderate saturated fat content.",
    });
  }

  // 3. Sodium / Salt Assessment (Target: ≤ 120mg low; > 600mg high)
  const sodium = per100g.sodiumMg;
  if (sodium === null) {
    breakdown.push({
      dimension: "sodium",
      name: "Sodium / Salt",
      score: 0,
      maxScore: 7,
      status: "missing",
      observedValue: "Not declared",
      benchmark: "Low: ≤120mg | High: >600mg/100g",
      reason: "Sodium / salt values not clearly stated on label.",
    });
    limitations.push("Sodium/salt was not listed.");
    score -= 4;
  } else if (sodium <= 120) {
    score += 7;
    bonuses.push("Low sodium content (≤120mg/100g).");
    breakdown.push({
      dimension: "sodium",
      name: "Sodium / Salt",
      score: 7,
      maxScore: 7,
      status: "positive",
      observedValue: `${sodium}mg / 100g`,
      benchmark: "Low: ≤120mg/100g",
      reason: "Excellent low sodium content.",
    });
  } else if (sodium > 900) {
    score -= 20;
    penalties.push(`Very high sodium (${sodium}mg/100g — nearly half daily limit in 100g).`);
    breakdown.push({
      dimension: "sodium",
      name: "Sodium / Salt",
      score: -20,
      maxScore: 7,
      status: "warning",
      observedValue: `${sodium}mg / 100g`,
      benchmark: "Very High: >900mg/100g",
      reason: "Significantly high sodium; hypertensive watch.",
    });
  } else if (sodium > 600) {
    score -= 12;
    penalties.push(`High sodium (${sodium}mg/100g exceeds 600mg threshold).`);
    breakdown.push({
      dimension: "sodium",
      name: "Sodium / Salt",
      score: -12,
      maxScore: 7,
      status: "warning",
      observedValue: `${sodium}mg / 100g`,
      benchmark: "High: >600mg/100g",
      reason: "High sodium concentration.",
    });
  } else {
    breakdown.push({
      dimension: "sodium",
      name: "Sodium / Salt",
      score: 1,
      maxScore: 7,
      status: "neutral",
      observedValue: `${sodium}mg / 100g`,
      benchmark: "Moderate: 121–600mg/100g",
      reason: "Moderate sodium within acceptable bounds.",
    });
  }

  // 4. Dietary Fibre Assessment (Target: ≥ 6g high source; ≥ 3g source)
  const fibre = per100g.fibreG;
  if (fibre === null) {
    breakdown.push({
      dimension: "fibre",
      name: "Dietary Fibre",
      score: 0,
      maxScore: 12,
      status: "missing",
      observedValue: "Not declared",
      benchmark: "Good: ≥3g | Rich: ≥6g/100g",
      reason: "Fibre is unlisted on label.",
    });
    limitations.push("Dietary fibre is not listed (often omitted on refined foods).");
  } else if (fibre >= 6) {
    score += 12;
    bonuses.push(`Rich in dietary fibre (${fibre}g/100g).`);
    breakdown.push({
      dimension: "fibre",
      name: "Dietary Fibre",
      score: 12,
      maxScore: 12,
      status: "positive",
      observedValue: `${fibre}g / 100g`,
      benchmark: "Rich: ≥6g/100g",
      reason: "High dietary fibre supports gut health and steady energy.",
    });
  } else if (fibre >= 3) {
    score += 6;
    bonuses.push(`Good source of dietary fibre (${fibre}g/100g).`);
    breakdown.push({
      dimension: "fibre",
      name: "Dietary Fibre",
      score: 6,
      maxScore: 12,
      status: "positive",
      observedValue: `${fibre}g / 100g`,
      benchmark: "Source: ≥3g/100g",
      reason: "Provides beneficial dietary fibre.",
    });
  } else {
    breakdown.push({
      dimension: "fibre",
      name: "Dietary Fibre",
      score: 0,
      maxScore: 12,
      status: "neutral",
      observedValue: `${fibre}g / 100g`,
      benchmark: "Low: <3g/100g",
      reason: "Low dietary fibre content.",
    });
  }

  // 5. Protein Assessment (Target: ≥ 10g rich; ≥ 5g source)
  const protein = per100g.proteinG;
  if (protein === null) {
    breakdown.push({
      dimension: "protein",
      name: "Protein",
      score: 0,
      maxScore: 10,
      status: "missing",
      observedValue: "Not declared",
      benchmark: "Source: ≥5g | High: ≥10g/100g",
      reason: "Protein unlisted.",
    });
    limitations.push("Protein was not declared on the label.");
  } else if (protein >= 10) {
    score += 10;
    bonuses.push(`High protein content (${protein}g/100g).`);
    breakdown.push({
      dimension: "protein",
      name: "Protein",
      score: 10,
      maxScore: 10,
      status: "positive",
      observedValue: `${protein}g / 100g`,
      benchmark: "High: ≥10g/100g",
      reason: "Valuable contribution to daily protein requirement.",
    });
  } else if (protein >= 5) {
    score += 5;
    bonuses.push(`Source of protein (${protein}g/100g).`);
    breakdown.push({
      dimension: "protein",
      name: "Protein",
      score: 5,
      maxScore: 10,
      status: "positive",
      observedValue: `${protein}g / 100g`,
      benchmark: "Source: ≥5g/100g",
      reason: "Contains moderate protein.",
    });
  } else {
    breakdown.push({
      dimension: "protein",
      name: "Protein",
      score: 1,
      maxScore: 10,
      status: "neutral",
      observedValue: `${protein}g / 100g`,
      benchmark: "Low: <5g/100g",
      reason: "Minimal protein content.",
    });
  }

  // 6. Trans Fat Penalty
  if (per100g.transFatG !== null && per100g.transFatG > 0.2) {
    score -= 15;
    penalties.push(`Contains trans fats (${per100g.transFatG}g/100g).`);
  }

  // 7. Clean-Label / Whole Food 100% Benchmark Bonus
  // If a whole-food product achieves exemplary marks across core positive metrics (low sugar, low sat fat, low sodium, rich fibre, rich protein) with zero penalties:
  if (penalties.length === 0 && limitations.length === 0 && bonuses.length >= 4 && score >= 90) {
    score += 5;
    bonuses.push("100% Exemplary whole-food benchmark (clean formulation, zero penalties, complete declaration).");
  }

  // Clamp final score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));

  let band: ProductRating["band"];
  let headline = "";
  let summary = "";

  if (finalScore === 100) {
    band = "green";
    headline = "100% Exemplary Nutrition Profile";
    summary = "Outstanding whole-food benchmark! Packed with natural dietary fibre and plant protein, virtually sodium-free, low in saturated fat, and free from added sugars or artificial additives.";
  } else if (finalScore >= 70) {
    band = "green";
    headline = "Favourable Nutrition Profile";
    summary = "This product scores favourably against key nutritional benchmarks with balanced macronutrients or positive fibre/protein content.";
  } else if (finalScore >= 45) {
    band = "amber";
    headline = "Moderate / Mixed Nutrition Profile";
    summary = "This product contains a mix of moderate nutrients. Consume mindfully as part of a varied daily diet.";
  } else {
    band = "red";
    headline = "Nutritional Watch-Out";
    summary = "This product contains elevated concentrations of sugar, saturated fat, or sodium relative to recommended dietary thresholds.";
  }

  if (hasAllergenMatch) {
    summary += " IMPORTANT: A declared personal allergen was detected on this product. Allergen safety must always supersede this general nutrition score.";
  }

  return {
    score: finalScore,
    band,
    headline,
    summary,
    formulaVersion: "AnnaDrishti Index v1.0",
    breakdown,
    penalties,
    bonuses,
    limitations,
    fssaiDisclaimer:
      "The AnnaDrishti Index is an algorithmic, educational reference score based on WHO & ICMR-NIN nutritional thresholds. It is NOT an official FSSAI rating, medical advice, or endorsement.",
  };
}
