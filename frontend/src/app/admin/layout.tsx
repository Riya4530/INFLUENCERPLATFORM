"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <header className="bg-white border-b sticky top-0 z-50">

        <div className="px-4 md:px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-3xl font-bold"
            >
              ☰
            </button>

            <h1 className="text-xl md:text-2xl font-bold">
              InfluencerHub Admin
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Admin"
              className="w-10 h-10 rounded-full border"
            />

            <div className="hidden sm:block">

              <p className="font-semibold">
                {user?.name || "Admin"}
              </p>

              <p className="text-sm text-gray-500">
                Administrator
              </p>

            </div>

          </div>

        </div>

      </header>

      <div className="flex">

        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed md:static
            top-0 left-0
            h-screen
            w-72
            bg-slate-950
            text-white
            z-50
            transform
            transition-transform
            duration-300
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
            }
            md:translate-x-0
          `}
        >

          {/* SIDEBAR HEADER */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold">
                InfluencerHub
              </h2>

              <p className="text-slate-400 text-sm">
                Admin Dashboard
              </p>

            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-2xl"
            >
              ✕
            </button>

          </div>

          {/* PROFILE */}
          <div className="p-5 border-b border-slate-800">

            <div className="flex items-center gap-3">

              <img
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                className="w-12 h-12 rounded-full"
                alt="Admin"
              />

              <div>

                <p className="font-semibold">
                  {user?.name || "Admin"}
                </p>

                <p className="text-xs text-slate-400">
                  Administrator
                </p>

              </div>

            </div>

          </div>

          {/* MENU */}
          <div className="p-4 space-y-2">

            <Link
              href="/admin"
              className={`block p-4 rounded-xl ${
                pathname === "/admin"
                  ? "bg-white text-black"
                  : "hover:bg-slate-900"
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/admin/verification"
              className={`block p-4 rounded-xl ${
                pathname === "/admin/verification"
                  ? "bg-white text-black"
                  : "hover:bg-slate-900"
              }`}
            >
              Verification
            </Link>

            <Link
              href="/admin/users"
              className={`block p-4 rounded-xl ${
                pathname === "/admin/users"
                  ? "bg-white text-black"
                  : "hover:bg-slate-900"
              }`}
            >
              Users
            </Link>

            <Link
              href="/admin/categories"
              className={`block p-4 rounded-xl ${
                pathname === "/admin/categories"
                  ? "bg-white text-black"
                  : "hover:bg-slate-900"
              }`}
            >
              Categories
            </Link>

            <Link
              href="/admin/analytics"
              className={`block p-4 rounded-xl ${
                pathname === "/admin/analytics"
                  ? "bg-white text-black"
                  : "hover:bg-slate-900"
              }`}
            >
              Analytics
            </Link>

          </div>

          {/* LOGOUT */}
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-slate-800">

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold transition"
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