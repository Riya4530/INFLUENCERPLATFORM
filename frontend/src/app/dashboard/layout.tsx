"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        if (parsedUser.image) {
          setProfileImage(parsedUser.image);
        }

        // Fetch user profile to get Cloudinary image & updated details
        if (parsedUser.email) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/profile/${parsedUser.email}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.profile) {
                if (data.profile.image) {
                  setProfileImage(data.profile.image);
                }
                if (data.profile.name) {
                  setUser((prev: any) => ({ ...prev, name: data.profile.name }));
                }
              }
            })
            .catch((err) => console.log(err));
        }
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
    <div className="min-h-screen bg-gray-100">

      {/* MOBILE-ONLY SUB-HEADER (for sidebar hamburger toggle) */}
      <header className="bg-white border-b md:hidden sticky top-16 z-40 shadow-sm">

        <div className="px-4 md:px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden text-3xl font-bold"
            >
              ☰
            </button>

            <h1 className="text-xl md:text-2xl font-bold">
              InfluencerHub
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <img
              src={profileImage || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border"
            />

            <div className="hidden sm:block">

              <p className="font-semibold">
                {user?.name || "Influencer"}
              </p>

              <p className="text-sm text-gray-500">
                {user?.role || "User"}
              </p>

            </div>

          </div>

        </div>

      </header>

      <div className="flex">

        {/* MOBILE OVERLAY */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:sticky
            top-0 md:top-[73px]
            left-0
            h-screen md:h-[calc(100vh-73px)]
            w-72
            bg-black
            text-white
            z-40 md:z-30
            flex flex-col justify-between
            shrink-0
            overflow-y-auto
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
          {/* Top part of sidebar */}
          <div>
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  InfluencerHub
                </h2>
                <p className="text-gray-400 text-xs">
                  Dashboard
                </p>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden text-2xl text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-4 space-y-1.5">
              <Link
                href="/dashboard"
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  pathname === "/dashboard"
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/bookings"
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  pathname === "/dashboard/bookings"
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Bookings
              </Link>

              <Link
                href="/dashboard/campaigns"
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  pathname === "/dashboard/campaigns"
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Campaigns
              </Link>

              <Link
                href="/dashboard/quotations"
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  pathname === "/dashboard/quotations"
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Quotations
              </Link>

              <Link
                href="/dashboard/collaborations"
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  pathname === "/dashboard/collaborations"
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Collaborations
              </Link>

              <Link
                href="/dashboard/invoices"
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  pathname === "/dashboard/invoices"
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Invoices
              </Link>

              <Link
                href="/dashboard/earnings"
                className={`block px-4 py-3 rounded-xl font-medium transition ${
                  pathname === "/dashboard/earnings"
                    ? "bg-white text-black font-semibold"
                    : "text-gray-300 hover:bg-gray-900 hover:text-white"
                }`}
              >
                Earnings
              </Link>
            </nav>
          </div>

          {/* Bottom Profile & Logout Card */}
          <div className="p-4 border-t border-gray-800 bg-black">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-900 transition mb-3"
            >
              <img
                src={
                  profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-700"
              />

              <div className="overflow-hidden">
                <p className="font-semibold text-sm truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-400">
                  View Profile →
                </p>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm text-white"
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