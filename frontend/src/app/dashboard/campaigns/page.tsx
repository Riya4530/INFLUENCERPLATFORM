"use client";

import { useEffect, useState } from "react";

export default function CampaignsPage() {

const [campaigns, setCampaigns] =
useState<any[]>([]);

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

useEffect(() => {


fetchCampaigns();

}, []);

const markCompleted =
  async (id: number) => {

    try {

      await fetch(
        `http://localhost:5000/api/requests/${id}/complete`,
        {
          method: "PUT",
        }
      );

      fetchCampaigns();

    } catch (error) {

      console.log(error);

    }

  };

const generateInvoice =
async (id: number) => {

  try {

    await fetch(
      `http://localhost:5000/api/campaigns/${id}/generate-invoice`,
      {
        method: "POST",
      }
    );

    alert(
      "Invoice Generated Successfully"
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
      Manage your accepted collaborations.
    </p>

    <div className="space-y-6">

      {campaigns.map((campaign) => (

        <div
          key={campaign.id}
          className="bg-white p-8 rounded-3xl shadow-sm"
        >

          <div className="flex justify-between items-center">

            <div>

          <h2 className="text-2xl font-bold">
  {campaign.title}
</h2>

              <p className="text-gray-500 mt-2">
                Brand ID: {campaign.brand_id}
              </p>

              <p className="text-gray-500">
                Status: {campaign.status}
              </p>

            </div>

            <div className="flex flex-col items-end gap-3">

<span
className={`px-4 py-2 rounded-full ${
      campaign.deal_status === "Completed"
        ? "bg-blue-100 text-blue-700"
        : "bg-green-100 text-green-700"
    }`}

>

```
{campaign.deal_status || "Pending"}
```

  </span>

{!campaign.quotation_amount && ( <p className="text-red-500 text-sm">
Send quotation before campaign can start. </p>
)}

{campaign.quotation_amount &&
campaign.status !== "Accepted" && ( <p className="text-yellow-500 text-sm">
Waiting for brand approval. </p>
)}

{campaign.status === "Accepted" &&
campaign.quotation_amount &&
campaign.deal_status === "Accepted" && (


  <button
    onClick={() =>
      markCompleted(campaign.id)
    }
    className="bg-black text-white px-6 py-3 rounded-xl"
  >
    Mark Completed
  </button>


)}

{campaign.deal_status === "Completed" && (


<button
  onClick={() =>
    generateInvoice(
      campaign.id
    )
  }
  className="bg-green-600 text-white px-6 py-3 rounded-xl"
>
  Generate Invoice
</button>


)}

</div>

          </div>

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