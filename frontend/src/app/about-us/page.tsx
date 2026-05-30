"use client";

export default function AboutPage() {

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-white">

      {/* HERO SECTION */}

      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}

          <div>

            <p className="text-pink-600 font-semibold mb-4 text-lg">
              ABOUT OUR PLATFORM
            </p>

            <h1 className="text-6xl font-bold leading-tight mb-8">
              Connecting Brands
              <br />
              with Top Influencers
            </h1>

            <p className="text-gray-600 text-xl leading-relaxed mb-8">
              Influencer Platform helps brands discover talented creators
              across multiple categories like fashion, tech, lifestyle,
              food, fitness, and more.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed mb-10">
              Our platform allows influencers to create professional
              profiles, showcase their audience reach, and collaborate
              with brands for campaigns and promotions.
            </p>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-5">

              <a
                href="/influencers"
                className="bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition text-center"
              >
                Explore Influencers
              </a>

              <a
                href="/contact-us"
                className="border border-black px-8 py-4 rounded-2xl font-semibold hover:bg-black hover:text-white transition text-center"
              >
                Contact Us
              </a>

            </div>

          </div>

          {/* RIGHT SIDE STATS */}

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">

              <h2 className="text-5xl font-bold text-pink-600 mb-3">
                500+
              </h2>

              <p className="text-gray-600 text-lg">
                Active Influencers
              </p>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">

              <h2 className="text-5xl font-bold text-blue-600 mb-3">
                120+
              </h2>

              <p className="text-gray-600 text-lg">
                Brand Collaborations
              </p>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">

              <h2 className="text-5xl font-bold text-green-600 mb-3">
                25+
              </h2>

              <p className="text-gray-600 text-lg">
                Categories
              </p>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:-translate-y-2 transition">

              <h2 className="text-5xl font-bold text-orange-500 mb-3">
                24/7
              </h2>

              <p className="text-gray-600 text-lg">
                Platform Support
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES SECTION */}

      <section className="bg-black text-white py-24 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16">

            <h2 className="text-5xl font-bold mb-6">
              Why Choose Our Platform?
            </h2>

            <p className="text-gray-300 text-xl max-w-3xl mx-auto">
              Everything needed for influencers and brands to connect
              professionally in one platform.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="bg-gray-900 rounded-3xl p-10 hover:bg-gray-800 transition">

              <div className="text-5xl mb-6">
                🚀
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Fast Growth
              </h3>

              <p className="text-gray-300 text-lg leading-relaxed">
                Grow your audience and connect with brands for amazing
                collaboration opportunities.
              </p>

            </div>

            <div className="bg-gray-900 rounded-3xl p-10 hover:bg-gray-800 transition">

              <div className="text-5xl mb-6">
                🤝
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Brand Deals
              </h3>

              <p className="text-gray-300 text-lg leading-relaxed">
                Get discovered by brands looking for influencers in
                different categories and niches.
              </p>

            </div>

            <div className="bg-gray-900 rounded-3xl p-10 hover:bg-gray-800 transition">

              <div className="text-5xl mb-6">
                🌎
              </div>

              <h3 className="text-3xl font-bold mb-4">
                Nationwide Reach
              </h3>

              <p className="text-gray-300 text-lg leading-relaxed">
                Connect with creators and businesses across India through
                a modern influencer marketplace.
              </p>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}