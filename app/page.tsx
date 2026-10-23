"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  Search,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Eye,
  Wheat,
  Flame,
  Dumbbell,
  AlertTriangle,
  Scale,
  ExternalLink,
} from "lucide-react";
import { DescribeFoodInput } from "@/components/DescribeFoodInput";
import { ProductMatchCandidate } from "@/lib/product-search";
import { DEMO_PRESETS } from "@/lib/sample-data";

export default function LandingPage() {
  const router = useRouter();
  const samplePreset = DEMO_PRESETS[0]; // Classic Bhujia

  const handleProductSelected = (candidate: ProductMatchCandidate) => {
    // Navigate to /scan with the preselected candidate
    sessionStorage.setItem("annadrishti_selected_candidate", JSON.stringify(candidate));
    router.push("/scan?mode=candidate");
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="w-full relative overflow-hidden bg-gradient-to-b from-stone-100/60 via-ivory-50 to-ivory-50 pt-12 sm:pt-20 pb-16 sm:pb-24 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
          {/* Tag Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 border border-emerald-300 text-xs sm:text-sm font-semibold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>AI-Powered Food Label Intelligence</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="text-emerald-800 font-mono">See Beyond the Label</span>
          </div>

          {/* Headline & Subheading */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-stone-900 leading-[1.1]">
              Know What <span className="text-emerald-800 underline decoration-amber-500/80 decoration-wavy decoration-2">You Eat.</span>
            </h1>
            <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Don&apos;t get misled by front-of-pack claims. AnnaDrishti extracts packaged nutrition tables, explains complex ingredients scientifically, flags personal allergens, and verifies healthier alternatives.
            </p>
          </div>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/scan"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] shadow-md hover:shadow-lg transition-all shadow-emerald-950/15"
            >
              <Camera className="w-5 h-5 text-emerald-200" />
              <span>Scan a Food Label</span>
            </Link>

            <a
              href="#describe"
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-sm sm:text-base text-stone-800 bg-white hover:bg-stone-50 border border-stone-200 shadow-sm hover:shadow transition-all"
            >
              <Search className="w-5 h-5 text-emerald-800" />
              <span>Describe Your Food</span>
            </a>

            <a
              href="#features"
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-2xl font-semibold text-xs sm:text-sm text-stone-600 hover:text-stone-900 transition-colors"
            >
              <span>Explore Features</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Laptop & Mobile Friendly: "Describe Your Food" Quick Input Section */}
          <div id="describe" className="w-full max-w-3xl pt-8 sm:pt-12 text-left">
            <DescribeFoodInput
              onProductSelected={handleProductSelected}
              onSwitchToUpload={() => router.push("/scan")}
            />
          </div>
        </div>
      </section>

      {/* 2. CORE FEATURES SECTION */}
      <section id="features" className="w-full py-16 sm:py-24 bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200">
              Integrity &amp; Scientific Architecture
            </h2>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-stone-900">
              How AnnaDrishti Sees Beyond The Label
            </h3>
            <p className="text-sm sm:text-base text-stone-500">
              Designed according to strict food safety guidelines: AI transcribes, validated code calculates, and trusted public health data grounds recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-3xl border border-stone-200 p-6 sm:p-7 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg">Zero-Guessing Vision OCR</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Gemini Vision transcribes ONLY what is visible on physical packaging. Missing nutrients remain null rather than hallucinated or guessed.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-3xl border border-stone-200 p-6 sm:p-7 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 group-hover:scale-105 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg">Transparent AnnaDrishti Index</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Versioned 0–100 scoring based strictly on ICMR-NIN &amp; WHO nutritional thresholds. Every deduction and bonus is visible with exact numerical benchmarks.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-3xl border border-stone-200 p-6 sm:p-7 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg">Independent Allergen Guard</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                A good nutrition score never overrides an allergen match. Direct ingredients and precautionary &quot;may contain&quot; facility warnings are kept distinct.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-3xl border border-stone-200 p-6 sm:p-7 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-800 group-hover:scale-105 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg">Evidence-Aware Ingredient Intel</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Decodes INS codes, emulsifiers, preservatives, and sweeteners. Avoids chemophobia: explains safe technological purposes alongside genuine dietary context.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="rounded-3xl border border-stone-200 p-6 sm:p-7 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg">Real Open Food Facts Alternatives</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Recommends verifiable alternative products from the open database based on lower sugar, higher fibre, or lower sodium. Zero fabricated recommendations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="rounded-3xl border border-stone-200 p-6 sm:p-7 bg-stone-50/50 hover:bg-white hover:shadow-md transition-all space-y-3 group">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 flex items-center justify-center text-stone-800 group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-stone-900 text-lg">Describe Your Food (No Camera)</h4>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Analyze on laptops by typing product descriptions, prices, or variants (e.g. &quot;₹10 Balaji wafers&quot;) with intelligent variant disambiguation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE SAMPLE NUTRITION DASHBOARD PREVIEW */}
      <section className="w-full py-16 sm:py-24 bg-ivory-50 border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-300">
                Interactive Scan Dashboard
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-stone-900">
                See How AnnaDrishti Formats Packaged Labels
              </h3>
              <p className="text-xs sm:text-sm text-stone-500">
                Live preview of our analysis engine running on {samplePreset.brand} {samplePreset.name}:
              </p>
            </div>

            <Link
              href={`/scan?preset=${samplePreset.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-800 text-white hover:bg-emerald-900 shadow-sm transition-all shrink-0 self-start md:self-auto"
            >
              <span>Test This In Scanner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mock Interactive Result Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score Preview */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-stone-500">AnnaDrishti Index v1.0</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Moderate Watch
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-amber-500 bg-amber-50 flex flex-col items-center justify-center font-bold">
                  <span className="text-2xl text-amber-900">52</span>
                  <span className="text-[9px] text-stone-400 uppercase">/ 100</span>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-stone-900">{samplePreset.name}</p>
                  <p className="text-stone-500">High sodium (780mg) &amp; saturated fat, but contains 5.2g fibre.</p>
                </div>
              </div>
            </div>

            {/* Nutrition Snapshot */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Nutrition Highlights</span>
                <span className="text-stone-400 font-mono">per 100g</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block">Energy</span>
                  <span className="font-bold text-stone-800">588 kcal</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block">Protein</span>
                  <span className="font-bold text-emerald-800">13.8g</span>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[10px] text-stone-400 block">Fibre</span>
                  <span className="font-bold text-emerald-800">5.2g</span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 pt-1">
                Natural protein and fibre from Bengal gram and moth dal flour.
              </p>
            </div>

            {/* Allergen Match Preview */}
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900">Allergen Safety Status</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Vegetarian
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Facility Advisory Warning
                </p>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Manufacturer declares: &quot;May contain traces of Peanuts, Tree Nuts, Milk, and Soy.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY & SCORING BENCHMARKS TABLE */}
      <section id="methodology" className="w-full py-16 sm:py-20 bg-white border-b border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Open Science Standard
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              AnnaDrishti Index v1.0 Scoring Criteria
            </h3>
            <p className="text-xs sm:text-sm text-stone-500">
              Every score is reproducible and grounded in published ICMR-NIN &amp; WHO nutritional benchmarks:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-stone-200">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-bold">
                <tr>
                  <th className="p-4">Dimension</th>
                  <th className="p-4">Low / Favourable Benchmark</th>
                  <th className="p-4">High / Watch-Out Benchmark</th>
                  <th className="p-4">Score Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-600">
                <tr>
                  <td className="p-4 font-bold text-stone-900">Free / Total Sugars</td>
                  <td className="p-4 text-emerald-800">≤ 5.0 g / 100g</td>
                  <td className="p-4 text-rose-800">&gt; 22.5 g / 100g</td>
                  <td className="p-4">+8 bonus down to -20 penalty</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-stone-900">Saturated Fat</td>
                  <td className="p-4 text-emerald-800">≤ 1.5 g / 100g</td>
                  <td className="p-4 text-rose-800">&gt; 5.0 g / 100g</td>
                  <td className="p-4">+8 bonus down to -15 penalty</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-stone-900">Sodium / Salt</td>
                  <td className="p-4 text-emerald-800">≤ 120 mg (Salt ≤ 0.3g)</td>
                  <td className="p-4 text-rose-800">&gt; 600 mg (Salt &gt; 1.5g)</td>
                  <td className="p-4">+7 bonus down to -20 penalty</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-stone-900">Dietary Fibre</td>
                  <td className="p-4 text-emerald-800">≥ 6.0 g (Rich Source)</td>
                  <td className="p-4 text-stone-400">&lt; 3.0 g / 100g</td>
                  <td className="p-4">Up to +12 bonus for whole grains</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-stone-900">Protein</td>
                  <td className="p-4 text-emerald-800">≥ 10.0 g / 100g</td>
                  <td className="p-4 text-stone-400">&lt; 5.0 g / 100g</td>
                  <td className="p-4">Up to +10 bonus for legumes/dal</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-stone-900">Missing Mandatory Data</td>
                  <td className="p-4 text-stone-400">Complete Declaration</td>
                  <td className="p-4 text-amber-800">Omitted Critical Field</td>
                  <td className="p-4">-4 deduction per missing field</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="w-full py-16 sm:py-20 bg-emerald-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to See Beyond the Label?
          </h3>
          <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto">
            Scan your snack, beverage, or biscuit packet now, or describe your product to get scientific food transparency in seconds.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm sm:text-base bg-white text-emerald-950 hover:bg-stone-100 shadow-md transition-all active:scale-[0.98]"
            >
              <Camera className="w-5 h-5 text-emerald-800" />
              <span>Launch Label Scanner</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
