import React from "react";
import Link from "next/link";
import { AnnaDrishtiLogo } from "./Logo";
import { Camera, Sparkles, BookOpen, ShieldCheck } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-ivory-50/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between">
        <AnnaDrishtiLogo size="md" showTagline={true} />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
          <Link
            href="/#features"
            className="hover:text-emerald-800 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-emerald-700" />
            Features
          </Link>
          <Link
            href="/scan"
            className="hover:text-emerald-800 transition-colors flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4 text-emerald-700" />
            Scan Label
          </Link>
          <Link
            href="/#methodology"
            className="hover:text-emerald-800 transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-emerald-700" />
            Rating Formula
          </Link>
          <Link
            href="/#disclaimer"
            className="hover:text-emerald-800 transition-colors flex items-center gap-1.5 text-stone-500 hover:text-stone-800"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Safety Disclaimer
          </Link>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <Link
            href="/scan"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-white bg-emerald-800 hover:bg-emerald-900 active:scale-[0.98] shadow-sm hover:shadow-md transition-all shadow-emerald-900/10"
          >
            <Camera className="w-4 h-4 text-emerald-200" />
            <span>Scan a Label</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
