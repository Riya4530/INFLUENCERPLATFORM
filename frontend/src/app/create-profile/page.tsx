"use client";

import { useState } from "react";

export default function CreateProfilePage() {

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [followers, setFollowers] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const response = await fetch(
      "http://localhost:5000/api/create-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: user.email,
          name,
          category,
          city,
          followers,
          bio,
          instagram,
          image,
        }),
      }
    );

    const data = await response.json();

    alert(data.message);

    if (data.success) {
      window.location.href = "/dashboard";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-3xl bg-white p-10 rounded-[30px] shadow-2xl border border-gray-100">

        <div className="text-center mb-10">

          <h1 className="text-5xl font-extrabold mb-4">
            Create Influencer Profile
          </h1>

          <p className="text-gray-500 text-lg">
            Build your creator profile and connect with brands.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          <div>

            <label className="block mb-3 font-semibold">
              Influencer Name
            </label>

            <input
              type="text"
              placeholder="Enter influencer name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
            >

              <option value="">
                Select Category
              </option>

              <option value="Food">
                Food
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Tech">
                Tech
              </option>

              <option value="Lifestyle">
                Lifestyle
              </option>

            </select>

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              City
            </label>

            <input
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Followers
            </label>

            <input
              type="text"
              placeholder="Example: 250K"
              value={followers}
              onChange={(e) =>
                setFollowers(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Instagram Username
            </label>

            <input
              type="text"
              placeholder="@username"
              value={instagram}
              onChange={(e) =>
                setInstagram(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Profile Image URL
            </label>

            <input
              type="text"
              placeholder="Paste image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-pink-500"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Bio
            </label>

            <textarea
              placeholder="Tell brands about yourself..."
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 h-36 outline-none focus:border-pink-500"
            ></textarea>

          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg hover:scale-[1.02] transition duration-300"
          >
            Create Profile
          </button>

        </form>

      </div>

    </main>
  );
}