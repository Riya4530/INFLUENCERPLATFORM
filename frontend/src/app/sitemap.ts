import { MetadataRoute } from "next";

export default async function sitemap():
Promise<MetadataRoute.Sitemap> {

  const response = await fetch(
    "http://localhost:5000/api/influencers"
  );

  const data = await response.json();

  const influencers =
    data.influencers || [];

  const influencerUrls =
    influencers.map((item: any) => ({
      url:
        `https://www.influencerconnect.com/influencers/${item.id}`,

      lastModified:
        new Date(),
    }));

  return [
    {
      url:
        "https://www.influencerconnect.com",
      lastModified:
        new Date(),
    },

    {
      url:
        "https://www.influencerconnect.com/influencers",
      lastModified:
        new Date(),
    },

    ...influencerUrls,
  ];
}