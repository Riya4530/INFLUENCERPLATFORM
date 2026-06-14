import { Metadata } from "next";
import Link from "next/link";

type Props = {
  params: Promise<{
    city: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { city } = await params;

  const formattedCity =
    city.charAt(0).toUpperCase() +
    city.slice(1);

  return {
    title: `Top Influencers in ${formattedCity}`,

    description:
      `Find top influencers in ${formattedCity} for brand collaborations and influencer marketing.`,

    alternates: {
      canonical:
        `${process.env.NEXT_PUBLIC_API_URL}/discover/${city}`,
    },
  };
}

export default async function CityPage(
  { params }: Props
) {

  const { city } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/influencers/city/${city}`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  const influencers =
    data.influencers || [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      <h1 className="text-5xl font-bold mb-4">
        Top Influencers in {city}
      </h1>

      <p className="text-gray-600 mb-10">
        Discover the best influencers in {city}.
      </p>

      <div className="grid md:grid-cols-3 gap-8">

        {influencers.map(
          (influencer: any) => (

            <Link
              key={influencer.id}
              href={`/influencers/${influencer.id}`}
              className="bg-white rounded-3xl shadow-lg p-6"
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
                {influencer.followers}
              </p>

              <p className="text-sm text-gray-400">
                {influencer.category}
              </p>

            </Link>

          )
        )}

      </div>

      <section className="mt-16">

        <h2 className="text-3xl font-bold mb-4">
          Influencer Marketing in {city}
        </h2>

        <p className="text-lg text-gray-600 leading-8">
          Brands can collaborate with influencers in {city}
          to reach local audiences, improve engagement,
          and increase brand visibility.
        </p>

      </section>

    </main>
  );
}