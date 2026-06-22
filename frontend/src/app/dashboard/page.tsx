"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState("");
  const [profileId, setProfileId] = useState<string | null>(null);

  const [hasProfile, setHasProfile] = useState(false);
  const [completion, setCompletion] = useState(0);

  const [brandRequests, setBrandRequests] = useState(0);
  const [activeCampaigns, setActiveCampaigns] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser || storedUser === "undefined") {
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    console.log("LOGGED IN USER:", parsedUser);

    setUser(parsedUser);

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/profile/${parsedUser.email}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setHasProfile(true);

          const profile = data.profile;

          console.log("PROFILE DATA:", profile);

          // IMPORTANT: use user.id (UUID), NOT profile.id
          const influencerId = parsedUser.id;

          setProfileId(profile.id || null);

     fetchDashboardStats(parsedUser.id);

          if (profile.image) {
            setProfileImage(profile.image);
          }

          let completed = 0;

          if (profile.name) completed++;
          if (profile.category) completed++;
          if (profile.city) completed++;
          if (profile.followers_count) completed++;
          if (profile.instagram) completed++;
          if (profile.bio) completed++;
          if (profile.image) completed++;

          setCompletion(Math.round((completed / 7) * 100));
        }
      })
      .catch((err) => console.log(err));
  }, []);
const fetchDashboardStats = async (userId: string) => {
  try {
    console.log("FETCHING FOR USER ID:", userId);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${userId}`
    );

    const data = await response.json();

    const requests = data.invitations || [];

    setBrandRequests(requests.length);

    const accepted = requests.filter(
      (r: any) => r.status === "Accepted"
    );

    setActiveCampaigns(accepted.length);

  } catch (error) {
    console.log(error);
  }
};
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

 return (
  <main className="min-h-screen bg-gray-100 p-6">

    <div className="max-w-7xl mx-auto">

      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 md:p-10 shadow-xl mb-8">

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          <div>

            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Welcome Back 👋
            </h1>

            <p className="text-lg text-pink-100 mb-4">
              Manage collaborations, campaigns and grow your influence.
            </p>

            <div className="space-y-1">

              <p>
                <span className="font-semibold">
                  Name:
                </span>{" "}
                {user?.name}
              </p>

              <p>
                <span className="font-semibold">
                  Email:
                </span>{" "}
                {user?.email}
              </p>

              <p>
                <span className="font-semibold">
                  Role:
                </span>{" "}
                {user?.role}
              </p>

            </div>

          </div>

          <img
            src={
              profileImage ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <p className="text-gray-500 mb-2">
            Brand Requests
          </p>

          <h2 className="text-5xl font-bold text-pink-600">
            {brandRequests}
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <p className="text-gray-500 mb-2">
            Active Campaigns
          </p>

          <h2 className="text-5xl font-bold text-blue-600">
            {activeCampaigns}
          </h2>

        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg">

          <p className="text-gray-500 mb-2">
            Profile Completion
          </p>

          <h2 className="text-5xl font-bold text-green-600">
            {completion}%
          </h2>

        </div>

      </div>

      {/* PROFILE COMPLETION */}
      <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">

        <div className="flex justify-between mb-4">

          <h2 className="text-2xl font-bold">
            Profile Strength
          </h2>

          <span className="font-bold text-lg">
            {completion}%
          </span>

        </div>

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

          <div
            className="h-4 bg-gradient-to-r from-pink-500 to-purple-600"
            style={{
              width: `${completion}%`,
            }}
          />

        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {!hasProfile && (
          <a
            href="/create-profile"
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
          >

            <h2 className="text-2xl font-bold mb-2">
              Create Profile
            </h2>

            <p className="text-gray-500">
              Complete your creator profile.
            </p>

          </a>
        )}

        {hasProfile && (
          <a
            href={`/influencers/${profileId}`}
            className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
          >

            <h2 className="text-2xl font-bold mb-2">
              View Profile
            </h2>

            <p className="text-gray-500">
              Check your public profile.
            </p>

          </a>
        )}

        <a
          href="/dashboard/profile"
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
        >

          <h2 className="text-2xl font-bold mb-2">
            Edit Profile
          </h2>

          <p className="text-gray-500">
            Update your profile information.
          </p>

        </a>

        <a
          href="/dashboard/campaigns"
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
        >

          <h2 className="text-2xl font-bold mb-2">
            Campaigns
          </h2>

          <p className="text-gray-500">
            View all your campaigns.
          </p>

        </a>

        <a
          href="/dashboard/collaborations"
          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition"
        >

          <h2 className="text-2xl font-bold mb-2">
            Collaborations
          </h2>

          <p className="text-gray-500">
            Manage ongoing partnerships.
          </p>

        </a>

      </div>

    </div>

  </main>
);
}