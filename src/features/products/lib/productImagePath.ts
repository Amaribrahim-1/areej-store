import { PRODUCT_IMAGE_BUCKET } from "../constants";

const PUBLIC_OBJECT_MARKER = `/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/`;

export function newProductImagePath(): string {
  return `products/${crypto.randomUUID()}.webp`;
}

export function productImagePathFromPublicUrl(url: string): string | null {
  const markerIndex = url.indexOf(PUBLIC_OBJECT_MARKER);
  if (markerIndex === -1) {
    return null;
  }

  const path = decodeURIComponent(
    url.slice(markerIndex + PUBLIC_OBJECT_MARKER.length),
  );
  if (path.length === 0 || path.includes("..") || path.startsWith("/")) {
    return null;
  }
  return path;
}
