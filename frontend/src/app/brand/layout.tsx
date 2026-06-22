"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* TOPBAR */}
      <header className="bg-white border-b sticky top-0 z-50">

        <div className="px-4 md:px-8 py-4 flex justify-between items-center">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-3xl"
            >
              ☰
            </button>

            <h1 className="text-2xl font-bold">
              InfluencerHub
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              className="w-10 h-10 rounded-full border"
            />

            <div className="hidden sm:block">

              <p className="font-semibold">
                {user?.name}
              </p>

              <p className="text-sm text-gray-500">
                Brand
              </p>

            </div>

          </div>

        </div>

      </header>

      <div className="flex">

        {/* MOBILE OVERLAY */}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static
            top-0 left-0
            h-screen
            w-72
            bg-black
            text-white
            z-50
            transform
            transition-transform
            duration-300
            ${
              isOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
            md:translate-x-0
          `}
        >

          <div className="p-6 border-b border-gray-800 flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
                InfluencerHub
              </h2>

              <p className="text-gray-400 text-sm">
                Brand Dashboard
              </p>

            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-2xl"
            >
              ✕
            </button>

          </div>

          <div className="p-4 space-y-2">

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
              Campaigns
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
              Influencers
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
              href="/brand/analytics"
              className={`block p-4 rounded-xl ${
                pathname === "/brand/analytics"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Analytics
            </Link>

          </div>

          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-800">

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
            >
              Logout
            </button>

          </div>

        </aside>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}