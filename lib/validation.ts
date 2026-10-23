export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File | { type: string; size: number; name?: string }): FileValidationResult {
  if (!file) {
    return { valid: false, error: "No image file provided." };
  }

  if (file.size <= 0) {
    return { valid: false, error: "The uploaded file is empty." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Image file is too large (${sizeMb} MB). Maximum allowed size is 8 MB.`,
    };
  }

  const mimeType = file.type.toLowerCase();
  const isAllowedType = ALLOWED_IMAGE_TYPES.some((allowed) =>
    mimeType.includes(allowed.replace("image/", ""))
  );

  // Fallback check extension if file.name exists
  if (!isAllowedType && "name" in file && file.name) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts = ["jpg", "jpeg", "png", "webp", "heic", "heif"];
    if (ext && validExts.includes(ext)) {
      return { valid: true };
    }
  }

  if (!isAllowedType) {
    return {
      valid: false,
      error: `Unsupported image format: ${file.type || "unknown"}. Please upload a JPG, PNG, or WEBP label photo.`,
    };
  }

  return { valid: true };
}

export function sanitizeText(text: string | null | undefined): string {
  if (!text) return "";
  return text.trim().replace(/[<>]/g, "");
}
