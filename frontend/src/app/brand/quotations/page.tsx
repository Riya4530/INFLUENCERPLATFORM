"use client";

import { useEffect, useState } from "react";

export default function BrandQuotationsPage() {

  const [quotations, setQuotations] =
    useState<any[]>([]);

  useEffect(() => {
  fetchQuotations();
}, []);

const fetchQuotations = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/brand-quotations/${user.id}`
    );

    const data = await response.json();

    console.log("🔥 BRAND QUOTATIONS RESPONSE:", data);

    setQuotations(data.quotations || []);

    console.log("🔥 STATE SET:", data.quotations);

  } catch (error) {
    console.log(error);
  }
};

const updateDealStatus = async (
  requestId: number,
  status: string
) => {

  try {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/deal/${requestId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          deal_status: status,
        }),
      }
    );

    const data =
      await response.json();

    alert(data.message);

    fetchQuotations();

  } catch (error) {

    console.log(error);

  }

};

  return (

    <main className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Quotations
        </h1>

        <div className="space-y-6">
          {quotations.length === 0 && (
            <div className="bg-white p-8 rounded-3xl text-gray-500">
              No quotations received yet.
            </div>
          )}

          {quotations.map((quote) => (
            <div
              key={quote.id}
              className="bg-white p-8 rounded-3xl shadow-sm"
            >
              <h2 className="text-2xl font-bold">
                {quote.title || `Campaign #${quote.campaign_id}`}
              </h2>

              <p className="mt-2 text-gray-600">
                Influencer: <span className="font-semibold text-gray-900">{quote.influencer_name || "Influencer"}</span>
              </p>

              <p className="mt-4 text-xl font-bold text-green-600">
                Quote: ₹{quote.quotation_amount}
              </p>

              <p className="mt-2 text-gray-700">
                Deal Status:{" "}
                <span className={`font-semibold ${quote.deal_status === "Accepted" ? "text-green-600" : quote.deal_status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>
                  {quote.deal_status || "Pending"}
                </span>
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => updateDealStatus(quote.id, "Accepted")}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                >
                  Accept Quote
                </button>

                <button
                  onClick={() => updateDealStatus(quote.id, "Rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                >
                  Reject Quote
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </main>

  );

}