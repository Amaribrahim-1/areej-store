export type ProductReviewsQueryParams = {
  /** Same slug as the details URL — enables parallel fetch with getProduct. */
  slug: string;
  /** Cap on rows; server clamps to 1..50. Default 20. */
  limit?: number;
};

export type ProductReview = {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  authorName: string;
};
