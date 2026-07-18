"use client";

import { useEffect, useState } from "react";

export default function RequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/brand-requests/${user.id}`
      );

      const data = await response.json();

      setRequests(data.requests || []);

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          Loading Requests...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Collaboration Requests
          </h1>

          <p className="text-gray-500 text-lg">
            Track all influencer invitations.
          </p>
        </div>

        <div className="space-y-6">

          {requests.length === 0 && (
            <div className="bg-white p-8 rounded-3xl">
              No requests found.
            </div>
          )}

          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-8 rounded-3xl shadow-sm"
            >
              <h2 className="text-2xl font-bold">
                {request.influencer_name || "Influencer"}
              </h2>

              <p className="text-gray-600 mt-2">
                Campaign: <span className="font-semibold text-gray-900">{request.title || request.campaign_id}</span>
              </p>

              {request.quotation_amount && (
                <p className="text-green-600 font-bold mt-2">
                  Quoted Price: ₹{request.quotation_amount}
                </p>
              )}

              <div className="mt-4 flex gap-3 items-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    request.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : request.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : request.status === "Quoted"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  Status: {request.status || "Pending"}
                </span>

                {request.deal_status && (
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      request.deal_status === "Accepted"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    Deal: {request.deal_status}
                  </span>
                )}
              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  );
}