"use client";

import { useEffect, useState } from "react";

export default function RequestsPage() {

  const [requests, setRequests] =
    useState<any[]>([]);

  useEffect(() => {

    const data = JSON.parse(
      localStorage.getItem("brandRequests") || "[]"
    );

    setRequests(data);

  }, []);

  return (

    <main className="max-w-7xl mx-auto p-10">

      <h1 className="text-4xl font-bold mb-8">
        Collaboration Requests
      </h1>

      <div className="space-y-4">

        {requests.length === 0 && (
          <p>No requests yet.</p>
        )}

        {requests.map(
          (request, index) => (

            <div
              key={index}
              className="bg-white border rounded-2xl p-6"
            >

              <h2 className="text-xl font-bold">
                {request.influencerName}
              </h2>

              <p>
                Campaign: {request.campaignId}
              </p>

             <p>
  Status: {request.status}
</p>

{request.quoteAmount && (

  <p className="mt-2 text-green-600 font-semibold">

    Quote Amount:
    ₹{request.quoteAmount}

  </p>

)}

            </div>

          )
        )}

      </div>

    </main>

  );
}