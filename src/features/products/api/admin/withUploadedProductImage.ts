import { deleteProductImage } from "./deleteProductImage";
import {
  uploadProductImage,
  type UploadProductImageOptions,
} from "./uploadProductImage";
import type { UploadedProductImage } from "../../types";

/**
 * Uploads first, then runs `run`. If `run` throws, the storage object
 * is deleted so a failed product create does not leave an orphan file.
 */
export async function withUploadedProductImage<T>(
  file: File,
  run: (uploaded: UploadedProductImage) => Promise<T>,
  options?: UploadProductImageOptions,
): Promise<T> {
  const uploaded = await uploadProductImage(file, options);
  try {
    return await run(uploaded);
  } catch (cause) {
    await deleteProductImage(uploaded.path).catch(() => undefined);
    throw cause;
  }
}
