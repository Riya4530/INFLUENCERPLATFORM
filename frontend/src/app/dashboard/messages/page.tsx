export default function MessagesPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      
      <div className="max-w-7xl mx-auto bg-white rounded-3xl overflow-hidden shadow-sm flex h-[85vh]">
        
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-200 p-6">
          
          <h1 className="text-3xl font-bold mb-8">
            Messages
          </h1>

          <div className="space-y-4">
            
            <div className="p-4 rounded-2xl bg-gray-100 cursor-pointer hover:bg-gray-200 transition">
              <h2 className="font-semibold text-lg">
                Nike Brand
              </h2>

              <p className="text-gray-500 text-sm">
                Let’s discuss the campaign...
              </p>
            </div>

            <div className="p-4 rounded-2xl hover:bg-gray-100 cursor-pointer transition">
              <h2 className="font-semibold text-lg">
                FoodieHub
              </h2>

              <p className="text-gray-500 text-sm">
                We loved your content!
              </p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold">
              Nike Brand
            </h2>

            <p className="text-gray-500">
              Active now
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            <div className="flex justify-start">
              <div className="bg-gray-200 px-5 py-4 rounded-2xl max-w-md">
                Hi! We’d like to collaborate with you for our summer campaign.
              </div>
            </div>

            <div className="flex justify-end">
              <div className="bg-black text-white px-5 py-4 rounded-2xl max-w-md">
                Sounds great! Please share more details.
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-gray-200 px-5 py-4 rounded-2xl max-w-md">
                We need 2 Instagram reels and 3 stories.
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-6 border-t border-gray-200 flex gap-4">
            
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />

            <button className="bg-black text-white px-8 rounded-2xl hover:opacity-90 transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}