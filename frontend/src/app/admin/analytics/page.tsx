"use client";

import { useEffect, useState } from "react";


export default function AnalyticsPage(){

const [data,setData] = useState<any>(null);



useEffect(()=>{

fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/analytics`)
.then(res=>res.json())
.then(result=>{

setData(result.analytics);

})
.catch(err=>console.log(err));


},[]);



if(!data){

return (

<div className="
min-h-screen
flex
items-center
justify-center
text-xl
">

Loading...

</div>

)

}




const cards=[

{
title:"Users",
value:data.users,
desc:"Registered accounts"
},

{
title:"Influencers",
value:data.influencers,
desc:"Creator profiles"
},

{
title:"Categories",
value:data.categories,
desc:"Available niches"
},

{
title:"Verified",
value:data.verified,
desc:"Approved creators"
},

{
title:"Pending",
value:data.pending,
desc:"Waiting approval"
}

];



return (

<div className="
min-h-screen
bg-gray-100
p-10
">


{/* TOP */}

<div className="
bg-white
rounded-3xl
p-8
shadow-sm
border
mb-10
">


<h1 className="
text-4xl
font-bold
">

Analytics

</h1>


<p className="
text-gray-500
mt-2
">

Platform performance overview

</p>


</div>





{/* STAT GRID */}


<div className="
grid
md:grid-cols-3
gap-6
">


{cards.map((item,index)=>(


<div

key={item.title}

className="
bg-white
rounded-3xl
p-7
shadow-sm
border
hover:shadow-xl
transition
"


>


<div className="
flex
justify-between
items-center
">


<p className="
text-gray-500
font-medium
">

{item.title}

</p>



<div className="
w-3
h-3
rounded-full
bg-black
">

</div>


</div>



<h2 className="
text-5xl
font-bold
mt-6
">

{item.value}

</h2>



<p className="
text-gray-400
mt-3
">

{item.desc}

</p>



</div>


))}


</div>





{/* LOWER SECTION */}



<div className="
mt-10
grid
md:grid-cols-2
gap-8
">



<div className="
bg-white
rounded-3xl
p-8
border
shadow-sm
">


<h2 className="
text-2xl
font-bold
mb-6
">

Creator Status

</h2>



<div className="
space-y-5
">


<div>

<div className="
flex
justify-between
mb-2
">

<span>
Verified
</span>

<span>
{data.verified}
</span>

</div>


<div className="
h-3
bg-gray-200
rounded-full
">

<div
className="
h-3
bg-black
rounded-full
"
style={{
width:
`${data.influencers ?
(data.verified/data.influencers)*100
:0}%`
}}
>

</div>


</div>

</div>



<div>

<div className="
flex
justify-between
mb-2
">

<span>
Pending
</span>

<span>
{data.pending}
</span>

</div>


<div className="
h-3
bg-gray-200
rounded-full
">

<div
className="
h-3
bg-gray-500
rounded-full
"
style={{
width:
`${data.influencers ?
(data.pending/data.influencers)*100
:0}%`
}}
>

</div>


</div>


</div>



</div>


</div>





<div className="
bg-black
text-white
rounded-3xl
p-8
shadow-xl
">


<h2 className="
text-2xl
font-bold
mb-6
">

Summary

</h2>


<p className="
text-gray-300
leading-8
">

Your platform currently has

<span className="
font-bold
text-white
">

{" "}{data.users}

</span>

users and

<span className="
font-bold
text-white
">

{" "}{data.influencers}

</span>

active influencers.


</p>


</div>




</div>




</div>

)

}
