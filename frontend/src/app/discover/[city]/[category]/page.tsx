import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{
    city: string;
    category: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { city, category } = await params;

  const formattedCity =
    city.charAt(0).toUpperCase() +
    city.slice(1);

  const formattedCategory =
    category.charAt(0).toUpperCase() +
    category.slice(1);

  return {
    title: `Top ${formattedCategory} Influencers in ${formattedCity}`,

    description:
      `Find the best ${formattedCategory} influencers in ${formattedCity} for collaborations, influencer marketing and brand promotions.`,

    alternates: {
      canonical:
        `https://www.influencerconnect.com/discover/${city}/${category}`,
    },

    openGraph: {
      title:
        `Top ${formattedCategory} Influencers in ${formattedCity}`,

      description:
        `Find top ${formattedCategory} influencers in ${formattedCity}.`,

      url:
        `https://www.influencerconnect.com/discover/${city}/${category}`,
    },
  };
}

export default async function CityCategoryPage(
  { params }: Props
) {

  const { city, category } = await params;

  const response = await fetch(
    `https://www.influencerconnect.com/api/influencers/city/${city}/category/${category}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  const influencers =
    data.influencers || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name:
      `Top ${category} Influencers in ${city}`,
    description:
      `Find top ${category} influencers in ${city}`,
    url:
      `https://www.influencerconnect.com/discover/${city}/${category}`,
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <h1 className="text-5xl font-bold mb-4">

        {category.charAt(0).toUpperCase() +
          category.slice(1)}

        {" "}Influencers in{" "}

        {city.charAt(0).toUpperCase() +
          city.slice(1)}

      </h1>

      <p className="text-gray-600 mb-10">

        Found {influencers.length} influencers in{" "}
        {city} under {category}.

      </p>

      <div className="grid md:grid-cols-3 gap-8">

        {influencers.map(
          (influencer: any) => (

            <Link
              key={influencer.id}
              href={`/influencers/${influencer.id}`}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition"
            >

              <img
                src={influencer.image}
                alt={influencer.name}
                className="w-full h-64 object-cover rounded-2xl mb-4"
              />

              <h2 className="text-2xl font-bold">
                {influencer.name}
              </h2>

              <p className="text-gray-500">
                {influencer.followers} Followers
              </p>

              <p className="text-sm text-gray-400 mt-2">
                {influencer.city}
              </p>

            </Link>

          )
        )}

      </div>

      <section className="mt-16 max-w-4xl">

        <h2 className="text-3xl font-bold mb-4">

          Why Hire {category} Influencers
          in {city}?

        </h2>

        <p className="text-lg text-gray-600 leading-8 mb-6">

          {city} is one of India's fastest
          growing markets for influencer marketing.
          Brands collaborate with local{" "}
          {category} influencers to increase
          reach, engagement and trust among
          regional audiences.

        </p>

        <h3 className="text-2xl font-semibold mb-3">
          Benefits of Local Influencer Marketing
        </h3>

        <ul className="list-disc pl-6 space-y-2 text-gray-600">

          <li>Higher engagement rates</li>

          <li>Better local audience targeting</li>

          <li>Improved brand awareness</li>

          <li>Cost-effective campaigns</li>

        </ul>

      </section>

      <section className="mt-16 max-w-4xl">

        <h2 className="text-3xl font-bold mb-4">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">

          <div>

            <h3 className="font-semibold text-xl">
              How do I hire influencers in {city}?
            </h3>

            <p className="text-gray-600">
              Browse influencer profiles and
              contact them directly through
              the platform.
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-xl">
              What are the benefits of local influencers?
            </h3>

            <p className="text-gray-600">
              Local influencers have stronger
              audience trust and regional reach.
            </p>

          </div>

        </div>

      </section>

    </main>
  );
}