"use client";

import React from "react";
import { ShieldAlert, Leaf, Check, Sparkles, Target } from "lucide-react";
import { SUPPORTED_RESTRICTIONS } from "@/lib/restrictions";
import { UserPreferences } from "@/lib/schemas";

interface RestrictionsSelectorProps {
  preferences: UserPreferences;
  onChange: (updated: UserPreferences) => void;
  disabled?: boolean;
}

export function RestrictionsSelector({ preferences, onChange, disabled = false }: RestrictionsSelectorProps) {
  const allergens = SUPPORTED_RESTRICTIONS.filter((r) => r.type === "allergen");
  const dietaryPrefs = SUPPORTED_RESTRICTIONS.filter((r) => r.type === "dietary_preference");

  const GOAL_OPTIONS = [
    { id: "lower-sugar", label: "Lower Sugar", icon: "🌱", desc: "Flag added sugars & find low-sugar swaps" },
    { id: "higher-fibre", label: "Higher Fibre", icon: "🌾", desc: "Target whole grains and gut-friendly fibre" },
    { id: "lower-sodium", label: "Lower Sodium / Salt", icon: "💧", desc: "Hypertension-friendly low salt profile" },
    { id: "higher-protein", label: "Higher Protein", icon: "💪", desc: "Prioritize legumes & high-protein alternatives" },
  ];

  const toggleAllergen = (id: string) => {
    if (disabled) return;
    const exists = preferences.allergens.includes(id);
    const updated = exists
      ? preferences.allergens.filter((a) => a !== id)
      : [...preferences.allergens, id];
    onChange({ ...preferences, allergens: updated });
  };

  const toggleDiet = (id: string) => {
    if (disabled) return;
    const exists = preferences.dietaryPreferences.includes(id);
    const updated = exists
      ? preferences.dietaryPreferences.filter((d) => d !== id)
      : [...preferences.dietaryPreferences, id];
    onChange({ ...preferences, dietaryPreferences: updated });
  };

  const toggleGoal = (id: string) => {
    if (disabled) return;
    const exists = preferences.goals.includes(id);
    const updated = exists
      ? preferences.goals.filter((g) => g !== id)
      : [...preferences.goals, id];
    onChange({ ...preferences, goals: updated });
  };

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            Personal Health & Dietary Filters
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            Select declared allergens or dietary requirements to check against extracted ingredients
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 self-start sm:self-auto">
          Optional Customization
        </span>
      </div>

      {/* Allergens Group */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
          <span>Declared Allergens (Deterministic Safety Check)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {allergens.map((item) => {
            const isSelected = preferences.allergens.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleAllergen(item.id)}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-rose-700 text-white shadow-sm ring-2 ring-rose-400"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dietary Preferences Group */}
      <div className="space-y-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <Leaf className="w-3.5 h-3.5" />
          <span>Dietary Preferences</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryPrefs.map((item) => {
            const isSelected = preferences.dietaryPreferences.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleDiet(item.id)}
                disabled={disabled}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-400"
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Healthier Comparison Goals */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <label className="text-xs font-semibold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          <span>Alternative Product Comparison Goal</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = preferences.goals.includes(goal.id);
            return (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                disabled={disabled}
                className={`text-left p-3 rounded-2xl border transition-all ${
                  isSelected
                    ? "border-amber-600 bg-amber-50/80 ring-2 ring-amber-400"
                    : "border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{goal.icon}</span>
                  <span className="text-xs font-bold text-stone-900">{goal.label}</span>
                </div>
                <p className="text-[11px] text-stone-500 mt-1 leading-snug">{goal.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
