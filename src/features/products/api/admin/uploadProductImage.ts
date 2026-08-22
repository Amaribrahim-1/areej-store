import { createClient } from "@/lib/supabase/client";

import { PRODUCT_IMAGE_BUCKET } from "../../constants";
import { prepareProductImage } from "../../lib/compressProductImage";
import { newProductImagePath } from "../../lib/productImagePath";
import type {
  ProductImageUploadProgress,
  UploadedProductImage,
} from "../../types";

export type UploadProductImageOptions = {
  onProgress?: (progress: ProductImageUploadProgress) => void;
};

/**
 * Compresses to WebP if needed, then uploads one object to `product-images`.
 * Path is a generated UUID — never the original filename.
 */
export async function uploadProductImage(
  file: File,
  options: UploadProductImageOptions = {},
): Promise<UploadedProductImage> {
  const { onProgress } = options;

  onProgress?.({ phase: "compressing", percent: 0 });
  const prepared = await prepareProductImage(file, (percent) => {
    onProgress?.({ phase: "compressing", percent });
  });

  onProgress?.({ phase: "uploading", percent: null });

  const path = newProductImagePath();
  const supabase = createClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .upload(path, prepared, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw new Error("IMAGE_UPLOAD_FAILED");
  }

  const { data } = supabase.storage
    .from(PRODUCT_IMAGE_BUCKET)
    .getPublicUrl(path);

  onProgress?.({ phase: "uploading", percent: 100 });

  return { path, publicUrl: data.publicUrl };
}
