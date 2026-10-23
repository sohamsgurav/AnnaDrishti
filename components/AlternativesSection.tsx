"use client";

import React from "react";
import { AlternativeProduct } from "@/lib/schemas";
import { Sparkles, ArrowRight, ExternalLink, Check, AlertCircle } from "lucide-react";

interface AlternativesSectionProps {
  alternatives: AlternativeProduct[];
  category?: string | null;
}

export function AlternativesSection({ alternatives, category }: AlternativesSectionProps) {
  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" />
            Verified Healthier Alternatives
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            Real products sourced from Open Food Facts database in {category || "the same category"}
          </p>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
          Source: Open Food Facts
        </span>
      </div>

      {alternatives.length === 0 ? (
        <div className="rounded-2xl bg-stone-50 border border-stone-200 p-6 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-stone-400 mx-auto" />
          <h4 className="font-semibold text-stone-700 text-sm">No verified alternatives found</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            In accordance with AnnaDrishti integrity principles, we never fabricate product recommendations. No verified healthier matches with complete nutritional profiles are currently indexed for this specific category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternatives.map((alt) => (
            <div
              key={alt.id}
              className="rounded-2xl border border-stone-200 hover:border-emerald-600/70 p-5 bg-gradient-to-br from-white to-stone-50/50 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Header Badge & Brand */}
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                      {alt.brand || "Verified Brand"}
                    </span>
                    <h4 className="font-bold text-stone-900 text-base">{alt.name}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    {alt.comparisonGoal}
                  </span>
                </div>

                {/* Key differences bullets */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-stone-600 uppercase tracking-wide">
                    Why it&apos;s a stronger choice:
                  </p>
                  <ul className="space-y-1">
                    {alt.differenceHighlights.map((diff, i) => (
                      <li key={i} className="text-xs text-stone-700 flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition snapshot pills */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-100 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Sugars</span>
                    <span className="font-bold text-stone-800">
                      {alt.nutriments.sugarsG !== null && alt.nutriments.sugarsG !== undefined
                        ? `${alt.nutriments.sugarsG}g`
                        : "—"}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Fibre</span>
                    <span className="font-bold text-emerald-800">
                      {alt.nutriments.fibreG !== null && alt.nutriments.fibreG !== undefined
                        ? `${alt.nutriments.fibreG}g`
                        : "—"}
                    </span>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-stone-200">
                    <span className="text-[10px] text-stone-400 block">Sodium</span>
                    <span className="font-bold text-stone-800">
                      {alt.nutriments.sodiumMg !== null && alt.nutriments.sodiumMg !== undefined
                        ? `${alt.nutriments.sodiumMg}mg`
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Product link */}
              {alt.productUrl && (
                <div className="pt-2 border-t border-stone-100">
                  <a
                    href={alt.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <span>View on Open Food Facts</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
