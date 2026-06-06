"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <aside className="w-72 bg-black text-white flex flex-col">

        <div className="p-8 border-b border-gray-800">

          <h1 className="text-3xl font-bold">
            InfluencerHub
          </h1>

          <p className="text-gray-400 mt-2">
            Dashboard
          </p>

        </div>

        <div className="flex-1 p-5 space-y-3">

          <Link
            href="/dashboard"
            className={`block p-4 rounded-xl ${
              pathname === "/dashboard"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/profile"
            className={`block p-4 rounded-xl ${
              pathname === "/dashboard/profile"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            My Profile
          </Link>

          <Link
            href="/dashboard/bookings"
            className={`block p-4 rounded-xl ${
              pathname === "/dashboard/bookings"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Bookings
          </Link>

          <Link
            href="/dashboard/campaigns"
            className={`block p-4 rounded-xl ${
              pathname === "/dashboard/campaigns"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Campaigns
          </Link>

          <Link
            href="/dashboard/quotations"
            className={`block p-4 rounded-xl ${
              pathname === "/dashboard/quotations"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Quotations
          </Link>

          <Link
            href="/dashboard/messages"
            className={`block p-4 rounded-xl ${
              pathname === "/dashboard/messages"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Messages
          </Link>

        </div>

        <div className="p-5 border-t border-gray-800">

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full bg-red-500 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>

      </aside>

      {/* PAGE CONTENT */}

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}