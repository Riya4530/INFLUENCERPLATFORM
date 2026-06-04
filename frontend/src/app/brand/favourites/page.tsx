"use client";

import { useEffect, useState } from "react";
import InfluencerCard from "@/modules/home/components/InfluencerCard";

export default function FavouriteInfluencersPage() {
  const [favourites, setFavourites] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("favourites") || "[]"
    );

    setFavourites(saved);
  }, []);

  return (
    <main className="min-h-screen p-10 bg-gray-100">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
          Favourite Influencers ❤️
        </h1>

        <p className="text-gray-500 mb-10">
          Your saved creators
        </p>

        {favourites.length === 0 ? (

          <div className="bg-white p-10 rounded-3xl">
            No saved influencers yet.
          </div>

        ) : (

          <div className="grid md:grid-cols-3 gap-8">

            {favourites.map((item) => (
              <InfluencerCard
                key={item.id}
                id={item.id}
                name={item.name}
                category={item.category}
                followers={item.followers}
                city={item.city}
                instagram={item.instagram}
                image={item.image}
              />
            ))}

          </div>

        )}

      </div>

    </main>
  );
}