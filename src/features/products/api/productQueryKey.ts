import type { ProductQueryParams } from "../types";

export const productQueryKey = (params: ProductQueryParams) => [
  "product",
  params,
];
