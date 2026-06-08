"use client";

import { useEffect, useState } from "react";

export default function MyCollaborationsPage() {

  const [collaborations, setCollaborations] =
    useState<any[]>([]);

  useEffect(() => {

    fetchCollaborations();

  }, []);

  const fetchCollaborations =
    async () => {

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
            `http://localhost:5000/api/my-collaborations/${influencerId}`
          );

        const data =
          await response.json();

        setCollaborations(
          data.collaborations || []
        );

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          My Collaborations
        </h1>

        <div className="space-y-6">

          {collaborations.length === 0 && (

            <div className="bg-white p-8 rounded-3xl">

              <p>
                No active collaborations.
              </p>

            </div>

          )}

          {collaborations.map(
            (item) => (

              <div
                key={item.id}
                className="bg-white p-8 rounded-3xl shadow-sm"
              >

                <h2 className="text-2xl font-bold">
                  {item.title}
                </h2>

                <p className="mt-2">
                  Brand:
                  {" "}
                  {item.brand_name}
                </p>

                <p className="mt-2">
                  Agreed Amount:
                  {" "}
                  ₹{item.quotation_amount}
                </p>

                <p className="mt-2 text-green-600 font-semibold">
                  Status:
                  {" "}
                  {item.deal_status}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </main>

  );

}