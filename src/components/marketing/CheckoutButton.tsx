"use client";
import { useMemo } from "react";

export default function CheckoutButton({label="Mulai Papa Bonski Super Kids",className=""}:{label?:string;className?:string}){
  const href=useMemo(()=>{
    const base=process.env.NEXT_PUBLIC_SUPER_KIDS_CHECKOUT_URL || "https://papabonski.orderhero.id/form/papa-bonski-super-kids";
    if(typeof window==="undefined"||base.startsWith("/")) return base;
    try{
      const u=new URL(base);
      const current=new URLSearchParams(location.search);
      let stored:any={}; try{stored=JSON.parse(localStorage.getItem("pb_attribution")||"{}");}catch{}
      for(const k of ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid"]){
        const short=k.replace("utm_",""); const v=current.get(k)||stored[short]||stored[k]; if(v)u.searchParams.set(k,v);
      }
      return u.toString();
    }catch{return base;}
  },[]);
  return <a href={href} onClick={()=>{fetch("/api/funnel/track",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({event:"InitiateCheckout",product:"PBSK-SUPER-KIDS",path:location.pathname})}).catch(()=>{}); const w=window as any;if(w.fbq)w.fbq("track","InitiateCheckout");}} className={className}>{label}</a>;
}
