"use client";

import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-72 bg-black text-white p-8 flex flex-col justify-between shadow-2xl">

        <div>
          <div className="mb-12">
            <h1 className="text-4xl font-bold">
              InfluencerHub
            </h1>

            <p className="text-gray-400 mt-2">
              Admin Dashboard
            </p>
          </div>

          <div className="space-y-3">

            <a
              href="/admin"
              className={`block px-5 py-4 rounded-2xl ${
                pathname === "/admin"
                  ? "bg-white text-black"
                  : "hover:bg-gray-800"
              }`}
            >
              Dashboard
            </a>

            <a
              href="/admin/verification"
              className={`block px-5 py-4 rounded-2xl ${
                pathname === "/admin/verification"
                  ? "bg-white text-black"
                  : "hover:bg-gray-800"
              }`}
            >
              Verification
            </a>

            <a
              href="/admin/users"
              className={`block px-5 py-4 rounded-2xl ${
                pathname === "/admin/users"
                  ? "bg-white text-black"
                  : "hover:bg-gray-800"
              }`}
            >
              Users
            </a>

            <a
              href="/admin/categories"
              className={`block px-5 py-4 rounded-2xl ${
                pathname === "/admin/categories"
                  ? "bg-white text-black"
                  : "hover:bg-gray-800"
              }`}
            >
              Categories
            </a>

            <a
              href="/admin/analytics"
              className={`block px-5 py-4 rounded-2xl ${
                pathname === "/admin/analytics"
                  ? "bg-white text-black"
                  : "hover:bg-gray-800"
              }`}
            >
              Analytics
            </a>

          </div>
        </div>

      </aside>

      {/* Page Content */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}