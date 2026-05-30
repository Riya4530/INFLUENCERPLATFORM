"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      window.location.href = "/login";
    } else {
      setUser(JSON.parse(storedUser));
    }

  }, []);

  const handleLogout = () => {

    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-6">

      <div className="max-w-6xl mx-auto">

        {/* TOP SECTION */}

        <div className="bg-white rounded-3xl shadow-xl p-10 mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            <div className="flex items-center gap-6">

              <img
                src="https://i.pravatar.cc/150?img=12"
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-pink-500"
              />

              <div>

                <h1 className="text-5xl font-bold mb-2">
                  Welcome Back 👋
                </h1>

                <p className="text-gray-500 text-lg">
                  Manage your influencer account
                </p>

                {user && (
                  <div className="mt-4 space-y-1">

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
              45
            </h2>

            <p className="text-pink-100 text-lg">
              Brand Requests
            </p>
          </div>

          <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-5xl font-bold mb-3">
              8
            </h2>

            <p className="text-blue-100 text-lg">
              Active Campaigns
            </p>
          </div>

        </div>

        {/* ACTION CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

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

          <a
            href="/dashboard/profile"
            className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition"
          >
            <h2 className="text-3xl font-bold mb-4">
              Edit Profile
            </h2>

            <p className="text-gray-500">
              Update influencer details
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

        {/* RECENT ACTIVITY */}

        <div className="bg-white rounded-3xl shadow-xl p-10">

          <h2 className="text-3xl font-bold mb-8">
            Recent Activity
          </h2>

          <div className="space-y-6">

            <div className="border rounded-2xl p-5">
              <p className="font-semibold">
                Brand collaboration request received
              </p>

              <p className="text-gray-500">
                Nike sent you a campaign invitation
              </p>
            </div>

            <div className="border rounded-2xl p-5">
              <p className="font-semibold">
                Profile updated successfully
              </p>

              <p className="text-gray-500">
                Your profile changes were saved
              </p>
            </div>

            <div className="border rounded-2xl p-5">
              <p className="font-semibold">
                New followers gained
              </p>

              <p className="text-gray-500">
                You gained 120 followers this week
              </p>
            </div>

          </div>

        </div>

      </div>

    </main>
  );
} 