import { Metadata } from "next";
import InfluencerDetailClient from "./InfluencerDetailClient";

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
      `${process.env.NEXT_PUBLIC_API_URL}/api/seo/influencer/${id}`,
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/influencers/${id}`,
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

    return <InfluencerDetailClient influencer={influencer} />;

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