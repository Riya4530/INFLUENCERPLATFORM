import InfluencerCard from "./InfluencerCard";
import { influencers } from "@/data/influencers";

export default function FeaturedInfluencersSection() {
  return (
    <section className="px-6 py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold mb-4">
            Featured Influencers
          </h2>

          <p className="text-lg text-gray-600">
            Work with trending creators across multiple industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {influencers.slice(0, 3).map((influencer) => (
            <InfluencerCard
              key={influencer.slug}
              name={influencer.name}
              category={influencer.category}
              followers={influencer.followers}
              city={influencer.city}
              image={influencer.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}