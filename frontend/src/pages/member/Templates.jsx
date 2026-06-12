import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Templates() {

const [title,setTitle]=useState("");
const [message,setMessage]=useState("");

const [templates,setTemplates]=useState([]);

async function load(){
try{
const r=await api.get("/templates");
setTemplates(r.data.data||[]);
}catch{}
}

useEffect(()=>{
load();
},[]);

async function save(){

if(!title||!message){
return alert("Lengkapi data");
}

await api.post("/templates",{
title,
message,
});

setTitle("");
setMessage("");

load();

}

async function remove(id){

if(!confirm("Hapus template?"))
return;

await api.delete(`/templates/${id}`);

load();

}

return(

<div className="space-y-5 pb-32">

<div>

<h1 className="text-3xl font-black">
Templates
</h1>

<p className="text-slate-400">
Kelola pesan blast
</p>

</div>

<div className="bg-slate-900 rounded-3xl p-5 space-y-4">

<input
placeholder="Nama Template"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="
w-full
bg-slate-800
rounded-2xl
p-4
outline-none
"
/>

<textarea
rows={7}
value={message}
onChange={(e)=>setMessage(e.target.value)}
placeholder={`Halo {nama}

Promo hari ini

Hubungi:
{nomor}`}
className="
w-full
bg-slate-800
rounded-2xl
p-4
outline-none
"
/>

<div
className="
bg-[#0B141A]
rounded-3xl
p-5
"
>

<div
className="
bg-[#202C33]
rounded-2xl
p-4
max-w-[85%]
"
>

<p className="text-sm text-slate-200 whitespace-pre-wrap">

{
message||

"Preview pesan tampil disini"

}

</p>

<div
className="
text-green-400
text-right
text-xs
mt-2
"
>

✓✓

</div>

</div>

</div>

<div className="flex gap-3">

<button
onClick={save}
className="
flex-1
bg-green-500
rounded-2xl
p-4
font-black
"
>

Simpan

</button>

<button
onClick={()=>
navigator.clipboard.writeText(message)
}
className="
bg-slate-700
px-5
rounded-2xl
"
>

Copy

</button>

</div>

</div>

<div className="space-y-4">

{

templates.map((t)=>(

<div
key={t.id}
className="
bg-slate-900
rounded-3xl
p-5
"
>

<div
className="
flex
justify-between
items-center
mb-4
"
>

<div>

<h2 className="font-black">

{t.title}

</h2>

<div
className="
text-green-400
text-sm
"
>

Aktif

</div>

</div>

<button
onClick={()=>remove(t.id)}
className="
bg-red-500
rounded-xl
px-4
py-2
"
>

Hapus

</button>

</div>

<div
className="
bg-[#202C33]
rounded-2xl
p-4
"
>

<pre
className="
whitespace-pre-wrap
font-sans
"
>

{t.message}

</pre>

</div>

</div>

))

}

</div>

</div>

);

}
