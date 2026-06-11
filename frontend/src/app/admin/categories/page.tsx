"use client";

import { useEffect, useState } from "react";

export default function CategoriesPage(){

const [categories,setCategories] = useState<any[]>([]);
const [name,setName] = useState("");
const [loading,setLoading] = useState(false);



useEffect(()=>{
  fetchCategories();
},[]);



const fetchCategories = async()=>{

try{

const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`);

const data = await res.json();

setCategories(
data.categories || []
);


}catch(error){

console.log(error);

}

};




const addCategory = async()=>{

if(!name.trim()) return;


try{

setLoading(true);

await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories`,
{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
name
})
}
);


setName("");

fetchCategories();


}catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};




const deleteCategory = async(id:number)=>{

try{

await fetch(
`${process.env.NEXT_PUBLIC_API_URL}/api/admin/categories/${id}`,
{
method:"DELETE"
}
);


fetchCategories();


}catch(error){

console.log(error);

}

};




return (

<div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-10">


{/* HEADER */}

<div className="mb-10">


<h1 className="text-5xl font-extrabold text-gray-900">
Category Management
</h1>


<p className="text-gray-500 mt-2 text-lg">
Manage influencer categories from here
</p>


</div>





{/* ADD CARD */}

<div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border">


<h2 className="text-2xl font-bold mb-5">
Add New Category
</h2>



<div className="flex gap-4">


<input

className="
flex-1
border
border-gray-300
rounded-2xl
px-5
py-4
outline-none
focus:ring-2
focus:ring-black
"

placeholder="Enter category name"

value={name}

onChange={(e)=>
setName(e.target.value)
}

/>



<button

onClick={addCategory}

className="
bg-black
text-white
px-8
rounded-2xl
font-semibold
hover:scale-105
transition
"

>

{loading ? "Adding..." : "Add Category"}

</button>



</div>


</div>






{/* CATEGORY LIST */}


<div className="grid md:grid-cols-3 gap-6">



{categories.map((cat)=>(


<div

key={cat.id}

className="
bg-white
rounded-3xl
shadow-lg
p-6
border
hover:-translate-y-2
transition
"

>


<div className="flex justify-between items-center">


<div>


<p className="text-sm text-gray-400">
Category
</p>


<h3 className="text-2xl font-bold">
{cat.name}
</h3>


</div>




<button

onClick={()=>deleteCategory(cat.id)}

className="
bg-red-100
text-red-600
px-4
py-2
rounded-xl
hover:bg-red-600
hover:text-white
transition
"

>

Delete

</button>



</div>


</div>


))}



</div>





</div>

);


}