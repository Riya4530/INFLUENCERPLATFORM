"use client";

import { useEffect, useState } from "react";

export default function BrandRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/requests");
        const data = await res.json();

        setRequests(data.requests || []);
      } catch (error) {
        console.log(error);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-xl font-bold">Loading requests...</div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Brand Requests</h1>

      {requests.length === 0 ? (
        <p>No requests found</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req: any) => (
            <div
              key={req.id}
              className="border p-4 rounded-xl bg-white shadow"
            >
              <p><b>Brand ID:</b> {req.brand_id}</p>
              <p><b>Influencer ID:</b> {req.influencer_id}</p>
              <p><b>Campaign ID:</b> {req.campaign_id}</p>
              <p>
                <b>Status:</b>{" "}
                <span className="text-orange-600">{req.status}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}