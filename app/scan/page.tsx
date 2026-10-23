"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Upload,
  Search,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Layers,
  Download,
  Copy,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { DescribeFoodInput } from "@/components/DescribeFoodInput";
import { RestrictionsSelector } from "@/components/RestrictionsSelector";
import { NutritionDashboard } from "@/components/NutritionDashboard";
import { IngredientIntelligence } from "@/components/IngredientIntelligence";
import { PersonalRestrictionAlerts } from "@/components/PersonalRestrictionAlerts";
import { ProductRatingCard } from "@/components/ProductRatingCard";
import { AlternativesSection } from "@/components/AlternativesSection";
import { ConfidenceNotice } from "@/components/ConfidenceNotice";
import { AnalysisResult, UserPreferences, NormalizedNutritionValues } from "@/lib/schemas";
import { DEMO_PRESETS, DemoPreset } from "@/lib/sample-data";
import { ProductMatchCandidate } from "@/lib/product-search";
import { assembleAnalysisResult } from "@/lib/result";
import { saveScanRecord, getRecentLocalScans } from "@/lib/firebase";

type InputMode = "describe" | "upload" | "camera" | "presets";

function ScanPageContent() {
  const searchParams = useSearchParams();

  const [inputMode, setInputMode] = useState<InputMode>("describe");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<ProductMatchCandidate | null>(null);

  const [preferences, setPreferences] = useState<UserPreferences>({
    allergens: [],
    dietaryPreferences: [],
    goals: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [recentScans, setRecentScans] = useState<AnalysisResult[]>([]);

  // Check URL params or session storage on load
  useEffect(() => {
    setRecentScans(getRecentLocalScans());

    const presetParam = searchParams.get("preset");
    if (presetParam) {
      const found = DEMO_PRESETS.find((p) => p.id === presetParam);
      if (found) {
        setSelectedPresetId(found.id);
        setInputMode("presets");
      }
    }

    const storedCandidate = sessionStorage.getItem("annadrishti_selected_candidate");
    if (storedCandidate) {
      try {
        const candidate: ProductMatchCandidate = JSON.parse(storedCandidate);
        setSelectedCandidate(candidate);
        setInputMode("describe");
        sessionStorage.removeItem("annadrishti_selected_candidate");
        // Automatically analyze candidate
        handleAnalyzeCandidate(candidate);
      } catch (e) {
        console.error(e);
      }
    }
  }, [searchParams]);

  const handleImageSelected = (file: File | null, base64: string | null) => {
    setSelectedFile(file);
    setImageBase64(base64);
    setSelectedPresetId(null);
    setSelectedCandidate(null);
    setErrorMsg(null);
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    setSelectedPresetId(preset.id);
    setSelectedFile(null);
    setImageBase64(null);
    setSelectedCandidate(null);
    setErrorMsg(null);
  };

  const handleProductCandidateSelected = (candidate: ProductMatchCandidate) => {
    setSelectedCandidate(candidate);
    setSelectedPresetId(null);
    setSelectedFile(null);
    setImageBase64(null);
    setErrorMsg(null);
    handleAnalyzeCandidate(candidate);
  };

  const handleAnalyzeCandidate = async (candidate: ProductMatchCandidate) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep("Matching verified packaging data...");

    try {
      setLoadingStep("Computing AnnaDrishti Index & ingredient rules...");
      const assembled = await assembleAnalysisResult({
        raw: candidate.rawExtraction,
        preferences,
        isDemo: candidate.source === "Verified Packaging Database",
        demoMessage: `Sourced from ${candidate.source} (${candidate.barcode ? `Barcode: ${candidate.barcode}` : candidate.brand}).`,
      });

      setResult(assembled);
      saveScanRecord(assembled);
      setRecentScans(getRecentLocalScans());
      window.scrollTo({ top: 400, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to analyze product candidate. Please retry.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile && !imageBase64 && !selectedPresetId && !selectedCandidate) {
      setErrorMsg("Please upload a label image, describe your food, or choose a sample preset.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      setLoadingStep("Validating label input & parameters...");
      await new Promise((r) => setTimeout(r, 300));

      setLoadingStep("Reading label with Gemini Vision OCR...");

      const formData = new FormData();
      if (selectedPresetId) {
        formData.append("presetId", selectedPresetId);
      } else if (selectedFile) {
        formData.append("image", selectedFile);
      } else if (imageBase64) {
        // Base64 upload
      }

      formData.append("preferences", JSON.stringify(preferences));

      setLoadingStep("Normalizing nutrients & evaluating health criteria...");

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed. Please check image legibility.");
      }

      setLoadingStep("Checking Open Food Facts for verified alternatives...");
      const data: AnalysisResult = await response.json();

      setResult(data);
      saveScanRecord(data);
      setRecentScans(getRecentLocalScans());
      window.scrollTo({ top: 500, behavior: "smooth" });
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setErrorMsg(err.message || "An unexpected error occurred during label analysis.");
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleUpdateNutrition = async (updatedValues: NormalizedNutritionValues) => {
    if (!result) return;

    const updatedRaw = {
      productName: result.product.name,
      brand: result.product.brand,
      category: result.product.category,
      ingredientsText: result.ingredientsOriginalText,
      ingredients: result.ingredientFindings.map((f) => f.ingredient),
      nutrition: {
        basis: result.nutrition.basis,
        servingSize: null,
        servingUnit: "g",
        caloriesKcal: updatedValues.caloriesKcal,
        proteinG: updatedValues.proteinG,
        carbohydratesG: updatedValues.carbohydratesG,
        totalSugarsG: updatedValues.totalSugarsG,
        addedSugarsG: updatedValues.addedSugarsG,
        totalFatG: updatedValues.totalFatG,
        saturatedFatG: updatedValues.saturatedFatG,
        transFatG: updatedValues.transFatG,
        sodiumMg: updatedValues.sodiumMg,
        saltG: updatedValues.saltG,
        fibreG: updatedValues.fibreG,
        micronutrients: updatedValues.micronutrients,
        allergenStatements: [],
        mayContainStatements: [],
      },
      missingFields: [],
      uncertainFields: [],
      extractionNotes: [...result.dataQuality.notes, "Nutritional values manually reviewed and updated by user."],
    };

    const reAssembled = await assembleAnalysisResult({
      raw: updatedRaw,
      preferences,
      isDemo: result.isDemo,
      demoMessage: "Updated with user-corrected values.",
    });

    setResult(reAssembled);
    saveScanRecord(reAssembled);
    setRecentScans(getRecentLocalScans());
  };

  const handleExportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `annadrishti-${result.product.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `AnnaDrishti Food Label Report:
Product: ${result.product.name} (${result.product.brand || "N/A"})
Score: ${result.rating.score}/100 [Band: ${result.rating.band.toUpperCase()}]
Energy: ${result.nutrition.per100g.caloriesKcal ?? "N/A"} kcal | Protein: ${result.nutrition.per100g.proteinG ?? "N/A"}g
Sugars: ${result.nutrition.per100g.totalSugarsG ?? "N/A"}g | Sodium: ${result.nutrition.per100g.sodiumMg ?? "N/A"}mg
Allergen Match Detected: ${result.restrictionChecks.some(c => c.status === "match") ? "YES - AVOID" : "NO"}
Learn more at: https://annadrishti.org`;

    navigator.clipboard.writeText(text);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedFile(null);
    setImageBase64(null);
    setSelectedPresetId(null);
    setSelectedCandidate(null);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Label Intelligence Studio
            </span>
            <span className="text-xs text-stone-400">• Multi-input Analysis</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-stone-900">
            Scan &amp; Decode Food Labels
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            Type your product description, snap a photo with your mobile camera, or upload a packaging label to reveal ingredients, transparent ratings, and verified alternatives.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition-colors shadow-sm"
            >
              <Copy className="w-3.5 h-3.5 text-stone-500" />
              <span>{copiedNotification ? "Copied!" : "Copy Summary"}</span>
            </button>

            <button
              type="button"
              onClick={handleExportJson}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Export JSON</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Scan</span>
            </button>
          </div>
        )}
      </div>

      {/* INPUT CONTROLS SECTION */}
      {!result ? (
        <div className="space-y-8">
          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-stone-200/80 border border-stone-300/80">
            <button
              type="button"
              onClick={() => setInputMode("describe")}
              className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                inputMode === "describe"
                  ? "bg-white text-emerald-950 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Search className="w-4 h-4 text-emerald-700" />
              <span>Describe Product (Laptop)</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                inputMode === "upload"
                  ? "bg-white text-emerald-950 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Upload className="w-4 h-4 text-emerald-700" />
              <span>Upload Label Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode("presets")}
              className={`flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                inputMode === "presets"
                  ? "bg-white text-emerald-950 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>1-Click Sample Presets</span>
            </button>
          </div>

          {/* Active Mode Panel */}
          {inputMode === "describe" && (
            <DescribeFoodInput
              onProductSelected={handleProductCandidateSelected}
              onSwitchToUpload={() => setInputMode("upload")}
              disabled={isLoading}
            />
          )}

          {(inputMode === "upload" || inputMode === "presets") && (
            <ImageUploader
              onImageSelected={handleImageSelected}
              selectedPresetId={selectedPresetId}
              onSelectPreset={handleSelectPreset}
              disabled={isLoading}
            />
          )}

          {/* Dietary Restrictions and Health Goals Selector */}
          <RestrictionsSelector
            preferences={preferences}
            onChange={setPreferences}
            disabled={isLoading}
          />

          {/* Action Trigger Button */}
          {inputMode !== "describe" && (
            <div className="flex flex-col items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleRunAnalysis}
                disabled={isLoading || (!selectedFile && !imageBase64 && !selectedPresetId)}
                className="w-full sm:w-auto min-w-[260px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-base text-white bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] shadow-md hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-emerald-950/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing Packaging...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-emerald-200" />
                    <span>Analyze Label Now</span>
                  </>
                )}
              </button>

              {/* Live Loading Progress Bar */}
              {isLoading && (
                <div className="w-full max-w-md space-y-2 text-center animate-pulse">
                  <p className="text-xs font-semibold text-emerald-900">{loadingStep}</p>
                  <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
                    <div className="h-full bg-emerald-700 rounded-full animate-progress" />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Analysis Could Not Complete</p>
                <p className="text-rose-700 mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Recent Scans Tray (if any) */}
          {recentScans.length > 0 && (
            <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 space-y-3 shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-stone-400" />
                Recent Scans (Saved locally / Cloud Firestore)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {recentScans.slice(0, 3).map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setResult(s);
                      window.scrollTo({ top: 300, behavior: "smooth" });
                    }}
                    className="text-left p-3 rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200 hover:border-emerald-300 transition-colors flex items-center justify-between"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold text-xs text-stone-900 truncate">{s.product.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{s.product.brand || "Packaged Food"}</p>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg shrink-0 ${
                        s.rating.band === "green"
                          ? "bg-emerald-100 text-emerald-800"
                          : s.rating.band === "amber"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {s.rating.score}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ---------------- RESULTS DASHBOARD ---------------- */
        <div className="space-y-8 animate-fadeIn">
          {/* Result Header Bar */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                  {result.product.brand || "Packaged Food Item"}
                </span>
                <span className="text-stone-300">•</span>
                <span className="text-xs text-stone-500 capitalize">{result.product.category}</span>
                {result.isDemo && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    Sample Packaging Data
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                {result.product.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-stone-500" />
                <span>{copiedNotification ? "Copied!" : "Copy"}</span>
              </button>

              <button
                type="button"
                onClick={handleExportJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>New Scan</span>
              </button>
            </div>
          </div>

          {/* 1. Transparent Product Rating Card (AnnaDrishti Index v1.0) */}
          <ProductRatingCard
            rating={result.rating}
            hasAllergenMatch={result.restrictionChecks.some(
              (c) => c.status === "match" && c.type === "allergen"
            )}
          />

          {/* 2. Personal Dietary & Allergen Safety Status (Strictly Independent from Score!) */}
          <PersonalRestrictionAlerts
            checks={result.restrictionChecks}
            allergenStatements={result.nutrition.per100g ? [] : []}
            mayContainStatements={[]}
          />

          {/* 3. Comprehensive Nutrition Dashboard */}
          <NutritionDashboard
            per100g={result.nutrition.per100g}
            perServing={result.nutrition.perServing}
            servingSizeDisplay={result.nutrition.servingSizeDisplay}
            basis={result.nutrition.basis}
            missingFields={result.nutrition.missingFields}
          />

          {/* 4. Ingredient Intelligence & Scientific Context */}
          <IngredientIntelligence
            findings={result.ingredientFindings}
            originalText={result.ingredientsOriginalText}
          />

          {/* 5. Verified Healthier Alternatives (Open Food Facts) */}
          <AlternativesSection
            alternatives={result.alternatives}
            category={result.product.category}
          />

          {/* 6. Label Data Integrity & Confidence Notice (With User Value Editor) */}
          <ConfidenceNotice
            confidence={result.dataQuality.confidence}
            completenessPercent={result.dataQuality.completenessPercent}
            notes={result.dataQuality.notes}
            warnings={result.dataQuality.warnings}
            per100g={result.nutrition.per100g}
            onUpdateNutrition={handleUpdateNutrition}
            onRetake={handleReset}
          />

          {/* 7. Mandatory Informational & Medical Disclaimer */}
          <div className="rounded-2xl bg-stone-100 p-5 text-xs text-stone-600 leading-relaxed border border-stone-200">
            <strong className="text-stone-800">AnnaDrishti Disclaimer: </strong>
            {result.disclaimer}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ScanPageContent />
    </Suspense>
  );
}
