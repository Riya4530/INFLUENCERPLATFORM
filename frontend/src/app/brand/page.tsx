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
      `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${brandId}`
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
  `${process.env.NEXT_PUBLIC_API_URL}/api/brand-requests/${brandId}`
);

const requestsData =
  await requestsResponse.json();

console.log("FULL RESPONSE");
console.log(requestsData);

  console.log("Requests Data:", requestsData.requests);

const acceptedRequests =
  (requestsData.requests || []).filter(
    (request: any) =>
      request.status === "Accepted"
  );

console.log(
  "Accepted Requests:",
  acceptedRequests
);

const uniqueInfluencers =
  new Set(
    acceptedRequests.map(
      (request: any) =>
        request.influencer_id
    )
  );

setConnectedInfluencers(
  uniqueInfluencers.size
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
  <main className="space-y-8">

    {/* HERO */}
    <div className="bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-3xl p-10 shadow-xl">

      <h1 className="text-4xl md:text-5xl font-bold mb-3">
        Welcome, {user.name}! 👋
      </h1>

      <p className="text-slate-300 text-lg">
        Manage campaigns and collaborate with influencers.
      </p>

    </div>

    {/* STATS */}
    <div className="grid md:grid-cols-3 gap-6">

      <div className="bg-white rounded-3xl p-8 shadow-sm">

        <h2 className="text-5xl font-bold text-slate-900">
          {campaignCount}
        </h2>

        <p className="text-gray-500 mt-3">
          Campaigns
        </p>

      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">

        <h2 className="text-5xl font-bold text-slate-900">
          ₹{totalSpend.toLocaleString()}
        </h2>

        <p className="text-gray-500 mt-3">
          Total Spend
        </p>

      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm">

        <h2 className="text-5xl font-bold text-slate-900">
          {connectedInfluencers}
        </h2>

        <p className="text-gray-500 mt-3">
          Connected Influencers
        </p>

      </div>

    </div>

    {/* QUICK ACTIONS */}
    <div className="grid md:grid-cols-2 gap-6">

      <a
        href="/brand/favourites"
        className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition"
      >

        <h2 className="text-2xl font-bold mb-2">
          Favourite Influencers
        </h2>

        <p className="text-gray-500">
          View creators you've saved.
        </p>

      </a>

      <a
        href="/brand/recommendations"
        className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition"
      >

        <h2 className="text-2xl font-bold mb-2">
          Recommendations
        </h2>

        <p className="text-gray-500">
          Discover new influencer matches.
        </p>

      </a>

      <a
        href="/brand/create-campaign"
        className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition"
      >

        <h2 className="text-2xl font-bold mb-2">
          Create Campaign
        </h2>

        <p className="text-gray-500">
          Launch a new marketing campaign.
        </p>

      </a>

      <a
        href="/brand/influencers"
        className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition"
      >

        <h2 className="text-2xl font-bold mb-2">
          Find Influencers
        </h2>

        <p className="text-gray-500">
          Search creators by category.
        </p>

      </a>

    </div>

  </main>
);
}