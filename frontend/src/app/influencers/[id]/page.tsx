import { Metadata } from "next";
import Image from "next/image";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const { id } = await params;

  try {

    const response = await fetch(
      `http://localhost:5000/api/seo/influencer/${id}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!data.success) {
      return {
        title: "Influencer Not Found",
      };
    }

    const influencer = data.influencer;

    return {
      title: `${influencer.name} | ${influencer.category} Influencer in ${influencer.city}`,

      description:
        `${influencer.name} is a ${influencer.category} influencer from ${influencer.city} with ${influencer.followers} followers.`,

      alternates: {
        canonical:
          `https://www.influencerconnect.com/influencers/${influencer.id}`,
      },

      openGraph: {
        title: `${influencer.name} | Influencer Connect`,
        description:
          influencer.bio ||
          `${influencer.category} influencer in ${influencer.city}`,
        images: [
          {
            url: influencer.image,
          },
        ],
      },
    };

  } catch (error) {

    console.log(error);

    return {
      title: "Influencer Profile",
    };

  }

}

export default async function InfluencerProfilePage(
  { params }: Props
) {

  const { id } = await params;

  try {

    const response = await fetch(
      `http://localhost:5000/api/influencers/${id}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    console.log("Fetched Influencer:", data);

    if (!data.success) {

      return (
        <main className="min-h-screen flex items-center justify-center">
          <h1 className="text-3xl font-bold text-red-500">
            Influencer not found
          </h1>
        </main>
      );

    }

    const influencer = data.influencer;

    return (
      <main className="min-h-screen bg-gray-100 py-10 px-6">

        <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl">

          <div className="relative w-full h-[500px]">

            {influencer.image ? (

              <Image
                src={influencer.image}
                alt={influencer.name}
                fill
                priority
                className="object-cover"
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                No Image Available
              </div>

            )}

          </div>

          <div className="p-10">

            <h1 className="text-5xl font-bold mb-4">
              {influencer.name}
            </h1>

            <p className="text-2xl text-gray-500 mb-4">
              {influencer.category}
            </p>

            <p className="text-xl font-semibold mb-4">
              📍 {influencer.city}
            </p>

            <p className="text-xl font-semibold mb-6">
              👥 {influencer.followers} Followers
            </p>

            <p className="text-lg text-gray-700 leading-8 mb-8">
              {influencer.bio}
            </p>

            <div className="flex gap-4 flex-wrap">

              {influencer.instagram && (

                <a
                  href={`https://instagram.com/${influencer.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white px-8 py-4 rounded-2xl font-semibold"
                >
                  View Instagram
                </a>

              )}

              {influencer.user_email && (

                <a
                  href={`mailto:${influencer.user_email}`}
                  className="inline-block bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold"
                >
                  Hire Influencer
                </a>

              )}

            </div>

          </div>

        </div>

      </main>
    );

  } catch (error) {

    console.log(error);

    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-500">
          Error loading influencer
        </h1>
      </main>
    );

  }

}