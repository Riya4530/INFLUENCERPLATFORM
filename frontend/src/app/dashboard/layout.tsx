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
    <div className="min-h-screen bg-gray-100">

      {/* TOP HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">

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
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
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

          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                InfluencerHub
              </h2>

              <p className="text-gray-400 text-sm">
                Dashboard
              </p>

            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-2xl"
            >
              ✕
            </button>

          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2">

            <Link
              href="/dashboard"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/profile"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard/profile"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              My Profile
            </Link>

            <Link
              href="/dashboard/bookings"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard/bookings"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Bookings
            </Link>

            <Link
              href="/dashboard/campaigns"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard/campaigns"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Campaigns
            </Link>

            <Link
              href="/dashboard/quotations"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard/quotations"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Quotations
            </Link>

            <Link
              href="/dashboard/collaborations"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard/collaborations"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Collaborations
            </Link>

            <Link
              href="/dashboard/invoices"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard/invoices"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Invoices
            </Link>

            <Link
              href="/dashboard/earnings"
              className={`block p-4 rounded-xl transition ${
                pathname === "/dashboard/earnings"
                  ? "bg-white text-black"
                  : "hover:bg-gray-900"
              }`}
            >
              Earnings
            </Link>

          </div>

          {/* Bottom Profile + Logout */}
          <div className="absolute bottom-0 left-0 w-full border-t border-gray-800 p-4">

  <Link
    href="/dashboard/profile"
    className="
      flex items-center gap-3
      p-3
      rounded-xl
      hover:bg-gray-900
      transition
      mb-4
    "
  >

    <img
      src={
        user?.image ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      }
      alt="Profile"
      className="
        w-12 h-12
        rounded-full
        object-cover
        border-2
        border-gray-700
      "
    />

    <div>

      <p className="font-semibold">
        {user?.name || "User"}
      </p>

      <p className="text-xs text-gray-400">
        View Profile →
      </p>

    </div>

  </Link>

  <button
    onClick={handleLogout}
    className="
      w-full
      bg-red-500
      hover:bg-red-600
      py-3
      rounded-xl
      font-semibold
      transition
    "
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