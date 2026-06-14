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
                className="w-28 h-28 rounded-full object-cover border-4 border-pink-500"
              />

              <div>
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                  Welcome Back 👋
                </h1>

                {user && (
                  <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                  </div>
                )}
              </div>

            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-8 py-4 rounded-2xl"
            >
              Logout
            </button>

          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-pink-600 text-white p-8 rounded-3xl">
            <h2 className="text-5xl font-bold">{brandRequests}</h2>
            <p>Brand Requests</p>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-3xl">
            <h2 className="text-5xl font-bold">{activeCampaigns}</h2>
            <p>Active Campaigns</p>
          </div>

        </div>

        {/* PROFILE PROGRESS */}
        <div className="bg-white p-8 rounded-3xl mb-10">

          <div className="flex justify-between">
            <h2 className="text-2xl font-bold">Profile Completion</h2>
            <span>{completion}%</span>
          </div>

          <div className="w-full bg-gray-200 h-4 rounded-full mt-4">
            <div
              className="bg-pink-600 h-4 rounded-full"
              style={{ width: `${completion}%` }}
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {!hasProfile && (
            <a href="/create-profile" className="bg-white p-6 rounded-3xl">
              Create Profile
            </a>
          )}

          {hasProfile && (
            <a href={`/influencers/${profileId}`} className="bg-white p-6 rounded-3xl">
              View Profile
            </a>
          )}

          <a href="/dashboard/profile" className="bg-white p-6 rounded-3xl">
            Edit Profile
          </a>

        </div>

      </div>

    </main>
  );
}