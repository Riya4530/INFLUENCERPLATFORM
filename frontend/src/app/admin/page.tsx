"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {

  const [influencers, setInfluencers] =
    useState<any[]>([]);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  useEffect(() => {

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {

      window.location.href =
        "/login";

      return;

    }

    const parsedUser =
      JSON.parse(storedUser);

    if (
      parsedUser.role !== "admin"
    ) {

      alert("Access Denied");

      window.location.href = "/";

      return;

    }

    fetchInfluencers();
    fetchMessages();

    setLoading(false);

  }, []);

  const fetchInfluencers =
    async () => {

      try {

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/influencers`
          );

        const data =
          await response.json();

        if (data.success) {

          setInfluencers(
            data.influencers
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  const fetchMessages =
    async () => {

      try {

        const response =
 await fetch(
 `${process.env.NEXT_PUBLIC_API_URL}/api/contact`
 );
        const data =
          await response.json();

        if (data.success) {

          setMessages(
            data.messages
          );

        }

      } catch (error) {

        console.log(error);

      }

    };

  const handleLogout = () => {

    localStorage.removeItem("user");

    window.location.href =
      "/login";

  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">

        Loading...

      </div>

    );

  }

  return (
  <main className="min-h-screen">

    {/* HERO */}
     <div className="bg-gradient-to-r from-black via-gray-900 to-gray-400 text-white rounded-3xl p-8 md:p-10 shadow-xl mb-8">

  
      <h1 className="text-4xl font-bold mb-2">
        Welcome Back Admin 👋
      </h1>

      <p className="text-slate-300">
        Monitor users, influencers and platform activity.
      </p>

    </div>

    {/* STATS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <div className="bg-white rounded-3xl p-8 shadow-sm border">

        <p className="text-gray-500 mb-2">
          Total Influencers
        </p>

        <h2 className="text-5xl font-bold">
          {influencers.length}
        </h2>

      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border">

        <p className="text-gray-500 mb-2">
          Contact Messages
        </p>

        <h2 className="text-5xl font-bold">
          {messages.length}
        </h2>

      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border">

        <p className="text-gray-500 mb-2">
          Total Records
        </p>

        <h2 className="text-5xl font-bold">
          {influencers.length + messages.length}
        </h2>

      </div>

    </div>

    {/* QUICK ACTIONS */}
    <div className="grid md:grid-cols-3 gap-6 mb-8">

      <a
        href="/admin/users"
        className="bg-white rounded-3xl p-8 border shadow-sm hover:shadow-lg transition"
      >
        <h2 className="text-xl font-bold mb-2">
          Manage Users
        </h2>

        <p className="text-gray-500">
          View all registered users.
        </p>
      </a>

      <a
        href="/admin/verification"
        className="bg-white rounded-3xl p-8 border shadow-sm hover:shadow-lg transition"
      >
        <h2 className="text-xl font-bold mb-2">
          Verification Requests
        </h2>

        <p className="text-gray-500">
          Approve influencer accounts.
        </p>
      </a>

      <a
        href="/admin/categories"
        className="bg-white rounded-3xl p-8 border shadow-sm hover:shadow-lg transition"
      >
        <h2 className="text-xl font-bold mb-2">
          Categories
        </h2>

        <p className="text-gray-500">
          Manage platform categories.
        </p>
      </a>

    </div>

    {/* RECENT DATA */}
    <div className="grid lg:grid-cols-2 gap-8">

      {/* Influencers */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Latest Influencers
          </h2>

          <span className="text-gray-500">
            {influencers.length}
          </span>

        </div>

        <div className="space-y-4">

          {influencers.slice(0, 5).map((item) => (

            <div
              key={item.id}
              className="flex items-center gap-4 border-b pb-4"
            >

              <img
                src={
                  item.image ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>

                <p className="font-semibold">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500">
                  {item.category}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Messages */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold">
            Recent Messages
          </h2>

          <span className="text-gray-500">
            {messages.length}
          </span>

        </div>

        <div className="space-y-4">

          {messages.slice(0, 5).map((msg) => (

            <div
              key={msg.id}
              className="border-b pb-4"
            >

              <p className="font-semibold">
                {msg.name}
              </p>

              <p className="text-sm text-gray-500 mb-1">
                {msg.email}
              </p>

              <p className="text-gray-700 line-clamp-2">
                {msg.message}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  </main>
);
}
