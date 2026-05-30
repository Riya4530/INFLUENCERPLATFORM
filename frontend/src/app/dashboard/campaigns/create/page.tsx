export default function CreateCampaignPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-10">
      
      <div className="max-w-5xl mx-auto bg-white p-10 rounded-3xl shadow-sm">
        
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Create Campaign
          </h1>

          <p className="text-gray-500 text-lg">
            Launch a new influencer marketing campaign.
          </p>
        </div>

        <form className="space-y-8">
          
          <div>
            <label className="block mb-3 font-semibold">
              Campaign Title
            </label>

            <input
              type="text"
              placeholder="Nike Summer Collection Promotion"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold">
              Brand Name
            </label>

            <input
              type="text"
              placeholder="Enter brand/company name"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold">
              Budget
            </label>

            <input
              type="text"
              placeholder="₹50,000"
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block mb-3 font-semibold">
              Influencer Category
            </label>

            <select className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black">
              <option>Fashion</option>
              <option>Food</option>
              <option>Tech</option>
              <option>Lifestyle</option>
            </select>
          </div>

          <div>
            <label className="block mb-3 font-semibold">
              Campaign Description
            </label>

            <textarea
              rows={6}
              placeholder="Describe your campaign requirements..."
              className="w-full border border-gray-300 rounded-2xl px-5 py-4 outline-none focus:border-black"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-black text-white px-8 py-4 rounded-2xl hover:opacity-90 transition"
          >
            Publish Campaign
          </button>
        </form>
      </div>
    </main>
  );
}