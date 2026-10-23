"use client";

import React from "react";
import { ProductRating, RatingDimension } from "@/lib/schemas";
import { ShieldCheck, AlertTriangle, CheckCircle, Info, AlertOctagon, HelpCircle } from "lucide-react";

interface ProductRatingCardProps {
  rating: ProductRating;
  hasAllergenMatch?: boolean;
}

export function ProductRatingCard({ rating, hasAllergenMatch = false }: ProductRatingCardProps) {
  const bandStyles = {
    green: {
      badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
      gaugeBorder: "border-emerald-600 text-emerald-700 bg-emerald-50/50",
      strokeColor: "#059669",
      trackColor: "#d1fae5",
      textColor: "text-emerald-700",
      icon: <CheckCircle className="w-5 h-5 text-emerald-700" />,
      tag: "Favourable Nutritional Profile",
    },
    amber: {
      badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
      gaugeBorder: "border-amber-500 text-amber-700 bg-amber-50/50",
      strokeColor: "#d97706",
      trackColor: "#fef3c7",
      textColor: "text-amber-700",
      icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
      tag: "Moderate / Mixed Profile",
    },
    red: {
      badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
      gaugeBorder: "border-rose-600 text-rose-700 bg-rose-50/50",
      strokeColor: "#e11d48",
      trackColor: "#ffe4e6",
      textColor: "text-rose-700",
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      tag: "Nutritional Concern / High-Risk",
    },
  }[rating.band];

  // SVG Gauge Calculations
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (circumference * Math.min(Math.max(rating.score, 0), 100)) / 100;

  const isPerfect = rating.score === 100;

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {rating.formulaVersion}
            </span>
            <span className="text-xs text-stone-400">• Fully Transparent Scoring</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1">
            Product Nutritional Rating
          </h3>
        </div>

        {/* Band Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {isPerfect && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-700 text-white shadow-sm">
              🌟 100% Perfect Score
            </span>
          )}
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${bandStyles.badgeBg}`}>
            {bandStyles.icon}
            <span>{bandStyles.tag}</span>
          </div>
        </div>
      </div>

      {/* Prominent Allergen Override Alert (Mandatory Rule) */}
      {hasAllergenMatch && (
        <div className="rounded-2xl bg-rose-50 border-2 border-rose-400 p-4 flex items-start gap-3">
          <AlertOctagon className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm text-rose-950">
            <strong className="font-bold text-rose-900 block">
              Safety Warning: Personal Allergen Detected
            </strong>
            <p className="text-rose-800 leading-relaxed">
              This product contains an ingredient matching your declared restriction. Regardless of this general nutrition score ({rating.score}/100), you should strictly avoid this food if you have an allergy or intolerance.
            </p>
          </div>
        </div>
      )}

      {/* Score Presentation */}
      <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8 bg-stone-50/70 p-5 sm:p-6 rounded-2xl border border-stone-200/80">
        {/* Animated SVG Radial Gauge */}
        <div className="relative flex flex-col items-center justify-center shrink-0">
          <svg className="w-32 h-32 sm:w-36 sm:h-36 -rotate-90 transform drop-shadow-sm" viewBox="0 0 120 120">
            {/* Background SVG Track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke={bandStyles.trackColor}
              strokeWidth="9"
              className="transition-all duration-300"
            />
            {/* Animated SVG Progress Arc */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="transparent"
              stroke={bandStyles.strokeColor}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
            <span className={`text-4xl sm:text-5xl font-black tracking-tight ${bandStyles.textColor}`}>
              {rating.score}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              {isPerfect ? "100% Score" : "out of 100"}
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <h4 className="text-base sm:text-lg font-bold text-stone-900">{rating.headline}</h4>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{rating.summary}</p>

          <div className="pt-2 flex flex-wrap gap-2 justify-center md:justify-start text-xs">
            {rating.bonuses.map((b, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700" /> {b}
              </span>
            ))}
            {rating.penalties.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-medium">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-700" /> {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Transparent Dimension Breakdown Table */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-700" />
          Component Scoring Breakdown (Documented Weights)
        </h4>

        <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
          {rating.breakdown.map((item: RatingDimension, idx: number) => {
            const isPos = item.score > 0;
            const isNeg = item.score < 0;
            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-stone-50/60 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-stone-900">{item.name}</span>
                    <span className="text-[11px] font-mono text-stone-500">({item.observedValue})</span>
                  </div>
                  <p className="text-xs text-stone-500">{item.reason}</p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
                    Target: {item.benchmark}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-bold px-2.5 py-0.5 rounded-lg font-mono ${
                      isPos
                        ? "bg-emerald-100 text-emerald-800"
                        : isNeg
                        ? "bg-rose-100 text-rose-800"
                        : "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {isPos ? `+${item.score}` : item.score} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Limitations & Missing Data Notes */}
      {rating.limitations.length > 0 && (
        <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80 space-y-1.5 text-xs text-stone-600">
          <div className="flex items-center gap-1.5 font-bold text-stone-800">
            <HelpCircle className="w-4 h-4 text-stone-500" />
            Limitations & Incomplete Data Penalties:
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-stone-500 pl-1">
            {rating.limitations.map((lim, i) => (
              <li key={i}>{lim}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Official FSSAI Clarification Notice */}
      <div className="rounded-2xl bg-amber-50/60 p-3.5 border border-amber-200 text-[11px] text-amber-900 leading-relaxed">
        <strong>FSSAI Legal Clarification:</strong> {rating.fssaiDisclaimer}
      </div>
    </div>
  );
}
