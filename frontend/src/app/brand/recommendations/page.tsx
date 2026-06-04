"use client";

import { useEffect, useState } from "react";
import InfluencerCard from "@/modules/home/components/InfluencerCard";

export default function RecommendationsPage() {

  const [influencers, setInfluencers] = useState<any[]>([]);
  const [recommended, setRecommended] = useState<any[]>([]);

  useEffect(() => {

    fetch("http://localhost:5000/api/influencers")
      .then((res) => res.json())
      .then((data) => {

        const allInfluencers =
          data.influencers || data;

        setInfluencers(allInfluencers);

        const favourites = JSON.parse(
          localStorage.getItem("favourites") || "[]"
        );

        const favouriteCategories =
          favourites.map(
            (item: any) => item.category
          );

        const recommendedInfluencers =
          allInfluencers.filter(
            (inf: any) =>
              favouriteCategories.includes(
                inf.category
              )
          );

        setRecommended(
          recommendedInfluencers
        );

      });

  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold mb-4">
        Recommended Influencers
      </h1>

      <p className="text-gray-500 mb-10">
        Based on your saved favourites.
      </p>

      {recommended.length === 0 ? (

        <div className="bg-white rounded-3xl p-10 shadow-sm">

          <h2 className="text-2xl font-bold mb-3">
            No Recommendations Yet
          </h2>

          <p className="text-gray-500">
            Save some influencers to receive
            recommendations.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-3 gap-8">

          {recommended.map(
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

      )}

    </main>
  );
}