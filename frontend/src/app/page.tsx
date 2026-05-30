"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/modules/home/components/HeroSection";
import CategoriesSection from "@/modules/home/components/CategoriesSection";
import FeaturedInfluencersSection from "@/modules/home/components/FeaturedInfluencersSection";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/test")
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <main>
      <HeroSection />

      <CategoriesSection />


      <FeaturedInfluencersSection />
    </main>
  );
}