"use client";

import { useEffect, useState } from "react";

export default function CreateProfilePage() {
  const [email, setEmail] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [city, setCity] = useState("");
  const [followers, setFollowers] = useState("");
  const [bio, setBio] = useState("");
  const [instagram, setInstagram] = useState("");
  const [image, setImage] = useState("");

  const [uploading, setUploading] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
      return;
    }

    const user = JSON.parse(storedUser);
    setEmail(user.email);

    // fetch categories
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.categories);
        }
      })
      .catch((err) => console.log(err));

    // fetch profile
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${user.email}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfileExists(true);

          setName(data.profile.name || "");
          setCategory(data.profile.category || "");
          setCity(data.profile.city || "");
          setFollowers(data.profile.followers_count || "");
          setBio(data.profile.bio || "");
          setInstagram(data.profile.instagram || "");
          setImage(data.profile.image || "");
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: reader.result,
            }),
          }
        );

        const data = await response.json();
        console.log("UPLOAD RESPONSE:", data);

        if (data.success) {
          setImage(data.imageUrl);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
    console.log("RIYA TEST 999");
      const url = profileExists
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/update-profile/${email}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/create-profile`;

      const method = profileExists ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_email: email,
          name,
          category,
          city,
          followers_count: followers ? Number(followers) : null,
          bio,
          instagram,
          image,
        }),
      });

      const data = await response.json();

      alert(data.message);

      if (data.success) {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-3xl bg-white p-10 rounded-[30px] shadow-2xl border border-gray-100">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <img
              src={
                image ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile Preview"
              className="w-32 h-32 rounded-full object-cover border-4 border-pink-500"
            />
          </div>

          <h1 className="text-5xl font-extrabold mb-4">
            {profileExists ? "Edit Profile" : "Create Influencer Profile"}
          </h1>

          <p className="text-gray-500 text-lg">
            {profileExists
              ? "Update your creator profile"
              : "Build your creator profile and connect with brands"}
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-7">

          {/* NAME */}
          <div>
            <label className="block mb-3 font-semibold">
              Influencer Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block mb-3 font-semibold">
              Category
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* CITY */}
          <div>
            <label className="block mb-3 font-semibold">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4"
            />
          </div>

          {/* FOLLOWERS */}
          <div>
            <label className="block mb-3 font-semibold">Followers</label>
            <input
              type="number"
              value={followers}
              onChange={(e) => setFollowers(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4"
            />
          </div>

          {/* INSTAGRAM */}
          <div>
            <label className="block mb-3 font-semibold">
              Instagram Username
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4"
            />
          </div>

          {/* IMAGE UPLOAD (FIXED) */}
          <div>
            <label className="block mb-3 font-semibold">
              Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4"
            />

            {profileExists && image && (
              <p className="text-sm text-gray-500 mt-2">
                Current image will be replaced if you upload a new one.
              </p>
            )}

            {uploading && (
              <p className="text-blue-500 mt-2">Uploading image...</p>
            )}
          </div>

          {/* BIO */}
          <div>
            <label className="block mb-3 font-semibold">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 h-36"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg hover:scale-[1.02] transition"
          >
            {profileExists ? "Update Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}