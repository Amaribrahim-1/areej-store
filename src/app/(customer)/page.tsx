import FeaturedProducts from "@/features/products/components/FeaturedProducts";
import LatestProducts from "@/features/products/components/LatestProducts";
import HomeTestimonials from "@/features/reviews/components/home/HomeTestimonials";

import Features from "./_components/Features";
import Hero from "./_components/Hero";

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
