"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeroSection() {

const router = useRouter();

const [search, setSearch] =
useState("");

const handleSearch = async () => {

console.log("Searching:", search);
try {

  const response = await fetch(
    "http://localhost:5000/api/search-data"
  );

  const data = await response.json();

  const cities =
    data.cities.map(
      (item: any) =>
        item.city.toLowerCase()
    );

  const categories =
    data.categories.map(
      (item: any) =>
        item.category.toLowerCase()
    );

  const text =
    search.toLowerCase();

  let foundCity = "";
  let foundCategory = "";

  cities.forEach((city: string) => {

    if (
      text.includes(city)
    ) {
      foundCity = city;
    }

  });

  categories.forEach(
    (category: string) => {

      if (
        text.includes(category)
      ) {
        foundCategory =
          category;
      }

    }
  );

  if (
    !foundCity ||
    !foundCategory
  ) {

    alert(
      "Try: Food Influencers in Mumbai"
    );

    return;

  }

  router.push(
    `/discover/${foundCity}/${foundCategory}`
  );

} catch (error) {

  console.log(error);

  alert(
    "Search failed"
  );

}
};

return ( <section className="bg-gradient-to-b from-gray-50 to-white px-6 py-28">


  <div className="max-w-5xl mx-auto text-center">

    <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-6">
      India’s Creator Marketplace
    </p>

    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
      Find Top Influencers
      <span className="block text-gray-500">
        Across India
      </span>
    </h1>

    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
      Connect brands with creators for powerful campaigns,
      collaborations, and audience growth.
    </p>

    <div className="max-w-3xl mx-auto flex gap-3 mb-10">

      <input
        type="text"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
        placeholder="Food Influencers in Mumbai"
        className="flex-1 border border-gray-300 rounded-2xl px-6 py-4 outline-none focus:border-black"
      />

      <button
        onClick={handleSearch}
        className="bg-black text-white px-8 rounded-2xl font-semibold"
      >
        Search
      </button>

    </div>

    <div className="flex justify-center gap-4 flex-wrap">

      <Link href="/influencers">
        <button className="bg-black text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition">
          Explore Influencers
        </button>
      </Link>

      <Link href="/create-profile">
        <button className="border border-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-black hover:text-white transition">
          Become a Creator
        </button>
      </Link>

    </div>

  </div>

</section>
);
}
