"use client";
import { useEffect } from "react";

type Props={event:string; product?:string; value?:number};
export default function FunnelTracker({event,product,value}:Props){
  useEffect(()=>{
    const q=new URLSearchParams(location.search);
    const payload={event,product,value,path:location.pathname,referrer:document.referrer||undefined,utm:{source:q.get("utm_source")||undefined,medium:q.get("utm_medium")||undefined,campaign:q.get("utm_campaign")||undefined,content:q.get("utm_content")||undefined,term:q.get("utm_term")||undefined,fbclid:q.get("fbclid")||undefined}};
    try{localStorage.setItem("pb_attribution",JSON.stringify(payload.utm));}catch{}
    fetch("/api/funnel/track",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});
    const w=window as any;
    if(w.fbq){w.fbq("trackCustom",event,{content_name:product,value,currency:"IDR"});}
  },[event,product,value]);
  return null;
}
