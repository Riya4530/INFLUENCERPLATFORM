import Link from "next/link";

const cityCards = [
  {
    city: "Mumbai",
    category: "Food",
    desc: "Top food creators in Mumbai",
  },
  {
    city: "Surat",
    category: "Fashion",
    desc: "Trending fashion influencers",
  },
  {
    city: "Ahmedabad",
    category: "Tech",
    desc: "Tech creators you should follow",
  },
];

export default function CityExploreSection() {
  return (
    <section className="px-6 py-24 bg-white">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-5xl font-bold mb-4">
            Explore Influencers By City
          </h2>
          <p className="text-gray-600 text-lg">
            Discover creators based on location and niche.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {cityCards.map((item) => (
            <Link
              key={item.city}
              href={`/discover/${item.city.toLowerCase()}/${item.category.toLowerCase()}`}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 p-10 text-center 
              hover:bg-black hover:text-white transition-all duration-300 
              hover:-translate-y-2 hover:shadow-2xl block"
            >
              {/* Soft glow background effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br from-pink-500 to-purple-500 transition" />

              <h3 className="text-3xl font-bold mb-3 relative z-10">
                {item.city}
              </h3>

              <p className="text-lg font-medium mb-2 relative z-10 opacity-80">
                {item.category} Influencers
              </p>

              <p className="text-sm opacity-70 relative z-10">
                {item.desc}
              </p>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}