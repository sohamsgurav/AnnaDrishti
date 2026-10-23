"use client";

import React, { useState } from "react";
import { Search, Sparkles, AlertCircle, ArrowRight, CheckCircle2, Camera, Upload, Layers } from "lucide-react";
import { ProductMatchCandidate, ProductSearchResult } from "@/lib/product-search";

interface DescribeFoodInputProps {
  onProductSelected: (candidate: ProductMatchCandidate) => void;
  onSwitchToUpload?: () => void;
  disabled?: boolean;
}

export function DescribeFoodInput({
  onProductSelected,
  onSwitchToUpload,
  disabled = false,
}: DescribeFoodInputProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<ProductSearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const QUICK_EXAMPLES = [
    "₹10 Balaji wafers packet",
    "Parle-G biscuits, ₹10 pack",
    "Maggi 2-Minute Noodles",
    "Kurkure Masala Munch ₹10",
    "Haldiram's Classic Bhujia",
  ];

  const handleSearch = async (textToSearch?: string) => {
    const searchText = (textToSearch !== undefined ? textToSearch : query).trim();
    if (!searchText) {
      setErrorMsg("Please type a product description, e.g. ₹10 Balaji wafers packet.");
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setSearchResult(null);

    try {
      const res = await fetch("/api/search-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchText }),
      });

      if (!res.ok) {
        throw new Error("Failed to search product database.");
      }

      const data: ProductSearchResult = await res.json();
      setSearchResult(data);

      // If exact match found directly, auto-select
      if (data.status === "exact_match" && data.candidate) {
        onProductSelected(data.candidate);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Network error. Please try again or upload a photo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Search Input Box */}
      <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-7 shadow-sm space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="food-description-input"
            className="block text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2"
          >
            <Search className="w-4 h-4 text-emerald-700" />
            Describe Your Food (Laptop &amp; Text Mode)
          </label>
          <p className="text-xs text-stone-500">
            Type the brand, product name, and optional price or pack size without needing a camera
          </p>
        </div>

        {/* Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <input
              id="food-description-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={disabled || isLoading}
              placeholder="Describe your food, e.g. ₹10 Balaji wafers packet..."
              className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-stone-300 bg-stone-50/50 hover:bg-white focus:bg-white focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/20 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="button"
            onClick={() => handleSearch()}
            disabled={disabled || isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] shadow-sm hover:shadow-md transition-all disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching DB...</span>
              </>
            ) : (
              <>
                <span>Analyse Product</span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </>
            )}
          </button>
        </div>

        {/* Quick Example Chips */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
            Popular Indian Packaged Foods:
          </span>
          <div className="flex flex-wrap gap-2">
            {QUICK_EXAMPLES.map((example, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(example);
                  handleSearch(example);
                }}
                disabled={disabled || isLoading}
                className="text-xs px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-700 border border-stone-200 hover:border-emerald-300 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}
      </div>

      {/* Disambiguation: Multiple matches found */}
      {searchResult && searchResult.status === "multiple_matches" && (
        <div className="rounded-3xl border border-amber-300 bg-amber-50/50 p-6 space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-2.5">
            <Layers className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                Multiple Product Variants Found
              </h4>
              <p className="text-xs text-stone-600">
                Packaging formulas vary by flavor and variant. Please choose your exact packet:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchResult.candidates.map((cand) => (
              <div
                key={cand.id}
                className="rounded-2xl border border-stone-200 hover:border-emerald-700 bg-white p-4 flex flex-col justify-between gap-3 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-500 uppercase tracking-wide">
                      {cand.brand}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {cand.source}
                    </span>
                  </div>
                  <h5 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800 transition-colors">
                    {cand.productName}
                  </h5>
                  <p className="text-xs text-stone-500">{cand.variant}</p>
                  {cand.packSize && (
                    <span className="inline-block text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-1">
                      {cand.packSize} {cand.priceEstimate ? `• ${cand.priceEstimate}` : ""}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onProductSelected(cand)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-800 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Select &amp; Analyse This Variant
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No match found: Offer upload / camera option */}
      {searchResult && searchResult.status === "no_match_found" && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-500 mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="font-bold text-stone-900 text-base">No Verified Product Found</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              {searchResult.message}
            </p>
          </div>

          {onSwitchToUpload && (
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={onSwitchToUpload}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm"
              >
                <Camera className="w-4 h-4 text-emerald-200" />
                Upload or Snap Label Instead
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
