"use client";

import React from "react";
import { RestrictionCheck } from "@/lib/schemas";
import { AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert, AlertOctagon } from "lucide-react";

interface PersonalRestrictionAlertsProps {
  checks: RestrictionCheck[];
  allergenStatements?: string[];
  mayContainStatements?: string[];
}

export function PersonalRestrictionAlerts({
  checks,
  allergenStatements = [],
  mayContainStatements = [],
}: PersonalRestrictionAlertsProps) {
  if (checks.length === 0) {
    return null;
  }

  const directMatches = checks.filter((c) => c.status === "match");
  const mayContainMatches = checks.filter((c) => c.status === "may_contain_match");
  const noMatches = checks.filter((c) => c.status === "no_match_detected");
  const uncertainChecks = checks.filter((c) => c.status === "uncertain");

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Personal Dietary & Allergen Safety Status
          </h3>
          <p className="text-xs sm:text-sm text-stone-500">
            Deterministic matching against visible ingredients and manufacturer declarations
          </p>
        </div>

        <div className="flex items-center gap-2">
          {directMatches.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
              <AlertOctagon className="w-4 h-4 text-rose-600" /> Match Detected
            </span>
          ) : mayContainMatches.length > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Precautionary Warning
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> No Declared Match
            </span>
          )}
        </div>
      </div>

      {/* Direct Matches (Red Alert) */}
      {directMatches.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            Direct Ingredient Matches ({directMatches.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {directMatches.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-rose-300 bg-rose-50/80 p-4 space-y-1 text-rose-900 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-rose-950">{item.label}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 border border-rose-300">
                    Direct Match
                  </span>
                </div>
                <p className="text-xs text-rose-800 leading-relaxed">{item.explanation}</p>
                {item.matchedText && (
                  <p className="text-[11px] text-rose-700 font-mono mt-1">
                    Matched text on label: &quot;{item.matchedText}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Advisory May-Contain Matches (Amber Alert) */}
      {mayContainMatches.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Advisory &quot;May Contain&quot; Warnings ({mayContainMatches.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mayContainMatches.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-amber-300 bg-amber-50/80 p-4 space-y-1 text-amber-900 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-amber-950">{item.label}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                    Shared Facility
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">{item.explanation}</p>
                {item.matchedText && (
                  <p className="text-[11px] text-amber-700 font-mono mt-1">
                    Cross-contact warning: &quot;May contain {item.matchedText}&quot;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uncertain Checks (Yellow Alert) */}
      {uncertainChecks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-stone-500" />
            Unable to Determine ({uncertainChecks.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {uncertainChecks.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-200 bg-stone-50 p-3.5 space-y-1 text-stone-700"
              >
                <span className="font-semibold text-xs text-stone-900">{item.label}</span>
                <p className="text-xs text-stone-600">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Match Detected (Green) */}
      {noMatches.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-stone-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            No Match Detected in Declared Ingredients ({noMatches.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {noMatches.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Manufacturer Statements verbatim if present */}
      {(allergenStatements.length > 0 || mayContainStatements.length > 0) && (
        <div className="rounded-2xl bg-stone-50 p-4 border border-stone-200/80 text-xs text-stone-600 space-y-1">
          <p className="font-semibold text-stone-800">Exact Packaging Allergen Statements:</p>
          {allergenStatements.length > 0 && (
            <p>
              <strong className="text-stone-700">Contains:</strong> {allergenStatements.join("; ")}
            </p>
          )}
          {mayContainStatements.length > 0 && (
            <p>
              <strong className="text-stone-700">May Contain:</strong> {mayContainStatements.join("; ")}
            </p>
          )}
        </div>
      )}

      {/* Strict Allergen Disclaimer */}
      <div className="rounded-2xl bg-stone-100/90 p-4 text-[11px] text-stone-600 leading-relaxed border border-stone-200">
        <strong className="text-stone-800">Critical Allergen Notice:</strong> &quot;No match detected&quot; means the keyword did not appear in the legible label text. It is <strong>never</strong> a guarantee that a food is completely allergen-free or safe for severe anaphylaxis. Formulations change and unlisted shared-line traces can occur. Always inspect the physical packaging before consumption.
      </div>
    </div>
  );
}
