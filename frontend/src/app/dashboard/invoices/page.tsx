"use client";

import { useEffect, useState } from "react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      console.log("USER:", user); // debug

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/influencer/${user.email}`
      );

      const data = await response.json();

      console.log("INVOICES:", data); // debug

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

  const markPaid = async (id: string) => {
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
    return <main className="p-10">Loading invoices...</main>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8">
        My Invoices
      </h1>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Client</th>
              <th className="text-left p-4">Campaign</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">GST</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="p-4">{invoice.client_name}</td>
                <td className="p-4">{invoice.campaign_name}</td>
                <td className="p-4">₹{invoice.amount}</td>
                <td className="p-4">₹{invoice.gst}</td>
                <td className="p-4 font-semibold">
                  ₹{invoice.total}
                </td>

                <td className="p-4">

<a
  href={invoice.pdf_url}
  download
  className="bg-green-600 text-white px-4 py-2 rounded-lg ml-2"
>
  Download PDF
</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}