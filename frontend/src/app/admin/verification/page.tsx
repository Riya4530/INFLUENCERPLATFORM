"use client";

import { useEffect, useState } from "react";

export default function VerificationPage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchInfluencers();
  }, []);

  const fetchInfluencers = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/admin/influencers"
      );

      const data = await res.json();

      console.log("Influencers:", data);

      setInfluencers(data.influencers || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const updateVerification = async (
    id: string,
    status: string
  ) => {
    try {
      setUpdating(id);

      const res = await fetch(
        `http://localhost:5000/api/admin/influencers/${id}/verify`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert(`Influencer ${status}`);
        fetchInfluencers();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(null);
    }
  };

  const pendingInfluencers = influencers.filter(
    (inf) =>
      inf.verification_status?.toLowerCase() === "pending"
  );

  if (loading) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          Loading Verification Requests...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-3">
          Influencer Verification
        </h1>

        <p className="text-gray-500 mb-10">
          Review and approve influencer profiles
        </p>

        {pendingInfluencers.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl shadow">
            <h2 className="text-2xl font-bold">
              No Pending Requests
            </h2>

            <p className="text-gray-500 mt-2">
              All influencer profiles are reviewed.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {pendingInfluencers.map((inf) => (
              <div
                key={inf.id}
                className="bg-white p-6 rounded-3xl shadow hover:shadow-xl transition"
              >
                {inf.image ? (
                  <img
                    src={inf.image}
                    alt={inf.name}
                    className="w-full h-64 object-cover rounded-2xl"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
                    No Image
                  </div>
                )}

                <h2 className="text-2xl font-bold mt-5">
                  {inf.name}
                </h2>

                <p className="text-gray-600">
                  Category: {inf.category}
                </p>

                <p className="text-gray-600">
                  City: {inf.city}
                </p>

                <p className="mt-3">
                  Status:
                  <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                    {inf.verification_status}
                  </span>
                </p>

                <div className="flex gap-3 mt-6">
                  <button
                    disabled={updating === String(inf.id)}
                    onClick={() =>
                      updateVerification(
                        String(inf.id),
                        "Verified"
                      )
                    }
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl disabled:opacity-50"
                  >
                    Approve
                  </button>

                  <button
                    disabled={updating === String(inf.id)}
                    onClick={() =>
                      updateVerification(
                        String(inf.id),
                        "Rejected"
                      )
                    }
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}