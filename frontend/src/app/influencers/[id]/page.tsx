"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function InfluencerProfilePage() {

  const params = useParams();

  const id =
    Array.isArray(params?.id)
      ? params.id[0]
      : params?.id;

  const [influencer, setInfluencer] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  useEffect(() => {

    if (!id) return;

    const fetchInfluencer =
      async () => {

        try {

          setLoading(true);

          const response =
            await fetch(
              `http://localhost:5000/api/influencers/${id}`
            );

          const data =
            await response.json();

          if (
            data.success &&
            data.influencer
          ) {

            setInfluencer(
              data.influencer
            );

          } else {

            setInfluencer(null);

          }

        } catch (error) {

          console.log(error);

          setInfluencer(null);

        } finally {

          setLoading(false);

        }

      };

    fetchInfluencer();

  }, [id]);

  const handleSendRequest =
    async () => {

      try {

        setSending(true);

        const user =
          JSON.parse(
            localStorage.getItem("user") || "{}"
          );

        const response =
          await fetch(
            "http://localhost:5000/api/send-request",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                brand_email:
                  user.email,

                influencer_id:
                  influencer.id,

                message,
              }),
            }
          );

        const data =
          await response.json();

        if (data.success) {

          alert(
            "Request sent successfully"
          );

          setMessage("");

        } else {

          alert(
            "Failed to send request"
          );

        }

      } catch (error) {

        console.log(error);

        alert(
          "Something went wrong"
        );

      } finally {

        setSending(false);

      }

    };

  if (loading) {

    return (

      <main className="min-h-screen flex items-center justify-center">

        <h1 className="text-4xl font-bold">
          Loading...
        </h1>

      </main>

    );

  }

  if (!influencer) {

    return (

      <main className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold text-red-500">
          Influencer not found
        </h1>

      </main>

    );

  }

  return (

    <main className="min-h-screen bg-gray-100 py-10 px-6">

      <div className="max-w-5xl mx-auto">

        <div className="bg-white rounded-3xl overflow-hidden shadow-xl">

          <div className="relative w-full h-[500px]">

            <Image
              src={influencer.image}
              alt={influencer.name}
              fill
              className="object-cover"
            />

          </div>

          <div className="p-10">

            <h1 className="text-5xl font-bold mb-4">
              {influencer.name}
            </h1>

            <p className="text-2xl text-gray-500 mb-4">
              {influencer.category}
            </p>

            <p className="text-xl font-semibold mb-6">
              {influencer.followers}
              {" "}
              Followers
            </p>

            <p className="text-lg text-gray-700 leading-8 mb-8">
              {influencer.bio}
            </p>

            <div className="flex gap-4 flex-wrap">

              {influencer.instagram && (

                <a
                  href={`https://instagram.com/${influencer.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-black text-white px-8 py-4 rounded-2xl font-semibold"
                >
                  View Instagram
                </a>

              )}

              {influencer.user_email && (

                <a
                  href={`mailto:${influencer.user_email}`}
                  className="inline-block bg-pink-600 text-white px-8 py-4 rounded-2xl font-semibold"
                >
                  Hire Influencer
                </a>

              )}

            </div>

          </div>

        </div>

        {/* COLLABORATION REQUEST */}

        <div className="bg-white rounded-3xl p-8 shadow-xl mt-8">

          <h2 className="text-3xl font-bold mb-5">
            Send Collaboration Request
          </h2>

          <textarea
            rows={5}
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            placeholder="Write your collaboration proposal..."
            className="w-full border rounded-2xl p-4"
          />

          <button
            onClick={handleSendRequest}
            disabled={sending}
            className="mt-5 bg-black text-white px-8 py-4 rounded-2xl font-semibold"
          >
            {sending
              ? "Sending..."
              : "Send Request"}
          </button>

        </div>

      </div>

    </main>

  );

}