"use client";

import React, { useState, useRef, useCallback } from "react";
import { UploadCloud, Camera, X, Image as ImageIcon, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { validateImageFile } from "@/lib/validation";
import { compressImageForOcr, CompressionResult } from "@/lib/client-image";
import { DEMO_PRESETS, DemoPreset } from "@/lib/sample-data";

interface ImageUploaderProps {
  onImageSelected: (file: File | null, base64: string | null, presetId?: string) => void;
  selectedPresetId?: string | null;
  onSelectPreset: (preset: DemoPreset) => void;
  disabled?: boolean;
}

export function ImageUploader({
  onImageSelected,
  selectedPresetId,
  onSelectPreset,
  disabled = false,
}: ImageUploaderProps) {
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setValidationError(null);
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setValidationError(validation.error || "Invalid file.");
        return;
      }

      setFileName(file.name);
      setIsCompressing(true);

      try {
        // Automatically optimize & compress image for fast upload and OCR clarity
        const result: CompressionResult = await compressImageForOcr(file, 1600, 0.85);

        if (result.reductionPercent > 10) {
          setCompressionInfo(
            `Optimized: ${result.originalSizeMb} MB → ${result.compressedSizeMb} MB (-${result.reductionPercent}%) for faster OCR`
          );
        } else {
          setCompressionInfo(`File size: ${result.compressedSizeMb} MB (Ready)`);
        }

        setPreviewUrl(result.base64);
        onImageSelected(result.file, result.base64);
      } catch (err) {
        console.warn("Client compression fallback to raw file:", err);
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          setPreviewUrl(base64);
          onImageSelected(file, base64);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsCompressing(false);
      }
    },
    [onImageSelected]
  );

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled || isCompressing) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isCompressing) setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setFileName(null);
    setCompressionInfo(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
    onImageSelected(null, null);
  };

  const triggerUpload = () => {
    if (!disabled && !isCompressing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const triggerCamera = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && !isCompressing && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        className="hidden"
        disabled={disabled || isCompressing}
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/*"
        capture="environment"
        className="hidden"
        disabled={disabled || isCompressing}
      />

      {/* Upload Zone / Preview */}
      {!previewUrl && !selectedPresetId ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={triggerUpload}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
            dragOver
              ? "border-emerald-600 bg-emerald-50/70 scale-[1.01]"
              : "border-stone-300 hover:border-emerald-700 bg-white hover:bg-stone-50/80 shadow-sm hover:shadow-md"
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-stone-900">
                Upload or Capture Food Label
              </h3>
              <p className="text-sm text-stone-500">
                Drag and drop your label photo here, or browse files from your device
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={triggerUpload}
                disabled={disabled || isCompressing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-emerald-800 text-white hover:bg-emerald-900 transition-colors shadow-sm"
              >
                <ImageIcon className="w-4 h-4 text-emerald-200" />
                Choose Image
              </button>

              <button
                type="button"
                onClick={triggerCamera}
                disabled={disabled || isCompressing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-colors"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                Camera Snap
              </button>
            </div>

            <p className="text-xs text-stone-400 pt-2">
              Supports JPG, PNG, WEBP, HEIC up to 8 MB. Automatically resized on-device for speed &amp; data efficiency.
            </p>
          </div>
        </div>
      ) : (
        /* Image Preview Box or Selected Preset */
        <div className="rounded-3xl border border-stone-200 bg-white p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {previewUrl ? (
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Food Label Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shrink-0">
                  {DEMO_PRESETS.find((p) => p.id === selectedPresetId)?.imageThumbnail || "🏷️"}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Analyze
                  </span>
                  {selectedPresetId && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                      Sample Label Preset
                    </span>
                  )}
                  {compressionInfo && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Zap className="w-3 h-3 text-emerald-600" /> Optimized
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-stone-900 text-base">
                  {selectedPresetId
                    ? DEMO_PRESETS.find((p) => p.id === selectedPresetId)?.name
                    : fileName || "Custom Label Photo"}
                </h4>
                <p className="text-xs text-stone-500">
                  {selectedPresetId
                    ? "Verified real packaged label data loaded for instant demo"
                    : compressionInfo || "Ready to analyze"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleClear}
                disabled={disabled || isCompressing}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Change / Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-800 text-sm flex items-start gap-3">
          <span className="font-bold">⚠️</span>
          <div>
            <p className="font-semibold">Upload Error</p>
            <p className="text-xs text-rose-700">{validationError}</p>
          </div>
        </div>
      )}

      {/* Instant Demo Presets Selector */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-semibold text-stone-800">
              No label photo handy? Test with 1-Click Sample Presets:
            </h4>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">Real Indian packaged items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {DEMO_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setFileName(null);
                  setCompressionInfo(null);
                  setValidationError(null);
                  onSelectPreset(preset);
                }}
                disabled={disabled || isCompressing}
                className={`text-left p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? "border-emerald-700 bg-emerald-50/80 shadow-sm ring-2 ring-emerald-600/30"
                    : "border-stone-200 bg-white hover:border-emerald-600 hover:bg-stone-50/70"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-2xl">{preset.imageThumbnail}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-stone-900 truncate">
                        {preset.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">{preset.brand}</p>
                    <span className="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">
                      {preset.badge}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
