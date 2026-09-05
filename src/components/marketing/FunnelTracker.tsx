"use client";
import { useEffect } from "react";

type Props={event:string; product?:string; value?:number};

const META_STANDARD_EVENTS = new Set([
  "ViewContent",
  "InitiateCheckout",
  "Purchase",
  "Lead",
  "CompleteRegistration",
  "AddToCart",
]);

function readStoredAttribution(){
  try{return JSON.parse(localStorage.getItem("pb_attribution")||"{}");}catch{return {};}
}

function emitMeta(event:string, product?:string, value?:number, attempt=0){
  const w=window as any;
  if(w.fbq){
    const params:any={currency:"IDR"};
    if(product){params.content_ids=[product];params.content_name=product;params.content_type="product";}
    if(typeof value==="number") params.value=value;
    if(META_STANDARD_EVENTS.has(event)) w.fbq("track",event,params);
    else w.fbq("trackCustom",event,params);
    return;
  }
  if(attempt<8) window.setTimeout(()=>emitMeta(event,product,value,attempt+1),250);
}

export default function FunnelTracker({event,product,value}:Props){
  useEffect(()=>{
    const q=new URLSearchParams(location.search);
    const stored=readStoredAttribution();
    const utm={
      source:q.get("utm_source")||stored.source||stored.utm_source||undefined,
      medium:q.get("utm_medium")||stored.medium||stored.utm_medium||undefined,
      campaign:q.get("utm_campaign")||stored.campaign||stored.utm_campaign||undefined,
      content:q.get("utm_content")||stored.content||stored.utm_content||undefined,
      term:q.get("utm_term")||stored.term||stored.utm_term||undefined,
      fbclid:q.get("fbclid")||stored.fbclid||undefined,
    };
    const payload={event,product,value,path:location.pathname,referrer:document.referrer||undefined,utm};
    try{
      if(Object.values(utm).some(Boolean)) localStorage.setItem("pb_attribution",JSON.stringify(utm));
    }catch{}
    fetch("/api/funnel/track",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
    emitMeta(event,product,value);
  },[event,product,value]);
  return null;
}
