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

      const profileResponse =
        await fetch(
          `http://localhost:5000/api/profile/${user.email}`
        );

      const profileData =
        await profileResponse.json();

      const influencerId =
        profileData.profile.id;

      const response =
        await fetch(
          `http://localhost:5000/api/invitations/${influencerId}`
        );

      const data =
        await response.json();

      const acceptedCampaigns =
        (data.invitations || []).filter(
          (item: any) =>
            item.status === "Accepted"
        );

      setCampaigns(
        acceptedCampaigns
      );

    } catch (error) {

      console.log(error);

    }

  };

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
          Active Campaigns
        </h1>

        <p className="text-gray-500 mb-10">
          Your accepted collaborations.
        </p>

        <div className="space-y-6">

          {campaigns.map((campaign) => (

            <div
              key={campaign.id}
              className="bg-white p-8 rounded-3xl shadow-sm flex justify-between items-center"
            >

              <div>

                <h2 className="text-2xl font-bold">
                  Campaign #{campaign.campaign_id}
                </h2>

                <p className="text-gray-500 mt-2">
                  Brand ID: {campaign.brand_id}
                </p>

              </div>

              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                Active
              </span>

            </div>

          ))}

          {campaigns.length === 0 && (

            <div className="bg-white p-10 rounded-3xl text-center">

              <h2 className="text-2xl font-bold mb-2">
                No Active Campaigns
              </h2>

              <p className="text-gray-500">
                Accept a booking request to see campaigns here.
              </p>

            </div>

          )}

        </div>

      </div>

    </main>
  );
}