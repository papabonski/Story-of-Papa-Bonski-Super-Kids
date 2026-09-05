"use client";

function readStoredAttribution(){
  try{return JSON.parse(localStorage.getItem("pb_attribution")||"{}");}catch{return {};}
}

function currentAttribution(){
  const q=new URLSearchParams(location.search);
  const stored=readStoredAttribution();
  return {
    source:q.get("utm_source")||stored.source||stored.utm_source||undefined,
    medium:q.get("utm_medium")||stored.medium||stored.utm_medium||undefined,
    campaign:q.get("utm_campaign")||stored.campaign||stored.utm_campaign||undefined,
    content:q.get("utm_content")||stored.content||stored.utm_content||undefined,
    term:q.get("utm_term")||stored.term||stored.utm_term||undefined,
    fbclid:q.get("fbclid")||stored.fbclid||undefined,
  };
}

function checkoutHref(utm:ReturnType<typeof currentAttribution>){
  const u=new URL("/super-kids/checkout",window.location.origin);
  const mapping:[string,unknown][]=[
    ["utm_source",utm.source],
    ["utm_medium",utm.medium],
    ["utm_campaign",utm.campaign],
    ["utm_content",utm.content],
    ["utm_term",utm.term],
    ["fbclid",utm.fbclid],
  ];
  for(const [key,value] of mapping) if(value) u.searchParams.set(key,String(value));
  return u.pathname+u.search;
}

function emitMetaCheckout(attempt=0){
  const w=window as any;
  if(w.fbq){
    w.fbq("track","InitiateCheckout",{
      content_ids:["PBSK-SUPER-KIDS"],
      content_name:"PBSK-SUPER-KIDS",
      content_type:"product",
      value:50000,
      currency:"IDR",
    });
    return;
  }
  if(attempt<6) window.setTimeout(()=>emitMetaCheckout(attempt+1),150);
}

export default function CheckoutButton({label="Mulai Papa Bonski Super Kids",className=""}:{label?:string;className?:string}){
  return <a href="/super-kids/checkout" onClick={(e)=>{
    e.preventDefault();
    const utm=currentAttribution();
    const href=checkoutHref(utm);
    try{if(Object.values(utm).some(Boolean)) localStorage.setItem("pb_attribution",JSON.stringify(utm));}catch{}
    fetch("/api/funnel/track",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({event:"InitiateCheckout",product:"PBSK-SUPER-KIDS",value:50000,path:location.pathname,utm}),
      keepalive:true,
    }).catch(()=>{});
    emitMetaCheckout();
    window.location.assign(href);
  }} className={className}>{label}</a>;
}
