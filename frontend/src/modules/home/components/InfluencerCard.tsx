"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type InfluencerCardProps = {
  id:  string;
  name?: string;
  category?: string;
  followers?: number | string;
  instagram?: string;
  city?: string;
  image?: string;
   verification_status?: string;
};

export default function InfluencerCard({
  id,
  name,
  category,
  followers,
  instagram,
  city,
  image,
 verification_status,
}: InfluencerCardProps) {
  const [saved, setSaved] = useState(false);

useEffect(() => {
  const favourites = JSON.parse(
    localStorage.getItem("favourites") || "[]"
  );

  setSaved(
    favourites.some(
      (item: any) => item.id === id
    )
  );
}, [id]);

const handleFavourite = (
  e: React.MouseEvent
) => {

  e.preventDefault();

  let favourites = JSON.parse(
    localStorage.getItem("favourites") || "[]"
  );

  if (saved) {

    favourites = favourites.filter(
      (item: any) => item.id !== id
    );

    setSaved(false);

  } else {

    favourites.push({
      id,
      name,
      category,
      followers,
      city,
      instagram,
      image,
    });

    setSaved(true);

  }

  localStorage.setItem(
    "favourites",
    JSON.stringify(favourites)
  );

};

  return (
    <Link href={`/influencers/${id}`}>
      <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer">

        <div className="relative h-72 w-full">
          {image ? (
            <Image
              src={image.trim()}
              alt={name || "Influencer"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              No Image
            </div>
          )}
        </div>

        <div className="p-6 space-y-2">

          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">
              {name || "No Name"}
            </h3>

            {verification_status === "Verified" && (

<span className="text-sm bg-black text-white px-3 py-1 rounded-full">

✓ Verified

</span>

)}
          </div>

          <p className="text-gray-600 font-medium">
            {category || "No Category"}
          </p>

          <p className="text-gray-500">
            Followers: {followers || "0"}
          </p>

          {city && (
            <p className="text-gray-500">
              {city}
            </p>
          )}

          {instagram && (
            <p className="text-gray-500">
              Instagram: {instagram}
            </p>
          )}

         <div className="flex gap-2 mt-4">

  <button
    onClick={handleFavourite}
    className="px-4 py-3 border rounded-xl"
  >
    {saved ? "❤️ Saved" : "🤍 Save"}
  </button>

  <button className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
    View Profile
  </button>

</div>

        </div>

      </div>
    </Link>
  );
}