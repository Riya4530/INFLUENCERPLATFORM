"use client";

import { useEffect, useState } from "react";
import InfluencerCard from "@/modules/home/components/InfluencerCard";


export default function InfluencersPage() {

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [influencers, setInfluencers] = useState<any[]>([]);

 

  useEffect(() => {
  fetch("http://localhost:5000/api/influencers")
    .then((res) => res.json())
    .then((data) => {
      const list = data.influencers || data;
      setInfluencers(list || []);
    });
}, []);

  const filteredInfluencers = influencers.filter(
    (influencer: any) => {

      const matchesSearch = influencer.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        influencer.category === category;

      return matchesSearch && matchesCategory;
    }
  );
  

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">

      <div className="mb-14">

        <h1 className="text-6xl font-bold mb-4">
          Explore Influencers
        </h1>

        <p className="text-xl text-gray-600">
          Discover creators across multiple categories.
        </p>

      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-14">

        <input
          type="text"
          placeholder="Search influencers..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
        >

          <option value="All">
            All Categories
          </option>

          <option value="Food">
            Food
          </option>

          <option value="Fashion">
            Fashion
          </option>

          <option value="Tech">
            Tech
          </option>

          <option value="Lifestyle">
            Lifestyle
          </option>

        </select>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

  {filteredInfluencers.map(
    (influencer: any) => (

      <InfluencerCard
        key={influencer.id}
        id={influencer.id}
        name={influencer.name}
        category={influencer.category}
        followers={influencer.followers}
        city={influencer.city}
        instagram={influencer.instagram}
        image={influencer.image}
      />

    )
  )}

</div>
    </main>
  );
}        