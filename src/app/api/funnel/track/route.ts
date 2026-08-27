import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req:Request){
  try{
    const body=await req.json();
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!url||!key) return NextResponse.json({ok:true,stored:false});
    const sb=createClient(url,key,{auth:{persistSession:false}});
    const ua=req.headers.get("user-agent")||undefined;
    const ip=(req.headers.get("x-forwarded-for")||"").split(",")[0]?.trim()||undefined;
    await sb.from("funnel_events").insert({event_name:String(body.event||"Unknown"),product_sku:body.product||null,value:body.value||null,path:body.path||null,referrer:body.referrer||null,utm_source:body.utm?.source||null,utm_medium:body.utm?.medium||null,utm_campaign:body.utm?.campaign||null,utm_content:body.utm?.content||null,utm_term:body.utm?.term||null,fbclid:body.utm?.fbclid||null,user_agent:ua,ip_hash:ip?Buffer.from(ip).toString("base64").slice(0,64):null});
    return NextResponse.json({ok:true});
  }catch{return NextResponse.json({ok:false},{status:400});}
}
