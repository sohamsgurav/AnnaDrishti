"use client";

import React, { useState } from "react";
import { NormalizedNutritionValues, Micronutrient } from "@/lib/schemas";
import { assessNutritionProfile } from "@/lib/nutrition";
import { Flame, Dumbbell, Wheat, HeartPulse, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

interface NutritionDashboardProps {
  per100g: NormalizedNutritionValues;
  perServing: NormalizedNutritionValues | null;
  servingSizeDisplay: string | null;
  basis: string;
  missingFields: string[];
}

export function NutritionDashboard({
  per100g,
  perServing,
  servingSizeDisplay,
  basis,
  missingFields,
}: NutritionDashboardProps) {
  const [viewMode, setViewMode] = useState<"per_serving" | "per_100g">(
    perServing ? "per_serving" : "per_100g"
  );

  const activeValues = viewMode === "per_serving" && perServing ? perServing : per100g;
  const assessment = assessNutritionProfile(per100g, perServing);

  const getTrafficColor = (level: "low" | "medium" | "high", isDesirableHigh: boolean) => {
    if (isDesirableHigh) {
      if (level === "high") return "bg-emerald-100 text-emerald-800 border-emerald-300";
      if (level === "medium") return "bg-emerald-50 text-emerald-700 border-emerald-200";
      return "bg-stone-100 text-stone-600 border-stone-200";
    } else {
      if (level === "high") return "bg-rose-100 text-rose-800 border-rose-300";
      if (level === "medium") return "bg-amber-100 text-amber-800 border-amber-300";
      return "bg-emerald-100 text-emerald-800 border-emerald-300";
    }
  };

  const getTrafficText = (level: "low" | "medium" | "high", isDesirableHigh: boolean) => {
    if (isDesirableHigh) {
      return level === "high" ? "Rich Source" : level === "medium" ? "Good Source" : "Low Content";
    } else {
      return level === "high" ? "High (Limit)" : level === "medium" ? "Moderate" : "Low (Favourable)";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Unit Basis Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
        <div>
          <h3 className="font-bold text-stone-900 text-lg flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-700" />
            Nutritional Intelligence Panel
          </h3>
          <p className="text-xs text-stone-500">
            Source declared basis:{" "}
            <span className="font-semibold text-stone-700 capitalize">{basis.replace("_", " ")}</span>
            {servingSizeDisplay && ` • Serving portion: ${servingSizeDisplay}`}
          </p>
        </div>

        {/* Serving / 100g toggle */}
        <div className="inline-flex rounded-xl p-1 bg-stone-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("per_serving")}
            disabled={!perServing}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "per_serving"
                ? "bg-white text-emerald-900 shadow-sm"
                : perServing
                ? "text-stone-600 hover:text-stone-900"
                : "text-stone-400 cursor-not-allowed"
            }`}
          >
            Per Serving {servingSizeDisplay ? `(${servingSizeDisplay})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("per_100g")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === "per_100g"
                ? "bg-white text-emerald-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            Per 100 g / ml
          </button>
        </div>
      </div>

      {/* Primary Nutritional Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Calories */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1 font-medium">
              <Flame className="w-4 h-4 text-orange-600" /> Energy
            </span>
            <span className="text-[11px] font-mono text-stone-400">kcal</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.caloriesKcal !== null ? activeValues.caloriesKcal : "—"}
          </div>
          <p className="text-[11px] text-stone-500">
            {activeValues.caloriesKcal !== null
              ? `~${Math.round((activeValues.caloriesKcal / 2000) * 100)}% of 2,000 kcal RDA`
              : "Not visible on label"}
          </p>
        </div>

        {/* Protein */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1 font-medium">
              <Dumbbell className="w-4 h-4 text-emerald-700" /> Protein
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTrafficColor(
                assessment.find((a) => a.nutrient === "proteinG")?.level || "medium",
                true
              )}`}
            >
              {getTrafficText(
                assessment.find((a) => a.nutrient === "proteinG")?.level || "medium",
                true
              )}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.proteinG !== null ? `${activeValues.proteinG}g` : "—"}
          </div>
          <p className="text-[11px] text-stone-500">
            {activeValues.proteinG !== null
              ? `~${Math.round((activeValues.proteinG / 54) * 100)}% of daily protein target (54g)`
              : "Not declared on label"}
          </p>
        </div>

        {/* Total Sugars & Added Sugars */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700">Total Sugars</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTrafficColor(
                assessment.find((a) => a.nutrient === "totalSugarsG")?.level || "medium",
                false
              )}`}
            >
              {getTrafficText(
                assessment.find((a) => a.nutrient === "totalSugarsG")?.level || "medium",
                false
              )}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.totalSugarsG !== null ? `${activeValues.totalSugarsG}g` : "—"}
          </div>
          <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-1.5 flex items-center justify-between">
            <span>Added Sugars:</span>
            <span className="font-semibold text-stone-800">
              {activeValues.addedSugarsG !== null ? `${activeValues.addedSugarsG}g` : "Not Listed"}
            </span>
          </div>
        </div>

        {/* Dietary Fibre */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1 font-medium">
              <Wheat className="w-4 h-4 text-amber-700" /> Dietary Fibre
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTrafficColor(
                assessment.find((a) => a.nutrient === "fibreG")?.level || "medium",
                true
              )}`}
            >
              {getTrafficText(
                assessment.find((a) => a.nutrient === "fibreG")?.level || "medium",
                true
              )}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.fibreG !== null ? `${activeValues.fibreG}g` : "—"}
          </div>
          <p className="text-[11px] text-stone-500">
            {activeValues.fibreG !== null
              ? `~${Math.round((activeValues.fibreG / 30) * 100)}% of 30g daily goal`
              : "Omitted on label (typical of ultra-processed items)"}
          </p>
        </div>

        {/* Total Fat & Saturated Fat */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700">Total Fat</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTrafficColor(
                assessment.find((a) => a.nutrient === "totalFatG")?.level || "medium",
                false
              )}`}
            >
              {getTrafficText(
                assessment.find((a) => a.nutrient === "totalFatG")?.level || "medium",
                false
              )}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.totalFatG !== null ? `${activeValues.totalFatG}g` : "—"}
          </div>
          <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-1.5 space-y-0.5">
            <div className="flex items-center justify-between">
              <span>Saturated Fat:</span>
              <span className="font-semibold text-stone-800">
                {activeValues.saturatedFatG !== null ? `${activeValues.saturatedFatG}g` : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Trans Fat:</span>
              <span className="font-semibold text-stone-800">
                {activeValues.transFatG !== null ? `${activeValues.transFatG}g` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Sodium & Salt */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700">Sodium / Salt</span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getTrafficColor(
                assessment.find((a) => a.nutrient === "sodiumMg")?.level || "medium",
                false
              )}`}
            >
              {getTrafficText(
                assessment.find((a) => a.nutrient === "sodiumMg")?.level || "medium",
                false
              )}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.sodiumMg !== null ? `${activeValues.sodiumMg}mg` : "—"}
          </div>
          <div className="text-[11px] text-stone-500 border-t border-stone-100 pt-1.5 flex items-center justify-between">
            <span>Equivalent Salt:</span>
            <span className="font-semibold text-stone-800">
              {activeValues.saltG !== null ? `${activeValues.saltG}g` : "—"}
            </span>
          </div>
        </div>

        {/* Total Carbohydrates */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700">Carbohydrates</span>
            <span className="text-[10px] font-mono text-stone-400">Total</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.carbohydratesG !== null ? `${activeValues.carbohydratesG}g` : "—"}
          </div>
          <p className="text-[11px] text-stone-500">
            {activeValues.carbohydratesG !== null
              ? `Includes starches and listed sugars`
              : "Not declared on label"}
          </p>
        </div>

        {/* Cholesterol */}
        <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-medium text-stone-700">Cholesterol</span>
            <span className="text-[10px] font-mono text-stone-400">Lipids</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {activeValues.cholesterolMg !== null ? `${activeValues.cholesterolMg}mg` : "0mg / Unlisted"}
          </div>
          <p className="text-[11px] text-stone-500">Typical plant-based foods have 0mg cholesterol</p>
        </div>
      </div>

      {/* Micronutrients Table if present */}
      {activeValues.micronutrients && activeValues.micronutrients.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Vitamins & Minerals Declared on Label
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeValues.micronutrients.map((micro: Micronutrient, idx: number) => (
              <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200/70">
                <p className="text-xs font-semibold text-stone-800">{micro.name}</p>
                <p className="text-sm font-bold text-emerald-900 mt-0.5">
                  {micro.amount !== null && micro.amount !== undefined
                    ? `${micro.amount} ${micro.unit || ""}`
                    : "Declared"}
                </p>
                {micro.percentRda !== null && micro.percentRda !== undefined && (
                  <p className="text-[10px] text-stone-500 mt-0.5">{micro.percentRda}% Daily Value</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Values Notice Banner */}
      {missingFields.length > 0 && (
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900">
            <span className="font-semibold">Missing Nutritional Declarations: </span>
            The manufacturer omitted standard values for:{" "}
            <span className="font-mono font-medium text-amber-800">
              {missingFields.map((f) => f.replace("G", " (g)").replace("Mg", " (mg)")).join(", ")}
            </span>
            . Per AnnaDrishti standards, missing values are never guessed.
          </div>
        </div>
      )}
    </div>
  );
}
