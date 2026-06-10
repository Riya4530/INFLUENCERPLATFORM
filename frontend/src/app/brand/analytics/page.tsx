"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {

  const [campaigns,setCampaigns] = useState<any[]>([]);
  const [collaborations,setCollaborations] = useState<any[]>([]);
  const [requests,setRequests] = useState<any[]>([]);


  useEffect(()=>{
    loadAnalytics();
  },[]);


  const loadAnalytics = async()=>{

    try{

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );


      const campaignRes =
        await fetch(
          `http://localhost:5000/api/campaigns/${user.id}`
        );

      const campaignData =
        await campaignRes.json();


      setCampaigns(
        campaignData.campaigns || []
      );



      const collaborationRes =
        await fetch(
          `http://localhost:5000/api/collaborations/${user.id}`
        );

      const collaborationData =
        await collaborationRes.json();


      setCollaborations(
        collaborationData.collaborations || []
      );



      const requestRes =
        await fetch(
          `http://localhost:5000/api/brand-requests/${user.id}`
        );


      const requestData =
        await requestRes.json();


      setRequests(
        requestData.requests || []
      );


    }catch(error){

      console.log(error);

    }

  };



  const totalBudget =
    campaigns.reduce(
      (sum,c)=>
      sum + Number(c.budget || 0),
      0
    );


  const accepted =
    requests.filter(
      r=>r.status==="Accepted"
    ).length;


  const pending =
    requests.filter(
      r=>r.status==="Pending"
    ).length;


  const rejected =
    requests.filter(
      r=>r.status==="Rejected"
    ).length;



  return (

<main className="min-h-screen bg-gray-100 p-10">


<div className="max-w-7xl mx-auto">



{/* HEADER */}

<div className="bg-black text-white rounded-3xl p-10 mb-10">

<h1 className="text-5xl font-bold">
Brand Analytics 📊
</h1>

<p className="text-gray-300 mt-3 text-lg">
Track your influencer marketing performance.
</p>

</div>





{/* STATS */}


<div className="grid md:grid-cols-4 gap-6 mb-10">



<div className="bg-white rounded-3xl p-8 shadow-sm">

<p className="text-gray-500">
Campaigns
</p>

<h2 className="text-4xl font-bold mt-3">
{campaigns.length}
</h2>

</div>



<div className="bg-white rounded-3xl p-8 shadow-sm">

<p className="text-gray-500">
Investment
</p>

<h2 className="text-4xl font-bold mt-3">
₹{totalBudget.toLocaleString()}
</h2>

</div>




<div className="bg-white rounded-3xl p-8 shadow-sm">

<p className="text-gray-500">
Collaborations
</p>

<h2 className="text-4xl font-bold mt-3">
{collaborations.length}
</h2>

</div>




<div className="bg-white rounded-3xl p-8 shadow-sm">

<p className="text-gray-500">
Influencers
</p>

<h2 className="text-4xl font-bold mt-3">
{accepted}
</h2>

</div>


</div>














{/* CAMPAIGNS */}


<div className="bg-white rounded-3xl p-8 mb-10">


<h2 className="text-3xl font-bold mb-6">
Campaign Performance 🚀
</h2>



<div className="grid md:grid-cols-2 gap-5">


{
campaigns.map(
campaign=>(


<div
key={campaign.id}
className="border rounded-2xl p-6 hover:shadow-lg transition"
>


<h3 className="text-2xl font-bold">
{campaign.title}
</h3>


<p className="text-gray-500 mt-2">
{campaign.category}
</p>


<p className="mt-4 font-semibold">
Budget:
₹{campaign.budget}
</p>


</div>


)
)
}


</div>

</div>







{/* FUNNEL */}



<div className="bg-white rounded-3xl p-8 mb-10">


<h2 className="text-3xl font-bold mb-6">
Collaboration Funnel 🤝
</h2>


<div className="grid md:grid-cols-3 gap-6">



<div className="bg-yellow-50 p-8 rounded-2xl">

<h3 className="text-4xl font-bold">
{pending}
</h3>

<p>
Pending
</p>

</div>



<div className="bg-green-50 p-8 rounded-2xl">

<h3 className="text-4xl font-bold">
{accepted}
</h3>

<p>
Accepted
</p>

</div>



<div className="bg-red-50 p-8 rounded-2xl">

<h3 className="text-4xl font-bold">
{rejected}
</h3>

<p>
Rejected
</p>

</div>



</div>


</div>








{/* INFLUENCERS */}



<div className="bg-white rounded-3xl p-8">


<h2 className="text-3xl font-bold mb-6">
Top Collaborators ⭐
</h2>



{
collaborations.map(
item=>(


<div
key={item.id}
className="flex justify-between border-b py-5"
>


<div>

<h3 className="font-bold text-xl">
{item.influencer_name}
</h3>

<p className="text-gray-500">
Successful collaboration
</p>

</div>



<p className="font-bold text-green-600">
₹{item.quotation_amount}
</p>



</div>


)
)
}



</div>




</div>


</main>


  );
}