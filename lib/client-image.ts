/**
 * Client-Side Image Compression Utility
 *
 * Resizes oversized smartphone camera captures before upload.
 * Preserves crisp optical text legibility for Gemini OCR while reducing
 * payload size by up to 90% and speeding up upload times 5-10x.
 */

export interface CompressionResult {
  file: File;
  base64: string;
  originalSizeMb: number;
  compressedSizeMb: number;
  reductionPercent: number;
}

export async function compressImageForOcr(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<CompressionResult> {
  const originalSizeMb = Number((file.size / (1024 * 1024)).toFixed(2));

  // If already under 800KB, skip canvas resize to preserve original bytes
  if (file.size < 800 * 1024 && (file.type === "image/jpeg" || file.type === "image/webp")) {
    const base64 = await fileToBase64(file);
    return {
      file,
      base64,
      originalSizeMb,
      compressedSizeMb: originalSizeMb,
      reductionPercent: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to decode image."));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate proportional scale
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Canvas context unavailable."));
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return reject(new Error("Failed to compress image canvas."));
            }

            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            const compressedSizeMb = Number((compressedFile.size / (1024 * 1024)).toFixed(2));
            const reductionPercent = Math.max(
              0,
              Math.round(((file.size - compressedFile.size) / file.size) * 100)
            );

            const base64 = canvas.toDataURL("image/jpeg", quality);

            resolve({
              file: compressedFile,
              base64,
              originalSizeMb,
              compressedSizeMb,
              reductionPercent,
            });
          },
          "image/jpeg",
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
