"use client";

import { useEffect, useState } from "react";

export default function CampaignsPage() {

  const [campaigns, setCampaigns] =
    useState<any[]>([]);

  useEffect(() => {

    fetchCampaigns();

  }, []);

  const fetchCampaigns = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await fetch(
        `http://localhost:5000/api/campaigns/${user.id}`
      );

      const data =
        await response.json();

      setCampaigns(
        data.campaigns || []
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          My Campaigns
        </h1>

        <div className="space-y-6">

          {campaigns.length === 0 && (

            <div className="bg-white p-8 rounded-3xl">

              No campaigns created yet.

            </div>

          )}

          {campaigns.map((campaign) => (

            <div
              key={campaign.id}
              className="bg-white p-8 rounded-3xl shadow-sm"
            >

              <h2 className="text-2xl font-bold mb-3">
                {campaign.title}
              </h2>

              <p className="text-gray-500">
                Budget: {campaign.budget}
              </p>

              <p className="text-gray-500">
                Category: {campaign.category}
              </p>

              <p className="mt-4">
                {campaign.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </main>

  );

}