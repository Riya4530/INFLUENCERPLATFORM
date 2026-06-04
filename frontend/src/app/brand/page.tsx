"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BrandDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);

    if (parsed.role !== "brand") {
      router.push("/login");
      return;
    }

    setUser(parsed);
  }, [router]);

  if (!user) {
    return (
      <div style={{ padding: "40px", fontSize: "20px" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-8 shadow-sm mb-10">

          <h1 className="text-5xl font-bold mb-3">
            Welcome, {user.name} 👋
          </h1>

          <p className="text-gray-500 text-lg">
            Manage campaigns and discover influencers.
          </p>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-4xl font-bold">3</h2>
            <p className="text-gray-500 mt-2">
              Active Campaigns
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-4xl font-bold">
              ₹1,20,000
            </h2>
            <p className="text-gray-500 mt-2">
              Total Spend
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
            <h2 className="text-4xl font-bold">
              12
            </h2>
            <p className="text-gray-500 mt-2">
              Influencers Connected
            </p>
          </div>

        </div>

        {/* ACTION CARDS */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <a
            href="/influencers"
            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold mb-3">
              Discover Influencers
            </h2>

            <p className="text-gray-500">
              Search and connect with creators.
            </p>
          </a>

          <a
            href="/dashboard/campaigns/create"
            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold mb-3">
              Create Campaign
            </h2>

            <p className="text-gray-500">
              Launch a new influencer campaign.
            </p>
          </a>

          <a
            href="/dashboard/messages"
            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold mb-3">
              Messages
            </h2>

            <p className="text-gray-500">
              Chat with influencers.
            </p>
          </a>

          <a
            href="/dashboard/bookings"
            className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition"
          >
            <h2 className="text-2xl font-bold mb-3">
              Collaboration Requests
            </h2>

            <p className="text-gray-500">
              Manage quotes and requests.
            </p>
          </a>

<a
  href="/brand/favourites"
  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition"
>
  <h2 className="text-2xl font-bold mb-3">
    Favourite Influencers
  </h2>

  <p className="text-gray-500">
    View your saved creators.
  </p>
</a>

<a
  href="/brand/recommendations"
  className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition"
>
  <h2 className="text-2xl font-bold mb-3">
    Recommendations
  </h2>

  <p className="text-gray-500">
    Suggested influencers based on favourites.
  </p>
</a>

        </div>

      </div>

    </main>
  );
}