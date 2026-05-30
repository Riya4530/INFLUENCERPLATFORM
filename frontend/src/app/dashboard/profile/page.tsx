"use client";

import { useEffect, useState } from "react";

export default function ProfileSettingsPage() {

  const [user, setUser] = useState<any>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [followers, setFollowers] = useState("");
  const [instagram, setInstagram] = useState("");
  const [image, setImage] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      window.location.href = "/login";
      return;

    }

    const parsedUser =
      JSON.parse(storedUser);

    setUser(parsedUser);

    fetchProfile(parsedUser.email);

  }, []);

  const fetchProfile = async (
    email: string
  ) => {

    try {

      const response = await fetch(
        `http://localhost:5000/api/profile/${email}`
      );

      const data = await response.json();

      if (data.success) {

        setName(data.profile.name || "");
        setCategory(data.profile.category || "");
        setCity(data.profile.city || "");
        setFollowers(data.profile.followers || "");
        setInstagram(data.profile.instagram || "");
        setImage(data.profile.image || "");
        setBio(data.profile.bio || "");

      }

    } catch (error) {

      console.log(error);

    }

  };

  const handleUpdate = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const response = await fetch(
        `http://localhost:5000/api/update-profile/${user.email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name,
            category,
            city,
            followers,
            instagram,
            image,
            bio,
          }),
        }
      );

      const data =
        await response.json();

      alert(data.message);

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow-xl">

        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-3">
            Edit Profile
          </h1>

          <p className="text-gray-500 text-lg">
            Update your influencer profile
          </p>

        </div>

        <form
          onSubmit={handleUpdate}
          className="space-y-8"
        >

          <div>

            <label className="block mb-3 font-semibold">
              Influencer Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
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
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            >

              <option value="">
                Select Category
              </option>

              <option value="Fashion">
                Fashion
              </option>

              <option value="Food">
                Food
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
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              placeholder="Enter city"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Followers
            </label>

            <input
              type="text"
              value={followers}
              onChange={(e) =>
                setFollowers(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Instagram Username
            </label>

            <input
              type="text"
              value={instagram}
              onChange={(e) =>
                setInstagram(e.target.value)
              }
              placeholder="@username"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

          </div>

          <div>

            <label className="block mb-3 font-semibold">
              Profile Image URL
            </label>

            <input
              type="text"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

          </div>

          {image && (
            <img
              src={image}
              alt="preview"
              className="w-40 h-40 rounded-2xl object-cover"
            />
          )}

          <div>

            <label className="block mb-3 font-semibold">
              Bio
            </label>

            <textarea
              rows={5}
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            ></textarea>

          </div>

          <button
            type="submit"
            className="bg-black text-white px-8 py-4 rounded-2xl hover:opacity-90 transition"
          >
            Save Changes
          </button>

        </form>

      </div>

    </main>
  );
}