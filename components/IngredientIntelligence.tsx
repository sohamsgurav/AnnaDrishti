"use client";

import React, { useState } from "react";
import { IngredientFinding } from "@/lib/schemas";
import { BookOpen, ShieldCheck, AlertCircle, FileText, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

interface IngredientIntelligenceProps {
  findings: IngredientFinding[];
  originalText?: string | null;
}

export function IngredientIntelligence({ findings, originalText }: IngredientIntelligenceProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const severityBadge = (severity: IngredientFinding["severity"]) => {
    switch (severity) {
      case "favorable":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          label: "Favourable / Nutrient-Dense",
        };
      case "watch":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          label: "Nutritional Watch-Out",
        };
      case "caution":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-300",
          label: "Defined Health Concern",
        };
      default:
        return {
          bg: "bg-stone-100 text-stone-700 border-stone-200",
          label: "Standard Food Component",
        };
    }
  };

  const filteredFindings = findings.filter((item) => {
    if (filterSeverity === "all") return true;
    return item.severity === filterSeverity;
  });

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            Ingredient Intelligence &amp; Science Context
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            Evidence-aware breakdown of functional purposes and scientific consensus
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterSeverity("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterSeverity === "all"
                ? "bg-emerald-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All ({findings.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity("watch")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterSeverity === "watch"
                ? "bg-amber-700 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Watch-Outs ({findings.filter((f) => f.severity === "watch").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterSeverity("favorable")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              filterSeverity === "favorable"
                ? "bg-emerald-700 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Favourable ({findings.filter((f) => f.severity === "favorable").length})
          </button>
        </div>
      </div>

      {/* Philosophy note: Non-alarmist, scientifically grounded */}
      <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Evidence-Based Assessment Principle:</strong> Ingredients are evaluated using verified food science consensus (FSSAI, WHO/FAO JECFA, and ICMR). An ingredient is <strong>never</strong> labeled harmful solely because its name sounds unfamiliar or chemical. Context, dosage, and overall dietary frequency matter.
        </p>
      </div>

      {/* Ingredient findings list */}
      <div className="space-y-3">
        {filteredFindings.map((item, idx) => {
          const badge = severityBadge(item.severity);
          return (
            <div
              key={idx}
              className="rounded-2xl border border-stone-200 bg-white p-4 hover:border-emerald-700/60 transition-colors shadow-sm space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-stone-900 text-sm sm:text-base">
                    {item.cleanName}
                  </span>
                  {item.insNumber && (
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                      {item.insNumber}
                    </span>
                  )}
                  <span className="text-xs text-stone-500 font-medium italic">
                    • {item.purpose}
                  </span>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto ${badge.bg}`}>
                  {badge.label}
                </span>
              </div>

              {/* Scientific explanation */}
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {item.evidenceSummary}
              </p>

              {/* Dietary context & Source */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-500 gap-1 pt-1 border-t border-stone-100">
                <p>
                  <strong className="text-stone-700">Context:</strong> {item.context}
                </p>
                <span className="shrink-0 text-stone-400 font-mono">
                  Ref: {item.source}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Original Verbatim Label Text Accordion */}
      {originalText && (
        <div className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50/50">
          <button
            type="button"
            onClick={() => setShowOriginal(!showOriginal)}
            className="w-full p-4 flex items-center justify-between text-left text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-500" />
              View Original Packaging Ingredient Text (Verbatim Transcription)
            </span>
            {showOriginal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {showOriginal && (
            <div className="p-4 pt-1 border-t border-stone-200 text-xs font-mono text-stone-600 bg-white leading-relaxed whitespace-pre-wrap">
              {originalText}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
