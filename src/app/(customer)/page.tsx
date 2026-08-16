import LatestProducts from "@/features/products/components/LatestProducts";

import Features from "./_components/Features";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <LatestProducts />
    </>
  );
}
