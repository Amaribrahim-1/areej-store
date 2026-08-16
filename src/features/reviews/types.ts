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

export type HomeTestimonialsParams = {
  pageSize?: number;
};

export type HomeTestimonial = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  rating: number;
  comment: string;
  createdAt: string;
  authorName: string;
};

export type MyProductReviewQueryParams = {
  slug: string;
};

/** The signed-in customer's own review for a product (no authorName needed). */
export type MyProductReview = {
  id: string;
  productId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};
