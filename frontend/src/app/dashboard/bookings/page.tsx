"use client";

import { useEffect, useState } from "react";

export default function BookingsPage() {

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {

    fetchRequests();

  }, []);

  const fetchRequests = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${user.id}`
    );

    const data =
      await response.json();

    setRequests(
      data.invitations || []
    );

  } catch (error) {

    console.log(error);

  }

};

  const updateStatus = async (
  requestId: number,
  status: string
) => {

  try {

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/requests/${requestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    fetchRequests();

  } catch (error) {

    console.log(error);

  }

};

  return (
    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-3">
            Collaboration Requests
          </h1>

          <p className="text-gray-500 text-lg">
            Manage brand partnership requests.
          </p>

        </div>

        <div className="space-y-6">
          {requests.length === 0 && (
            <div className="bg-white p-8 rounded-3xl text-gray-500">
              No collaboration requests received yet.
            </div>
          )}

          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-8 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div>
                <h2 className="text-2xl font-bold">
                  {request.title || `Campaign #${request.campaign_id}`}
                </h2>

                <p className="text-gray-600 mt-1 font-semibold">
                  Brand: {request.brand_name || "Brand Partner"}
                </p>

                {request.budget && (
                  <p className="text-gray-500 mt-1">
                    Budget: ₹{request.budget}
                  </p>
                )}

                {request.category && (
                  <p className="text-gray-500">
                    Category: {request.category}
                  </p>
                )}

                {request.description && (
                  <p className="mt-3 text-gray-700">
                    {request.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    request.status === "Accepted"
                      ? "bg-green-100 text-green-700"
                      : request.status === "Rejected"
                      ? "bg-red-100 text-red-700"
                      : request.status === "Quoted"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {request.status || "Pending"}
                </span>

                {request.status === "Pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(request.id, "Accepted")}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateStatus(request.id, "Rejected")}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold transition"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

    </main>
  );
}