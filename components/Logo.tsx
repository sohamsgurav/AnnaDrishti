import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  clickable?: boolean;
}

export function AnnaDrishtiLogo({ size = "md", showTagline = true, clickable = true }: LogoProps) {
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  }[size];

  const titleSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-3xl sm:text-4xl",
  }[size];

  const taglineSizes = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  }[size];

  const Content = (
    <div className="flex items-center gap-3 group select-none">
      {/* Icon: Eye + Leaf + Grain Motif */}
      <div
        className={`${iconDimensions} relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-950 p-2 shadow-md shadow-emerald-950/20 group-hover:shadow-emerald-700/30 transition-all duration-300 ring-1 ring-emerald-600/30 group-hover:scale-105`}
      >
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Eye Outline (Drishti) */}
          <path
            d="M8 50C18 32 32 20 50 20C68 20 82 32 92 50C82 68 68 80 50 80C32 80 18 68 8 50Z"
            stroke="#bbf7d0"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-90"
          />
          {/* Natural Leaf Motif (Health & Purity) */}
          <path
            d="M50 24C50 24 64 36 64 50C64 62 56 70 50 76C44 70 36 62 36 50C36 36 50 24 50 24Z"
            fill="url(#leafGradient)"
            className="opacity-95"
          />
          {/* Golden Anna Grain Stalk (Nutrition & Food) */}
          <path
            d="M50 34V66M46 42C44 40 43 43 45 45M54 42C56 40 57 43 55 45M45 52C43 50 42 53 44 55M55 52C57 50 58 53 56 55"
            stroke="#f59e0b"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Drishti Pupil Center Light */}
          <circle cx="50" cy="50" r="4.5" fill="#fef3c7" />
          <defs>
            <linearGradient id="leafGradient" x1="50" y1="24" x2="50" y2="76" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34d399" />
              <stop offset="1" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-emerald-950 dark:text-ivory-50 ${titleSizes}`}>
            Anna<span className="text-emerald-700">Drishti</span>
          </span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            AI
          </span>
        </div>
        {showTagline && (
          <span className={`font-medium tracking-wide text-stone-500 uppercase ${taglineSizes}`}>
            See Beyond the Label
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link href="/" aria-label="AnnaDrishti Home">
        {Content}
      </Link>
    );
  }

  return Content;
}
