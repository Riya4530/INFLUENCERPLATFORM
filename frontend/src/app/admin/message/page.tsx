"use client";

import { useEffect, useState } from "react";

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`
        );
        const data = await res.json();

        setMessages(data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Contact Messages
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead>
              <tr className="border-b">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Message</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {messages.map((msg) => (
                <tr key={msg.id} className="border-b">
                  <td className="p-2">{msg.name}</td>
                  <td className="p-2">{msg.email}</td>
                  <td className="p-2">{msg.message}</td>
                  <td className="p-2">
                    {new Date(msg.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}