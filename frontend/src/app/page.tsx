import type { Metadata } from "next";

import HeroSection from "@/modules/home/components/HeroSection";
import CategoriesSection from "@/modules/home/components/CategoriesSection";
import FeaturedInfluencersSection from "@/modules/home/components/FeaturedInfluencersSection";
import CityExploreSection from "@/modules/home/components/CityExploreSection";

export const metadata: Metadata = {
  title:
    "Find Top Influencers Across India",

  description:
    "Discover food, fashion, lifestyle and tech influencers from cities across India. Connect brands with the right creators.",

  alternates: {
    canonical:
      "https://www.influencerconnect.com",
  },
};

export default function Home() {
  return (
    <main>
     
      <HeroSection />

      <CategoriesSection />
      <CityExploreSection />

      <FeaturedInfluencersSection />
    </main>
  );
}