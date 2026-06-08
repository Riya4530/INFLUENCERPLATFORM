"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BrandLayout({
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
            Brand Dashboard
          </p>
        </div>

        <div className="flex-1 p-5 space-y-3">

          <Link
            href="/brand"
            className={`block p-4 rounded-xl ${
              pathname === "/brand"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/brand/campaigns"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/campaigns"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            My Campaigns
          </Link>

          <Link
            href="/brand/create-campaign"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/create-campaign"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Create Campaign
          </Link>

          <Link
            href="/brand/influencers"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/influencers"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Find Influencers
          </Link>

          <Link
            href="/brand/requests"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/requests"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Requests
          </Link>

          <Link
            href="/brand/quotations"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/quotations"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Quotations
          </Link>

          <Link
            href="/brand/collaborations"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/collaborations"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Collaborations
          </Link>

          <Link
            href="/brand/analytics"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/analytics"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Analytics
          </Link>

          <Link
            href="/brand/recommendations"
            className={`block p-4 rounded-xl ${
              pathname === "/brand/recommendations"
                ? "bg-white text-black"
                : "hover:bg-gray-900"
            }`}
          >
            Recommendations
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