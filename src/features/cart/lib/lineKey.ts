export function lineKey(productId: string, variantId: string): string {
  return `${productId}:${variantId}`;
}
