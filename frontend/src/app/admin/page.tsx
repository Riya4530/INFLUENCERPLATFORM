"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {

  const [influencers, setInfluencers] =
    useState<any[]>([]);

  const [messages, setMessages] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

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

    /* PROTECT ADMIN PAGE */

    if (
      parsedUser.role !== "admin"
    ) {

      alert(
        "Access denied"
      );

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
            "http://localhost:5000/api/influencers"
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
            "http://localhost:5000/api/contact-messages"
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

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-semibold">
        Loading...
      </div>
    );

  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <h1 className="text-5xl font-bold mb-3">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 text-lg">
            Manage influencers, users and contact messages.
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-black text-white rounded-3xl p-8 shadow-lg">

            <h2 className="text-5xl font-bold mb-2">
              {influencers.length}
            </h2>

            <p className="text-gray-300 text-lg">
              Total Influencers
            </p>

          </div>

          <div className="bg-pink-600 text-white rounded-3xl p-8 shadow-lg">

            <h2 className="text-5xl font-bold mb-2">
              {messages.length}
            </h2>

            <p className="text-pink-100 text-lg">
              Contact Messages
            </p>

          </div>

          <div className="bg-blue-600 text-white rounded-3xl p-8 shadow-lg">

            <h2 className="text-5xl font-bold mb-2">
              24
            </h2>

            <p className="text-blue-100 text-lg">
              Active Users
            </p>

          </div>

        </div>

        {/* INFLUENCERS TABLE */}

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 overflow-x-auto">

          <h2 className="text-3xl font-bold mb-8">
            Influencer Profiles
          </h2>

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="text-left py-4">
                  Image
                </th>

                <th className="text-left py-4">
                  Name
                </th>

                <th className="text-left py-4">
                  Category
                </th>

                <th className="text-left py-4">
                  City
                </th>

                <th className="text-left py-4">
                  Followers
                </th>

              </tr>

            </thead>

            <tbody>

              {influencers.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="py-5">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />

                  </td>

                  <td className="py-5 font-semibold">
                    {item.name}
                  </td>

                  <td className="py-5">
                    {item.category}
                  </td>

                  <td className="py-5">
                    {item.city}
                  </td>

                  <td className="py-5">
                    {item.followers}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* CONTACT MESSAGES */}

        <div className="bg-white rounded-3xl shadow-xl p-8">

          <h2 className="text-3xl font-bold mb-8">
            Contact Messages
          </h2>

          <div className="space-y-6">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className="border rounded-2xl p-6"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

                  <div>

                    <h3 className="text-2xl font-bold">
                      {msg.name}
                    </h3>

                    <p className="text-gray-500">
                      {msg.email}
                    </p>

                  </div>

                  <div className="bg-gray-100 px-4 py-2 rounded-xl font-medium">

                    {msg.subject}

                  </div>

                </div>

                <p className="text-gray-700 text-lg leading-relaxed">
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