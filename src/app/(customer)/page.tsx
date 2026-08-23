import type { Metadata } from "next";

import FeaturedProducts from "@/features/products/components/FeaturedProducts";
import LatestProducts from "@/features/products/components/LatestProducts";
import HomeTestimonials from "@/features/reviews/components/home/HomeTestimonials";
import { SITE_DESCRIPTION, SITE_TAGLINE } from "@/lib/site";

import Features from "./_components/Features";
import Hero from "./_components/Hero";

export const metadata: Metadata = {
  title: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <LatestProducts />
      <FeaturedProducts />
      <HomeTestimonials />
    </>
  );
}
