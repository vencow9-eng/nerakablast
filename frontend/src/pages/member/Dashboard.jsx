import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Dashboard() {

const [data, setData] = useState({
totalUser: 0,
totalStaff: 0,
totalBlast: 0,
totalDevice: 0,
});

useEffect(() => {

load();

}, []);

async function load() {

try {

const res =
await api.get(
"/dashboard/admin"
);

setData(
res.data.data
);

} catch {

console.log(
"dashboard error"
);

}

}

return (

<div>

<div className="mb-10">

<h1
className="
text-5xl
font-black
mb-3
"
>

Dashboard

</h1>

<p
className="
text-slate-400
"
>

Realtime analytics
NERAKABLAST

</p>

</div>

<div
className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
"
>

<Card
title="Total User"
value={data.totalUser}
icon="👤"
/>

<Card
title="Total Staff"
value={data.totalStaff}
icon="🧑‍💼"
/>

<Card
title="Total Blast"
value={data.totalBlast}
icon="🚀"
/>

<Card
title="Total Device"
value={data.totalDevice}
icon="📱"
/>

</div>

<div
className="
mt-10
grid
md:grid-cols-2
gap-6
"
>

<div
className="
bg-slate-900
rounded-3xl
p-8
border
border-slate-800
"
>

<h2
className="
text-2xl
font-bold
mb-6
"
>

Blast Activity

</h2>

<div className="space-y-4">

<Row
title="Success"
value="98%"
/>

<Row
title="Failed"
value="2%"
/>

<Row
title="Connected"
value={`${data.totalDevice}`}
/>

</div>

</div>

<div
className="
bg-slate-900
rounded-3xl
p-8
border
border-slate-800
"
>

<h2
className="
text-2xl
font-bold
mb-6
"
>

Server Status

</h2>

<div className="space-y-4">

<Row
title="Backend"
value="ONLINE"
/>

<Row
title="Redis"
value="ONLINE"
/>

<Row
title="Queue"
value="RUNNING"
/>

</div>

</div>

</div>

</div>

)

}

function Card({
title,
value,
icon,
}) {

return (

<div
className="
bg-slate-900
rounded-3xl
p-8
border
border-slate-800
hover:border-green-500
transition
"
>

<div
className="
flex
justify-between
items-center
"
>

<div>

<p
className="
text-slate-400
"
>

{title}

</p>

<h2
className="
text-5xl
font-black
mt-4
"
>

{value}

</h2>

</div>

<div
className="
text-4xl
"
>

{icon}

</div>

</div>

</div>

)

}

function Row({
title,
value,
}) {

return (

<div
className="
flex
justify-between
bg-slate-800
p-4
rounded-xl
"
>

<span>

{title}

</span>

<span
className="
font-bold
text-green-400
"
>

{value}

</span>

</div>

)

}