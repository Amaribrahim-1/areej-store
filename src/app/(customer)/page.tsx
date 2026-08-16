import dynamic from "next/dynamic";

import LatestProducts from "@/features/products/components/LatestProducts";

import Features from "./_components/Features";
import Hero from "./_components/Hero";

const FeaturedProducts = dynamic(
  () => import("@/features/products/components/FeaturedProducts"),
);
const HomeTestimonials = dynamic(
  () => import("@/features/reviews/components/home/HomeTestimonials"),
);

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
