"use client";

import { useEffect, useState } from "react";

export default function BrandQuotationsPage() {

  const [quotations, setQuotations] =
    useState<any[]>([]);

  useEffect(() => {

    fetchQuotations();

  }, []);

  const fetchQuotations =
    async () => {

      try {

      const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

        const response =
          await fetch(
            `http://localhost:5000/api/brand-quotations/${user.id}`
          );

        const data =
          await response.json();

        setQuotations(
          data.quotations || []
        );

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

          {quotations.map(
            (quote) => (

              <div
                key={quote.id}
                className="bg-white p-8 rounded-3xl shadow-sm"
              >

                <h2 className="text-2xl font-bold">
                  Campaign ID:
                  {quote.campaign_id}
                </h2>

                <p className="mt-2">
                  Influencer ID:
                  {quote.influencer_id}
                </p>

                <p className="mt-2 text-lg font-semibold">
                  Quote:
                  ₹{quote.quotation_amount}
                </p>

              </div>

            )
          )}

        </div>

      </div>

    </main>

  );

}