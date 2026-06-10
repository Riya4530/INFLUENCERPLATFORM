"use client";

import {useEffect,useState} from "react";


export default function AdminUsersPage(){

const [users,setUsers]=useState<any[]>([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{

fetchUsers();

},[]);



const fetchUsers=async()=>{

try{

const response =
await fetch(
"http://localhost:5000/api/admin/users"
);


const data =
await response.json();


setUsers(
data.users || []
);


}catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};



const changeStatus =
async(
id:string,
currentStatus:string
)=>{


const newStatus =
currentStatus==="Active"
?
"Blocked"
:
"Active";


await fetch(
`http://localhost:5000/api/admin/users/${id}`,
{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
status:newStatus
})
}
);


fetchUsers();

};



if(loading){

return(
<div className="p-10 text-3xl font-bold">
Loading users...
</div>
)

}



return(

<main className="min-h-screen bg-gray-100 p-10">


<div className="max-w-7xl mx-auto">


<h1 className="text-5xl font-bold mb-10">
Manage Users
</h1>



<div className="bg-white rounded-3xl shadow p-8">


<table className="w-full">


<thead>

<tr className="border-b">

<th className="text-left p-4">
Name
</th>

<th>
Email
</th>

<th>
Role
</th>

<th>
Status
</th>

<th>
Action
</th>


</tr>

</thead>



<tbody>


{
users.map((user)=>(


<tr
key={user.id}
className="border-b"
>


<td className="p-4 font-semibold">
{user.name}
</td>


<td>
{user.email}
</td>


<td>
{user.role}
</td>


<td>

<span
className={
user.status==="Active"
?
"text-green-600 font-bold"
:
"text-red-600 font-bold"
}
>

{user.status}

</span>


</td>


<td>


<button

onClick={()=>changeStatus(
user.id,
user.status
)}

className="bg-black text-white px-5 py-2 rounded-xl"

>


{
user.status==="Active"
?
"Block"
:
"Activate"
}


</button>


</td>


</tr>


))
}


</tbody>


</table>


</div>


</div>


</main>


)

}