"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, Edit3, Save, X, RefreshCw } from "lucide-react";
import { NormalizedNutritionValues } from "@/lib/schemas";

interface ConfidenceNoticeProps {
  confidence: "high" | "medium" | "low";
  completenessPercent: number;
  notes: string[];
  warnings: string[];
  per100g: NormalizedNutritionValues;
  onUpdateNutrition?: (updated: NormalizedNutritionValues) => void;
  onRetake?: () => void;
}

export function ConfidenceNotice({
  confidence,
  completenessPercent,
  notes,
  warnings,
  per100g,
  onUpdateNutrition,
  onRetake,
}: ConfidenceNoticeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NormalizedNutritionValues>(per100g);

  const confidenceBadge = {
    high: {
      bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
      label: "High OCR Clarity (≥80% Complete)",
      icon: <CheckCircle className="w-4 h-4 text-emerald-700" />,
    },
    medium: {
      bg: "bg-amber-100 text-amber-800 border-amber-300",
      label: "Moderate Clarity / Partial Panel",
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
    },
    low: {
      bg: "bg-rose-100 text-rose-800 border-rose-300",
      label: "Low Optical Clarity / Missing Data",
      icon: <ShieldAlert className="w-4 h-4 text-rose-600" />,
    },
  }[confidence];

  const handleFieldChange = (field: keyof NormalizedNutritionValues, val: string) => {
    const num = val === "" ? null : Number(val);
    setFormData((prev) => ({
      ...prev,
      [field]: isNaN(num as any) ? null : num,
    }));
  };

  const handleSave = () => {
    if (onUpdateNutrition) {
      onUpdateNutrition(formData);
    }
    setIsEditing(false);
  };

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-stone-700" />
            Label Data Integrity &amp; Confidence
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            Transparency on optical character recognition legibility and unlisted fields
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${confidenceBadge.bg}`}>
            {confidenceBadge.icon}
            <span>{confidenceBadge.label}</span>
          </span>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
            {completenessPercent}% Complete
          </span>
        </div>
      </div>

      {/* Warnings & Notes */}
      <div className="space-y-3">
        {warnings.length > 0 && (
          <div className="space-y-1.5">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-amber-900 bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        )}

        {notes.length > 0 && (
          <div className="space-y-1 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <p className="font-semibold text-stone-700">Vision Model Extraction Notes:</p>
            <ul className="list-disc list-inside space-y-0.5 text-stone-500">
              {notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* User Correction & Retake Actions */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setFormData(per100g);
            setIsEditing(!isEditing);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-xl transition-colors"
        >
          <Edit3 className="w-4 h-4 text-emerald-800" />
          <span>{isEditing ? "Close Editor" : "Review / Correct Extracted Values"}</span>
        </button>

        {onRetake && (
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Label Photo</span>
          </button>
        )}
      </div>

      {/* Inline Editor Drawer */}
      {isEditing && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/40 p-5 space-y-4">
          <div>
            <h4 className="font-bold text-stone-900 text-sm">
              Manual Correction (Per 100g basis)
            </h4>
            <p className="text-xs text-stone-500">
              Did the camera miss a value or was text blurred? Edit numbers here to recalculate the AnnaDrishti score instantly.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={formData.caloriesKcal ?? ""}
                onChange={(e) => handleFieldChange("caloriesKcal", e.target.value)}
                placeholder="e.g. 450"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Protein (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.proteinG ?? ""}
                onChange={(e) => handleFieldChange("proteinG", e.target.value)}
                placeholder="e.g. 8.5"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Total Sugars (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.totalSugarsG ?? ""}
                onChange={(e) => handleFieldChange("totalSugarsG", e.target.value)}
                placeholder="e.g. 24"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Added Sugars (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.addedSugarsG ?? ""}
                onChange={(e) => handleFieldChange("addedSugarsG", e.target.value)}
                placeholder="e.g. 20"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Total Fat (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.totalFatG ?? ""}
                onChange={(e) => handleFieldChange("totalFatG", e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Saturated Fat (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.saturatedFatG ?? ""}
                onChange={(e) => handleFieldChange("saturatedFatG", e.target.value)}
                placeholder="e.g. 5"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Sodium (mg)</label>
              <input
                type="number"
                value={formData.sodiumMg ?? ""}
                onChange={(e) => handleFieldChange("sodiumMg", e.target.value)}
                placeholder="e.g. 400"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Dietary Fibre (g)</label>
              <input
                type="number"
                step="0.1"
                value={formData.fibreG ?? ""}
                onChange={(e) => handleFieldChange("fibreG", e.target.value)}
                placeholder="e.g. 3.2"
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-700 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save &amp; Recalculate Rating
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-2 rounded-xl text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
