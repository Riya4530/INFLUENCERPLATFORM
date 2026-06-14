"use client";

import { useEffect, useState } from "react";

export default function BrandInvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/brand/${user.id}`
      );

      const data = await response.json();

      console.log("BRAND INVOICES:", data);

      setInvoices(data.invoices || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const markPaid = async (id: number) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/${id}/pay`,
        {
          method: "PUT",
        }
      );

      fetchInvoices();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <div className="p-10">Loading invoices...</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-10">
      <h1 className="text-4xl font-bold mb-8">
        Brand Invoices
      </h1>

      <div className="space-y-4">
        {invoices.length === 0 && (
          <div className="bg-white p-6 rounded-xl">
            No invoices found.
          </div>
        )}

        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-bold">
              {invoice.campaign_name}
            </h2>

            <p className="text-gray-600">
              Influencer: {invoice.influencer_email}
            </p>

            <p className="mt-2">
              Total: ₹{invoice.total}
            </p>

            <p className="mt-2">
              Status: {invoice.status}
            </p>

            {invoice.status !== "Paid" && (
              <button
                onClick={() => markPaid(invoice.id)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Mark Paid
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}