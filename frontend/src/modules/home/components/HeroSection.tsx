import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white px-6 py-28">
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

        <div className="flex justify-center gap-4 flex-wrap">

          {/* Explore Influencers Button */}
          <Link href="/influencers">
            <button className="bg-black text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition">
              Explore Influencers
            </button>
          </Link>

          {/* Become Creator Button */}
          <Link href="/create-influencer">
            <button className="border border-black px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-black hover:text-white transition">
              Become a Creator
            </button>
          </Link>

        </div>

      </div>
    </section>
  );
}