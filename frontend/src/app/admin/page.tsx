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

      {/* SIDEBAR */}

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

            <button
              onClick={() =>
                setActiveSection("dashboard")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-medium transition-all duration-300 ${
                activeSection === "dashboard"
                  ? "bg-white text-black shadow-lg"
                  : "hover:bg-gray-800"
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() =>
                setActiveSection("influencers")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-medium transition-all duration-300 ${
                activeSection === "influencers"
                  ? "bg-white text-black shadow-lg"
                  : "hover:bg-gray-800"
              }`}
            >
              Influencers
            </button>

            <button
              onClick={() =>
                setActiveSection("messages")
              }
              className={`w-full text-left px-5 py-4 rounded-2xl font-medium transition-all duration-300 ${
                activeSection === "messages"
                  ? "bg-white text-black shadow-lg"
                  : "hover:bg-gray-800"
              }`}
            >
              Messages
            </button>

          </div>

        </div>

        <div>

          <div className="bg-gray-900 p-5 rounded-2xl mb-4">

            <h2 className="font-bold text-white">
              Administrator
            </h2>

            <p className="text-gray-400 text-sm">
              Manage Platform
            </p>

          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:scale-105 transition"
          >
            Logout
          </button>

        </div>

      </aside>

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

          <input
            type="text"
            placeholder="Search..."
            className="bg-white border border-gray-200 px-5 py-3 rounded-2xl w-80 shadow-sm"
          />

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

                <h2 className="text-xl font-bold mb-2">
                  View Influencers
                </h2>

                <p className="text-gray-500">
                  Manage creator profiles
                </p>

              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">

                <h2 className="text-xl font-bold mb-2">
                  View Messages
                </h2>

                <p className="text-gray-500">
                  Review contact requests
                </p>

              </div>

              <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition">

                <h2 className="text-xl font-bold mb-2">
                  Platform Overview
                </h2>

                <p className="text-gray-500">
                  Monitor platform performance
                </p>

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
                        {item.followers}
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
