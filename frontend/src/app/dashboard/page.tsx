"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState("");
  const [profileId, setProfileId] = useState<number | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
const [completion, setCompletion] = useState(0);
const [brandRequests, setBrandRequests] = useState(0);
const [activeCampaigns, setActiveCampaigns] = useState(0);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (
      !storedUser ||
      storedUser === "undefined" ||
      storedUser === "null"
    ) {
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);

      fetch(
        `http://localhost:5000/api/profile/${parsedUser.email}`
      )
        .then((res) => res.json())
        .then((data) => {
       if (data.success && data.profile) {
  setHasProfile(true);

  const profile = data.profile;
  fetchDashboardStats(profile.id);

  setProfileId(profile.id);

  if (profile.image) {
    setProfileImage(profile.image);
  }

  let completed = 0;

  if (profile.name) completed++;
  if (profile.category) completed++;
  if (profile.city) completed++;
  if (profile.followers) completed++;
  if (profile.instagram) completed++;
  if (profile.bio) completed++;
  if (profile.image) completed++;

  setCompletion(Math.round((completed / 7) * 100));
}
        })
        .catch((err) =>
          console.log("Profile fetch error:", err)
        );
    } catch (error) {
      console.log("Invalid user:", error);

      localStorage.removeItem("user");

      window.location.href = "/login";
    }
  }, []);

  const fetchDashboardStats = async (
  influencerId: number
) => {
  try {

    const response = await fetch(
      `http://localhost:5000/api/invitations/${influencerId}`
    );

    const data =
      await response.json();

    const requests =
      data.invitations || [];

    setBrandRequests(
      requests.length
    );

    const accepted =
      requests.filter(
        (request: any) =>
          request.status === "Accepted"
      );

    setActiveCampaigns(
      accepted.length
    );

  } catch (error) {

    console.log(error);

  }
};


  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-3xl shadow-xl p-10 mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            <div className="flex items-center gap-6">

              <img
                src={
                  profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-pink-500"
              />

              <div>

                <h1 className="text-5xl font-bold mb-2">
                  Welcome Back 👋
                </h1>

                <p className="text-gray-500 text-lg mb-3">
                  {user?.role === "brand"
                    ? "Manage your brand account"
                    : "Manage your influencer account"}
                </p>

                {user && (
                  <div className="space-y-1">

                    <p className="text-lg">
                      <span className="font-semibold">
                        Name:
                      </span>{" "}
                      {user.name}
                    </p>

                    <p className="text-lg">
                      <span className="font-semibold">
                        Email:
                      </span>{" "}
                      {user.email}
                    </p>

                    <p className="text-lg">
                      <span className="font-semibold">
                        Role:
                      </span>{" "}
                      {user.role}
                    </p>

                  </div>
                )}

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition"
            >
              Logout
            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          <div className="bg-black text-white rounded-3xl p-8 shadow-lg">

            <h2 className="text-5xl font-bold mb-3">
              12K
            </h2>

            <p className="text-gray-300 text-lg">
              Profile Views
            </p>

          </div>

          <div className="bg-pink-600 text-white rounded-3xl p-8 shadow-lg">

            <h2 className="text-5xl font-bold mb-3">
  {brandRequests}
</h2>

            <p className="text-pink-100 text-lg">
              Brand Requests
            </p>

          </div>

          <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-lg">

            <h2 className="text-5xl font-bold mb-3">
  {activeCampaigns}
</h2>

            <p className="text-blue-100 text-lg">
              Active Campaigns
            </p>

          </div>

        </div>

        {/* ACTION CARDS */}

        <div className="bg-white rounded-3xl p-8 shadow-xl mb-10">

  <div className="flex justify-between items-center mb-4">

    <h2 className="text-3xl font-bold">
      Profile Completion
    </h2>

    <span className="text-2xl font-bold text-pink-600">
      {completion}%
    </span>

  </div>

  <div className="w-full bg-gray-200 rounded-full h-5">

    <div
      className="bg-pink-600 h-5 rounded-full transition-all duration-500"
      style={{
        width: `${completion}%`,
      }}
    />

  </div>

  <p className="text-gray-500 mt-4">
    Complete your profile to attract more brands.
  </p>

</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {!hasProfile && (

            <a
              href="/create-profile"
              className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition"
            >
              <h2 className="text-3xl font-bold mb-4">
                Create Profile
              </h2>

              <p className="text-gray-500">
                Create your influencer profile
              </p>

            </a>

          )}

          {hasProfile && (

            <a
              href={`/influencers/${profileId}`}
              className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition"
            >
              <h2 className="text-3xl font-bold mb-4">
                View My Profile
              </h2>

              <p className="text-gray-500">
                View your public influencer profile
              </p>

            </a>

          )}

          <a
            href="/dashboard/profile"
            className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition"
          >
            <h2 className="text-3xl font-bold mb-4">
              Edit Profile
            </h2>

            <p className="text-gray-500">
              Update your influencer details
            </p>

          </a>

          <a
            href="/influencers"
            className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition"
          >
            <h2 className="text-3xl font-bold mb-4">
              View Influencers
            </h2>

            <p className="text-gray-500">
              Explore all influencers
            </p>

          </a>

        </div>

      </div>

    </main>
  );
}