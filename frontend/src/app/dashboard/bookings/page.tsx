export default function BookingsPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Collaboration Requests
          </h1>

          <p className="text-gray-500 text-lg">
            Manage brand partnership requests.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* Request Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center justify-between">
            
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Nike Fashion Campaign
              </h2>

              <p className="text-gray-500 mb-2">
                Budget: ₹50,000
              </p>

              <p className="text-gray-500">
                Requirement: 2 Reels + 3 Stories
              </p>
            </div>

            <div className="flex items-center gap-4">
              
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                Pending
              </span>

              <button className="bg-black text-white px-5 py-3 rounded-2xl hover:opacity-90 transition">
                Accept
              </button>

              <button className="border border-black px-5 py-3 rounded-2xl hover:bg-black hover:text-white transition">
                Reject
              </button>
            </div>
          </div>

          {/* Request Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center justify-between">
            
            <div>
              <h2 className="text-2xl font-bold mb-3">
                Tech Gadget Promotion
              </h2>

              <p className="text-gray-500 mb-2">
                Budget: ₹35,000
              </p>

              <p className="text-gray-500">
                Requirement: YouTube Review Video
              </p>
            </div>

            <div className="flex items-center gap-4">
              
              <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                Accepted
              </span>

              <button className="bg-gray-300 text-gray-700 px-5 py-3 rounded-2xl cursor-not-allowed">
                Accepted
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}