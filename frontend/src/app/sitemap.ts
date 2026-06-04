import { MetadataRoute } from "next";

export default async function sitemap():
Promise<MetadataRoute.Sitemap> {

  const response = await fetch(
    "http://localhost:5000/api/influencers",
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  const influencers =
    data.influencers || [];

  const pages: MetadataRoute.Sitemap = [
    {
      url:
        "https://www.influencerconnect.com",
      lastModified: new Date(),
    },

    {
      url:
        "https://www.influencerconnect.com/influencers",
      lastModified: new Date(),
    },
  ];

  const cities = new Set<string>();
  const categories = new Set<string>();

  influencers.forEach((item: any) => {

    pages.push({
      url:
        `https://www.influencerconnect.com/influencers/${item.id}`,
      lastModified: new Date(),
    });

    if (item.city) {
      cities.add(
        item.city.toLowerCase()
      );
    }

    if (item.category) {
      categories.add(
        item.category.toLowerCase()
      );
    }
  });

  cities.forEach((city) => {

    pages.push({
      url:
        `https://www.influencerconnect.com/city/${city}`,
      lastModified: new Date(),
    });

    categories.forEach((category) => {

      pages.push({
        url:
          `https://www.influencerconnect.com/discover/${city}/${category}`,
        lastModified: new Date(),
      });

    });

  });

  return pages;
}