"use client";

import { useEffect, useState } from "react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);

  // -----------------------------
  // FETCH CAMPAIGNS (ACCEPTED ONLY)
  // -----------------------------
  const fetchCampaigns = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const influencerId = user.id;
      if (!influencerId) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${influencerId}`
      );

      const data = await response.json();

      const activeCampaigns = (data.invitations || []).filter(
        (item: any) => item.deal_status === "Accepted"
      );

      setCampaigns(activeCampaigns);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // -----------------------------
  // MARK COMPLETED
  // -----------------------------
  const markCompleted = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/requests/${id}/complete`,
        {
          method: "PUT",
        }
      );

      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "Completed" } : c
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------
  // GENERATE INVOICE (FIXED)
  // -----------------------------
  const generateInvoice = async (requestId: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/requests/${requestId}/generate-invoice`,
        {
          method: "POST",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Invoice Generated Successfully!");
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === requestId ? { ...c, invoice_generated: true } : c
          )
        );
      } else {
        alert(data.message || "Failed to generate invoice");
      }
    } catch (error) {
      console.log(error);
      alert("Failed to generate invoice");
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
              key={`${campaign.id}-${campaign.brand_id}`}
              className="bg-white p-8 rounded-3xl shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {campaign.title}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Brand: {campaign.brand_name || campaign.brand_email || campaign.brand_id}
                  </p>

                  <p className="text-gray-500">
                    Budget: {campaign.budget ? `₹${Number(campaign.budget).toLocaleString("en-IN")}` : "N/A"}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <span
                    className={`px-4 py-2 rounded-full ${
                      campaign.status === "Completed"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {campaign.status || "Active"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 mt-6 items-center">
                {campaign.status !== "Completed" && (
                  <button
                    onClick={() => markCompleted(campaign.id)}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Mark Completed
                  </button>
                )}

                {campaign.status === "Completed" && !campaign.invoice_generated && (
                  <button
                    onClick={() => generateInvoice(campaign.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                  >
                    Generate Invoice
                  </button>
                )}

                {campaign.status === "Completed" && campaign.invoice_generated && (
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 text-emerald-800 font-semibold px-4 py-2.5 rounded-xl text-sm">
                      ✓ Invoice Generated
                    </span>
                    <a
                      href="/dashboard/invoices"
                      className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition inline-block"
                    >
                      View Invoices
                    </a>
                  </div>
                )}
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