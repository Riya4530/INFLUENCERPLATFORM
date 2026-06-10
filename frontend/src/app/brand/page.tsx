"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BrandDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
const [campaignCount, setCampaignCount] = useState(0);
const [totalSpend, setTotalSpend] = useState(0);
const [connectedInfluencers, setConnectedInfluencers] = useState(0);


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
    fetchCampaigns(parsed.id);
  }, [router]);

  const fetchCampaigns = async (
  brandId: string
) => {
  try {

    const response = await fetch(
      `http://localhost:5000/api/campaigns/${brandId}`
    );

    const data =
      await response.json();

    const campaigns =
      data.campaigns || [];

    setCampaignCount(
      campaigns.length
    );

    const spend = campaigns.reduce(
  (sum: number, campaign: any) =>
    sum + Number(campaign.budget || 0),
  0
);

setTotalSpend(spend);

const requestsResponse = await fetch(
  `http://localhost:5000/api/brand-requests/${brandId}`
);

const requestsData =
  await requestsResponse.json();

const acceptedRequests =
  (requestsData.requests || []).filter(
    (request: any) =>
      request.status === "Accepted"
  );

setConnectedInfluencers(
  acceptedRequests.length
);

  } catch (error) {

    console.log(error);

  }
};

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
        <h2 className="text-4xl font-bold">
  {campaignCount}
</h2>

            <p className="text-gray-500 mt-2">
              Active Campaigns
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
           <h2 className="text-4xl font-bold">
  ₹{totalSpend.toLocaleString()}
</h2>
            <p className="text-gray-500 mt-2">
              Total Spend
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm">
           <h2 className="text-4xl font-bold">
  {connectedInfluencers}
</h2>
            <p className="text-gray-500 mt-2">
              Influencers Connected
            </p>
          </div>

        </div>

        {/* ACTION CARDS */}
      

<div className="grid md:grid-cols-2 gap-6">

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