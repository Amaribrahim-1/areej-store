import { deleteProductImage } from "./deleteProductImage";
import type { UploadProductImageOptions } from "./uploadProductImage";
import { withUploadedProductImage } from "./withUploadedProductImage";
import { productImagePathFromPublicUrl } from "../../lib/productImagePath";
import type { UploadedProductImage } from "../../types";

/**
 * Uploads a replacement image, runs `run`, then deletes the previous
 * storage object. If `run` throws, the new object is deleted and the
 * previous file is left in place.
 */
export async function withReplacedProductImage<T>(
  file: File,
  previousPublicUrl: string,
  run: (uploaded: UploadedProductImage) => Promise<T>,
  options?: UploadProductImageOptions,
): Promise<T> {
  return withUploadedProductImage(
    file,
    async (uploaded) => {
      const result = await run(uploaded);
      const previousPath = productImagePathFromPublicUrl(previousPublicUrl);
      if (previousPath && previousPath !== uploaded.path) {
        await deleteProductImage(previousPath).catch(() => undefined);
      }
      return result;
    },
    options,
  );
}
