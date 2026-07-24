"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function InfluencerDetailClient({ influencer }: { influencer: any }) {
  const [user, setUser] = useState<any>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  const handleOpenModal = async () => {
    if (!user || user.role !== "brand") {
      alert("Please log in as a Brand to send campaign invitations.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/brand/${user.id}`);
      const data = await res.json();
      setCampaigns(data.campaigns || []);
      setShowInviteModal(true);
    } catch (err) {
      console.log("Error loading campaigns:", err);
      alert("Failed to load your campaigns.");
    }
  };

  const handleSendInvite = async () => {
    if (!selectedCampaignId) {
      alert("Please select a campaign.");
      return;
    }

    const targetInfluencerId = influencer.user_id || influencer.id;

    try {
      setSending(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand_id: user.id,
          influencer_id: targetInfluencerId,
          campaign_id: selectedCampaignId,
        }),
      });

      const data = await res.json();
      alert(data.message || "Invitation sent!");
      setShowInviteModal(false);
      setSelectedCampaignId("");
    } catch (err) {
      console.log("Invite error:", err);
      alert("Failed to send invitation.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl overflow-hidden shadow-xl">
        <div className="relative w-full h-[500px]">
          {influencer.image ? (
            <Image
              src={influencer.image}
              alt={influencer.name}
              fill
              priority
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-medium">
              No Image Available
            </div>
          )}
        </div>

        <div className="p-10">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-5xl font-bold mb-2">{influencer.name}</h1>
              <p className="text-2xl text-gray-500">{influencer.category}</p>
            </div>
            {influencer.verification_status === "Verified" && (
              <span className="bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-full text-sm">
                ✓ Verified Influencer
              </span>
            )}
          </div>

          <div className="flex gap-6 text-xl font-semibold mb-6 text-gray-700">
            <p>📍 {influencer.city || "Location N/A"}</p>
            <p>👥 {influencer.followers_count || influencer.followers || 0} Followers</p>
          </div>

          <p className="text-lg text-gray-700 leading-8 mb-8">
            {influencer.bio || "No bio available."}
          </p>

          <div className="flex gap-4 flex-wrap">
            {influencer.instagram && (
              <a
                href={`https://instagram.com/${influencer.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition"
              >
                View Instagram
              </a>
            )}

            <button
              onClick={handleOpenModal}
              className="inline-block bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-pink-700 transition"
            >
              Invite to Campaign
            </button>
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-2">Invite {influencer.name}</h2>
            <p className="text-gray-500 mb-6">Select one of your campaigns to send an invitation.</p>

            {campaigns.length === 0 ? (
              <div className="mb-6 text-red-500 font-medium">
                You have no active campaigns. Please create a campaign first.
              </div>
            ) : (
              <select
                value={selectedCampaignId}
                onChange={(e) => setSelectedCampaignId(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 mb-6 outline-none focus:border-black"
              >
                <option value="">Select Campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} (Budget: ₹{c.budget})
                  </option>
                ))}
              </select>
            )}

            <div className="flex gap-3">
              <button
                disabled={sending || campaigns.length === 0}
                onClick={handleSendInvite}
                className="bg-black text-white flex-1 py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Invite"}
              </button>

              <button
                onClick={() => setShowInviteModal(false)}
                className="border border-gray-300 flex-1 py-3 rounded-xl font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
