export type ProductReviewsQueryParams = {
  slug: string;
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
