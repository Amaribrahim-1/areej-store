import {
  isProductImageMimeType,
  PRODUCT_IMAGE_MAX_DIMENSION,
  PRODUCT_IMAGE_MAX_INPUT_BYTES,
  PRODUCT_IMAGE_MAX_OUTPUT_BYTES,
  PRODUCT_IMAGE_WEBP_QUALITY,
} from "../constants";

const WEBP_QUALITY_STEPS = [
  PRODUCT_IMAGE_WEBP_QUALITY,
  0.7,
  0.58,
  0.45,
] as const;

export function assertProductImageFile(file: File): void {
  if (file.size <= 0) {
    throw new Error("IMAGE_EMPTY");
  }
  if (!isProductImageMimeType(file.type)) {
    throw new Error("IMAGE_INVALID_TYPE");
  }
  if (file.size > PRODUCT_IMAGE_MAX_INPUT_BYTES) {
    throw new Error("IMAGE_TOO_LARGE");
  }
}

export function fitImageWithinMaxDimension(
  width: number,
  height: number,
  maxDimension: number = PRODUCT_IMAGE_MAX_DIMENSION,
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function toWebpFileName(name: string): string {
  const trimmed = name.trim() || "product";
  const base = trimmed.replace(/\.[^.]+$/, "");
  return `${base || "product"}.webp`;
}

export function isPreparedProductImage(file: File): boolean {
  return file.type === "image/webp" && file.size > 0 && file.size <= PRODUCT_IMAGE_MAX_OUTPUT_BYTES;
}

/**
 * Validates MIME/size, then resizes and encodes to WebP under the bucket cap.
 * Already-prepared WebP files (from a previous call) are returned as-is.
 */
export async function prepareProductImage(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<File> {
  assertProductImageFile(file);
  if (isPreparedProductImage(file)) {
    onProgress?.(100);
    return file;
  }
  return compressProductImage(file, onProgress);
}

export async function compressProductImage(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<File> {
  onProgress?.(15);
  const bitmap = await decodeImageBitmap(file);
  onProgress?.(40);

  try {
    const { width, height } = fitImageWithinMaxDimension(
      bitmap.width,
      bitmap.height,
    );
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("IMAGE_COMPRESS_FAILED");
    }
    context.drawImage(bitmap, 0, 0, width, height);
    onProgress?.(65);

    const blob = await encodeWebpUnderBudget(canvas);
    onProgress?.(100);
    return new File([blob], toWebpFileName(file.name), { type: "image/webp" });
  } finally {
    bitmap.close();
  }
}

async function decodeImageBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    try {
      return await createImageBitmap(file);
    } catch {
      throw new Error("IMAGE_COMPRESS_FAILED");
    }
  }
}

async function encodeWebpUnderBudget(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  for (const quality of WEBP_QUALITY_STEPS) {
    const blob = await canvasToWebpBlob(canvas, quality);
    if (blob.size <= PRODUCT_IMAGE_MAX_OUTPUT_BYTES) {
      return blob;
    }
  }
  throw new Error("IMAGE_OUTPUT_TOO_LARGE");
}

function canvasToWebpBlob(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob || blob.size === 0) {
          reject(new Error("IMAGE_COMPRESS_FAILED"));
          return;
        }
        resolve(blob);
      },
      "image/webp",
      quality,
    );
  });
}
