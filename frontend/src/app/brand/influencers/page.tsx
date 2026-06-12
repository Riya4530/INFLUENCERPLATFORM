"use client";

import { useEffect, useState } from "react";
import InfluencerCard from "@/modules/home/components/InfluencerCard";

export default function BrandInfluencersPage() {

  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [followersFilter, setFollowersFilter] =
    useState("All");
  const [cityFilter, setCityFilter] =
    useState("All");

  const [savedSearches, setSavedSearches] =
    useState<any[]>([]);
  const [recommended, setRecommended] =
  useState<any[]>([]);

  const [selectedInfluencer, setSelectedInfluencer] =
    useState<any>(null);

  const [campaignId, setCampaignId] =
    useState("");
  const [campaigns, setCampaigns] =
  useState<any[]>([]);


  useEffect(() => {

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/influencers`
    )
      .then((res) => res.json())
      .then((data) => {

        const list =
          data.influencers || [];

        setInfluencers(list);

      })
      .catch((error) => {

        console.log(error);

        setInfluencers([]);

      });

  }, []);


  useEffect(() => {

    const fetchInfluencers = async () => {

      try {

        setLoading(true);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/influencers`
        );

        const data = await res.json();

        const list =
  data.influencers || data || [];

setInfluencers(list);

const recommendedList =
  [...list]
    .sort(
      (a, b) =>
        Number(b.followers || 0) -
        Number(a.followers || 0)
    )
    .slice(0, 3);

setRecommended(
  recommendedList
);


      } catch (error) {

        console.log(
          "Error fetching influencers:",
          error
        );

        setInfluencers([]);

      } finally {

        setLoading(false);

      }

    };

    fetchInfluencers();

    const searches = JSON.parse(
      localStorage.getItem(
        "savedSearches"
      ) || "[]"
    );

    setSavedSearches(searches);
 
    const fetchCampaigns = async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/campaigns/${user.id}`
    );

    const data =
      await response.json();

    setCampaigns(
      data.campaigns || []
    );

  } catch (error) {

    console.log(
      "Campaign fetch error:",
      error
    );

  }

};

fetchCampaigns();

  }, []);

 const filteredInfluencers =
  influencers.filter(
    (influencer: any) => {

      const text =
        search.toLowerCase();

     const words =
  text
    .split(" ")
    .filter(
      (word) =>
        ![
          "in",
          "influencer",
          "influencers",
          "creator",
          "creators",
          "for",
          "the",
        ].includes(word)
    );

      return words.every(
        (word) =>

          influencer.name
            ?.toLowerCase()
            .includes(word)

          ||

          influencer.city
            ?.toLowerCase()
            .includes(word)

          ||

          influencer.category
            ?.toLowerCase()
            .includes(word)

          ||

          influencer.bio
            ?.toLowerCase()
            .includes(word)
      );

    }
  );
  const suggestions = [
  ...new Set([
    ...influencers.map(
      (i) =>
        `${i.category} Influencers in ${i.city}`
    ),
    ...influencers.map(
      (i) => i.city
    ),
    ...influencers.map(
      (i) => i.category
    ),
  ]),
]
.filter((item) =>
  item
    .toLowerCase()
    .includes(search.toLowerCase())
)
.slice(0, 5);

  if (loading) {

    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Loading influencers...
        </h1>
      </main>
    );

  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20">

      <h1 className="text-5xl font-bold mb-10">
        Brand Influencer Discovery
      </h1>
     
       <div className="relative">

  <input
    type="text"
    placeholder="Search by name, city, category or bio..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
    className="w-full border border-gray-300 rounded-2xl px-6 py-4 outline-none focus:border-black"
  />

  {search && suggestions.length > 0 && (

    <div className="absolute w-full bg-white border rounded-2xl shadow-lg mt-2 z-50">

      {suggestions.map(
        (item, index) => (

          <button
            key={index}
            onClick={() =>
              setSearch(item)
            }
            className="w-full text-left px-4 py-3 hover:bg-gray-100"
          >
            {item}
          </button>

        )
      )}

    </div>

  )}

</div>

      <p className="text-gray-500 mb-8">
        {filteredInfluencers.length} influencers found
      </p>

     

        {/* INFLUENCERS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

       

        {filteredInfluencers.map(
          (inf: any) => (

            <div
              key={inf.id}
              className="space-y-3"
            >

              <InfluencerCard
                id={inf.id}
                name={inf.name}
                category={inf.category}
                followers={inf.followers}
                city={inf.city}
                instagram={inf.instagram}
                image={inf.image}
                verification_status={
  inf.verification_status
}
              />

              <div className="flex gap-2">

                <button
                  className="flex-1 bg-black text-white py-2 rounded-xl"
                  onClick={() =>
                    setSelectedInfluencer(
                      inf
                    )
                  }
                >
                  Invite
                </button>

                <button className="flex-1 border border-black py-2 rounded-xl">
                  Shortlist
                </button>

              </div>

            </div>

          )
        )}

      {filteredInfluencers.length === 0 && (

        <div className="text-center py-20">

          <h2 className="text-3xl font-bold mb-3">
            No Influencers Found
          </h2>

          <p className="text-gray-500">
            Try searching with a different keyword.
          </p>

        </div>

      )}

      </div>

      {/* INVITE MODAL */}

      {selectedInfluencer && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">

          <div className="bg-white p-6 rounded-2xl w-[400px]">

            <h2 className="text-xl font-bold mb-4">
              Invite {selectedInfluencer.name}
            </h2>

           <p className="mb-4 text-gray-600">
  Select Campaign
</p>

<select
  value={campaignId}
  onChange={(e) =>
    setCampaignId(
      e.target.value
    )
  }
  className="border p-2 w-full mb-4 rounded-lg"
>

  <option value="">
    Select Campaign
  </option>

  {campaigns.map(
    (campaign: any) => (

      <option
        key={campaign.id}
        value={campaign.id}
      >
        {campaign.title}
      </option>

    )
  )}

</select>

            <div className="flex gap-2">

              <button
                className="bg-black text-white flex-1 py-2 rounded-xl"
                onClick={async () => {

  try {

    const user = JSON.parse(
      localStorage.getItem("user") || "{}"
    );

    console.log("USER =", user);
console.log("BRAND ID =", user?.id);
console.log("INFLUENCER ID =", selectedInfluencer?.id);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invitations`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },                
        body: JSON.stringify({
          brand_id: user.id,
          influencer_id:
            selectedInfluencer.id,
          campaign_id:
            campaignId,
        }),
      }
    );

  const data =
  await response.json();

if (data.success) {

  const existingRequests = JSON.parse(
    localStorage.getItem("brandRequests") || "[]"
  );

  existingRequests.push({
    influencerName:
      selectedInfluencer.name,
    campaignId:
      campaignId,
    status: "Pending",
    quoteAmount: null,
  });

  localStorage.setItem(
    "brandRequests",
    JSON.stringify(
      existingRequests
    )
  );
}

alert(data.message);

setSelectedInfluencer(null);
setCampaignId("");


  } catch (error) {

    console.log(error);

    alert(
      "Failed to send invitation"
    );

  }

}}
              >
                Send Invite
              </button>

              <button
                className="border flex-1 py-2 rounded-xl"
                onClick={() =>
                  setSelectedInfluencer(
                    null
                  )
                }
              >
                Cancel
              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}