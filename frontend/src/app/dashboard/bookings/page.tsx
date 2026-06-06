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

const profileResponse = await fetch(
  `http://localhost:5000/api/profile/${user.email}`
);

const profileData =
  await profileResponse.json();

const influencerId =
  profileData.profile.id;

const response = await fetch(
  `http://localhost:5000/api/invitations/${influencerId}`
);
     const data = await response.json();

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
      `http://localhost:5000/api/requests/${requestId}`,
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

          {requests.map((request) => (

            <div
              key={request.id}
              className="bg-white p-8 rounded-3xl shadow-sm flex justify-between items-center"
            >

              <div>

                <h2 className="text-2xl font-bold">
  {request.title}
</h2>

<p className="text-gray-500 mt-2">
  Budget: {request.budget}
</p>

<p className="text-gray-500">
  Category: {request.category}
</p>

<p className="mt-3 text-gray-700">
  {request.description}
</p>

<p className="mt-3 font-medium">
  Status: {request.status}
</p>

              </div>

             <div className="flex items-center gap-3">

  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
    {request.status}
  </span>

  {request.status === "Pending" && (

    <>
      <button
        onClick={() =>
          updateStatus(
            request.id,
            "Accepted"
          )
        }
        className="bg-green-600 text-white px-4 py-2 rounded-xl"
      >
        Accept
      </button>

      <button
        onClick={() =>
          updateStatus(
            request.id,
            "Rejected"
          )
        }
        className="bg-red-600 text-white px-4 py-2 rounded-xl"
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