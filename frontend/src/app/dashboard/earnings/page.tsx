"use client";

import { useEffect, useState } from "react";

export default function EarningsPage() {

  const [stats, setStats] =
    useState({
      total: 0,
      paid: 0,
      pending: 0,
    });

 useEffect(() => {
  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invoices/influencer/${user.email}`
      );

      const data = await response.json();

      const invoices = data.invoices || [];

      const total = invoices.reduce(
        (sum: number, invoice: any) =>
          sum + Number(invoice.total || 0),
        0
      );

      const paid = invoices
        .filter((i: any) => i.status === "Paid")
        .reduce(
          (sum: number, invoice: any) =>
            sum + Number(invoice.total || 0),
          0
        );

      const pending = invoices
        .filter((i: any) => i.status !== "Paid")
        .reduce(
          (sum: number, invoice: any) =>
            sum + Number(invoice.total || 0),
          0
        );

      setStats({ total, paid, pending });
    } catch (error) {
      console.log(error);
    }
  };

  fetchData();
}, []);

  return (

    <main className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold mb-10">
        Earnings Dashboard
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-gray-500 mb-2">
            Total Revenue
          </h2>

          <p className="text-4xl font-bold">
            ₹{stats.total}
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-gray-500 mb-2">
            Paid Revenue
          </h2>

          <p className="text-4xl font-bold text-green-600">
            ₹{stats.paid}
          </p>

        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-gray-500 mb-2">
            Pending Revenue
          </h2>

          <p className="text-4xl font-bold text-yellow-600">
            ₹{stats.pending}
          </p>

        </div>

      </div>

    </main>

  );

}