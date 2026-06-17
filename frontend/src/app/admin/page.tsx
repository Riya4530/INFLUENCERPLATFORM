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

    <div className="min-h-screen flex bg-gray-100">


      {/* MAIN */}

      <main className="flex-1 p-10 overflow-y-auto">

        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-gray-500">
              Manage influencers and platform activity
            </p>

          </div>

        </div>

        {activeSection === "dashboard" && (

          <>

            <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-3xl p-10 mb-10 shadow-xl">

              <h2 className="text-4xl font-bold mb-3">
                Welcome Back Admin 👋
              </h2>

              <p className="text-gray-300 text-lg">
                Monitor creators, messages and platform growth.
              </p>

            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-10">

              <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-3xl p-8 shadow-xl">

                <h2 className="text-5xl font-bold">
                  {influencers.length}
                </h2>

                <p className="mt-3">
                  Total Influencers
                </p>

              </div>

              <div className="bg-gradient-to-r from-pink-500 to-pink-700 text-white rounded-3xl p-8 shadow-xl">

                <h2 className="text-5xl font-bold">
                  {messages.length}
                </h2>

                <p className="mt-3">
                  Contact Messages
                </p>

              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-3xl p-8 shadow-xl">

                <h2 className="text-5xl font-bold">
                  {influencers.length + messages.length}
                </h2>

                <p className="mt-3">
                  Total Records
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">
 <a
            href="/influencers"
               >
                <h2 className="text-xl font-bold mb-2">
                  View Influencers
                </h2>

                <p className="text-gray-500">
                  Manage creator profiles
                </p>
</a>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">
 <a
            href="/admin/message"
             >
                <h2 className="text-xl font-bold mb-2">
                  View Messages
                </h2>

                <p className="text-gray-500">
                  Review contact requests
                </p>
</a>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">
 <a
            href="/admin/analytics"
          >
                <h2 className="text-xl font-bold mb-2">
                  Platform Overview
                </h2>

                <p className="text-gray-500">
                  Monitor platform performance
                </p>
</a>
              </div>

            </div>

          </>

        )}

              {/* INFLUENCERS */}

        {activeSection === "influencers" && (

          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="text-4xl font-bold">
                  Influencer Profiles
                </h2>

                <p className="text-gray-500 mt-2">
                  Manage all registered creators
                </p>

              </div>

              <div className="bg-black text-white px-5 py-3 rounded-2xl">

                Total: {influencers.length}

              </div>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="py-5 text-left">
                      Image
                    </th>

                    <th className="py-5 text-left">
                      Name
                    </th>

                    <th className="py-5 text-left">
                      Category
                    </th>

                    <th className="py-5 text-left">
                      City
                    </th>

                    <th className="py-5 text-left">
                      Followers
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {influencers.map((item) => (

                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 transition-all duration-300"
                    >

                      <td className="py-5">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />

                      </td>

                      <td className="font-semibold">
                        {item.name}
                      </td>

                      <td>
                        {item.category}
                      </td>

                      <td>
                        {item.city}
                      </td>

                      <td>
                        {item.followers_count}
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        )}

        {/* MESSAGES */}

        {activeSection === "messages" && (

          <div>

            <div className="flex justify-between items-center mb-8">

              <div>

                <h2 className="text-4xl font-bold">
                  Contact Messages
                </h2>

                <p className="text-gray-500 mt-2">
                  Review messages submitted through the website
                </p>

              </div>

              <div className="bg-black text-white px-5 py-3 rounded-2xl">

                Total: {messages.length}

              </div>

            </div>

            <div className="space-y-6">

              {messages.map((msg) => (

                <div
                  key={msg.id}
                  className="bg-white rounded-3xl p-7 shadow-lg hover:shadow-xl transition"
                >

                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-5">

                    <div>

                      <h3 className="text-2xl font-bold">
                        {msg.name}
                      </h3>

                      <p className="text-gray-500">
                        {msg.email}
                      </p>

                    </div>

                    <div className="bg-gray-100 px-5 py-3 rounded-2xl font-medium">

                      {msg.subject}

                    </div>

                  </div>

                  <p className="text-gray-700 leading-relaxed text-lg">

                    {msg.message}

                  </p>

                </div>

              ))}

            </div>

          </div>

        )}

      </main>

    </div>

  );

}
