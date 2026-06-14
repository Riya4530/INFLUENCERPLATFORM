"use client";

import { useEffect, useState } from "react";

export default function QuotationsPage() {

  const [requests, setRequests] =
    useState<any[]>([]);

  useEffect(() => {

    fetchRequests();

  }, []);

const fetchRequests = async () => {
  try {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    console.log("USER FROM STORAGE:", user);

    if (!user?.id) {
      console.log("NO USER ID FOUND");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${user.id}`
    );

    const data = await response.json();

    console.log("API RESPONSE:", data);

    setRequests(data.invitations || []);
  } catch (error) {
    console.log(error);
  }
};
  const submitQuote = async (
    requestId: number,
    amount: string
  ) => {

    try {

      const response =
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/quotation/${requestId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              quotation_amount:
                amount,
            }),
          }
        );

      const data =
        await response.json();

      alert(data.message);

      fetchRequests();

    } catch (error) {

      console.log(error);

      alert(
        "Failed to send quotation"
      );

    }

  };

  return (

    <main className="max-w-6xl mx-auto p-10">

      <h1 className="text-4xl font-bold mb-8">
        Quotations
      </h1>

      <div className="space-y-4">

        {requests.length === 0 && (

          <div className="bg-white p-6 rounded-2xl">

            <p>
              No accepted campaigns available.
            </p>

          </div>

        )}

        {requests.map((request) => (

          <QuoteCard
            key={request.id}
            request={request}
            submitQuote={submitQuote}
          />

        ))}

      </div>

    </main>

  );

}

function QuoteCard({
  request,
  submitQuote,
}: any) {

  const [amount, setAmount] =
    useState("");

  return (

    <div className="bg-white border rounded-2xl p-6">

     <h2 className="text-2xl font-bold">
  {request.title || `Campaign #${request.campaign_id}`}
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

<p className="mt-3">
  Status: {request.status}
</p>

      <div className="mt-4 flex gap-2">

        <input
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
          placeholder="Enter Quote Amount"
          className="border rounded-lg p-2 flex-1"
        />

        <button
          onClick={() =>
            submitQuote(
              request.id,
              amount
            )
          }
          className="bg-black text-white px-4 rounded-lg"
        >
          Send Quote
        </button>

      </div>

      {request.quotation_amount && (

        <p className="mt-4 text-green-600 font-semibold">

          Quotation Sent:
          ₹{request.quotation_amount}

        </p>

      )}

      {request.deal_status && (

  <p
    className={`mt-2 font-semibold ${
      request.deal_status === "Accepted"
        ? "text-green-600"
        : "text-red-600"
    }`}
  >
    Brand Response:
    {request.deal_status}
  </p>

)}

    </div>

  );

}