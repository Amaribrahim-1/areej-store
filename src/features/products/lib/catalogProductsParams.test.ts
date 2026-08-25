import { describe, expect, it } from "vitest";

import { PRODUCTS_PAGE_SIZE } from "../constants";
import { toCatalogProductsQueryParams } from "./catalogProductsParams";

const baseInput = {
  page: 1,
  category: "",
  minRating: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
  search: "",
};

describe("toCatalogProductsQueryParams", () => {
  it("applies minPrice without requiring maxPrice", () => {
    expect(
      toCatalogProductsQueryParams({ ...baseInput, minPrice: "150" }),
    ).toEqual({
      page: 1,
      pageSize: PRODUCTS_PAGE_SIZE,
      sort: "newest",
      search: "",
      minPrice: 150,
    });
  });

  it("applies maxPrice without requiring minPrice", () => {
    expect(
      toCatalogProductsQueryParams({ ...baseInput, maxPrice: "400" }),
    ).toEqual({
      page: 1,
      pageSize: PRODUCTS_PAGE_SIZE,
      sort: "newest",
      search: "",
      maxPrice: 400,
    });
  });

  it("applies both bounds when they are set", () => {
    expect(
      toCatalogProductsQueryParams({
        ...baseInput,
        minPrice: "150",
        maxPrice: "400",
      }),
    ).toMatchObject({ minPrice: 150, maxPrice: 400 });
  });
});
