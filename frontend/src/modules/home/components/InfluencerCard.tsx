"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type InfluencerCardProps = {
  id:  string;
  name?: string;
  category?: string;
  followers_count?: number | string;
  instagram?: string;
  city?: string;
  image?: string;
   verification_status?: string;
};

export default function InfluencerCard({
  id,
  name,
  category,
  followers_count,
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
      followers_count: followers_count,
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
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 cursor-pointer w-full">

      <div className="relative w-full aspect-[4/3]">
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

      <div className="p-4 sm:p-6 space-y-2">

        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-2xl font-bold">
            {name || "No Name"}
          </h3>

          {verification_status === "Verified" && (
            <span className="text-xs sm:text-sm bg-black text-white px-2 sm:px-3 py-1 rounded-full">
              ✓ Verified
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm sm:text-base font-medium">
          {category || "No Category"}
        </p>

        <p className="text-gray-500 text-sm">
          Followers: {followers_count || "0"}
        </p>

        {city && (
          <p className="text-gray-500 text-sm">
            {city}
          </p>
        )}

        {instagram && (
          <p className="text-gray-500 text-sm truncate">
            @{instagram}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-2 mt-4">

          <button
            onClick={handleFavourite}
            className="px-4 py-2 border rounded-xl text-sm"
          >
            {saved ? "❤️ Saved" : "🤍 Save"}
          </button>

          <button className="flex-1 bg-black text-white py-2 rounded-xl font-semibold hover:opacity-90 transition text-sm">
            View Profile
          </button>

        </div>

      </div>
    </div>
  </Link>
);
}