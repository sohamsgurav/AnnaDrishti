import React from "react";
import { AnnaDrishtiLogo } from "./Logo";
import { ShieldAlert, ExternalLink, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer id="disclaimer" className="w-full bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <AnnaDrishtiLogo size="md" showTagline={true} />
            <p className="text-sm text-stone-400 max-w-md leading-relaxed">
              Empowering consumers to decode packaged food labels with AI-driven OCR extraction,
              deterministic nutritional analysis, and verified ingredient intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <span>Backed by open scientific standards:</span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">ICMR-NIN 2020</span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">WHO Diet Guide</span>
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">Open Food Facts</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Platform</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <a href="/scan" className="hover:text-emerald-400 transition-colors">
                  Label Scanner
                </a>
              </li>
              <li>
                <a href="/#features" className="hover:text-emerald-400 transition-colors">
                  Core Architecture
                </a>
              </li>
              <li>
                <a href="/#methodology" className="hover:text-emerald-400 transition-colors">
                  AnnaDrishti Index v1.0
                </a>
              </li>
              <li>
                <a
                  href="https://world.openfoodfacts.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                >
                  Open Food Facts Database <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Transparency</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>Deterministic TypeScript Logic</li>
              <li>Visible Scoring Penalties & Bonuses</li>
              <li>Zero Guessed Numbers Policy</li>
              <li>Independent Allergen Match Alert</li>
              <li>Strict Evidence Citation Model</li>
            </ul>
          </div>
        </div>

        {/* Prominent Legal & Medical Disclaimer Box */}
        <div className="rounded-2xl bg-stone-800/80 border border-stone-700/80 p-5 mb-8 text-stone-300">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm space-y-1.5 leading-relaxed">
              <p className="font-semibold text-stone-100">
                Informational and Educational Purpose Only (Medical & Allergen Notice)
              </p>
              <p className="text-stone-300">
                AnnaDrishti is an algorithmic educational tool designed for food literacy. It does <strong>NOT</strong> provide medical advice, clinical diagnosis, or predict personal health reactions. A &quot;No Match Detected&quot; allergen status does not guarantee 100% absence; cross-contamination in factories is always possible. Users with severe allergies must verify the physical packaging and consult medical professionals.
              </p>
              <p className="text-stone-400">
                The AnnaDrishti Index is an independent, reproducible scoring algorithm based on public WHO and ICMR-NIN nutritional thresholds. It is <strong>NOT</strong> an official rating or certification by the Food Safety and Standards Authority of India (FSSAI).
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} AnnaDrishti. See Beyond the Label. Open-source hackathon prototype.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for healthy and transparent consumer choices.
          </p>
        </div>
      </div>
    </footer>
  );
}
