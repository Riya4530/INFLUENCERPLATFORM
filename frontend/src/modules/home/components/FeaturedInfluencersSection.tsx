"use client";

import { useEffect, useState } from "react";
import InfluencerCard from "./InfluencerCard";

export default function FeaturedInfluencersSection() {
  const [influencers, setInfluencers] = useState<any[]>([]);

  useEffect(() => {
    // fetch initial list
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/influencers`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.influencers)) {
          setInfluencers(data.influencers);
        }
      })
      .catch(() => {});

    // subscribe to SSE
    const es = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/api/influencers/stream`);
    es.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        if (payload.type === "initial" || payload.type === "update") {
          setInfluencers(payload.influencers || []);
        }
      } catch (err) {
        // ignore
      }
    };
    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, []);

  return (
    <section className="px-6 py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold mb-4">Featured Influencers</h2>

          <p className="text-lg text-gray-600">
            Work with trending creators across multiple industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {influencers.slice(0, 3).map((influencer) => (
            <InfluencerCard
              key={influencer.id ?? influencer.slug ?? influencer.name}
              id={influencer.id ?? influencer.slug}
              name={influencer.name}
              category={influencer.category}
              followers_count={influencer.followers_count ?? influencer.followers}
              city={influencer.city}
              image={influencer.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}