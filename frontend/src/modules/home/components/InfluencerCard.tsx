import Image from "next/image";

type InfluencerCardProps = {
  name?: string;
  category?: string;
  followers?: number | string;
  instagram?: string;
  city?: string;
  image?: string;
};

export default function InfluencerCard({
  name,
  category,
  followers,
  instagram,
  city,
  image,
}: InfluencerCardProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition duration-300">

      {/* IMAGE */}
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

      {/* CONTENT */}
      <div className="p-6 space-y-2">

        {/* NAME */}
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            {name || "No Name"}
          </h3>

          <span className="text-sm bg-black text-white px-3 py-1 rounded-full">
            Verified
          </span>
        </div>

        {/* CATEGORY */}
        <p className="text-gray-600 font-medium">
          {category || "No Category"}
        </p>

        {/* FOLLOWERS */}
        <p className="text-gray-500">
          Followers: {followers || "0"}
        </p>

        {/* CITY */}
        {city && (
          <p className="text-gray-500">
            {city}
          </p>
        )}

        {/* INSTAGRAM */}
        {instagram && (
          <p className="text-gray-500">
            Instagram: {instagram}
          </p>
        )}

        {/* BUTTON */}
        <button className="w-full mt-4 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
          View Profile
        </button>

      </div>
    </div>
  );
}