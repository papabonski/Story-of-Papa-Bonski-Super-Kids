import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function text(value: unknown, max = 255) {
  const normalized = String(value ?? "").trim();
  return normalized ? normalized.slice(0, max) : null;
}

function safeReferrer(value: unknown) {
  const raw = text(value, 2000);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return null;
  }
}

function safeValue(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

export async function POST(req:Request){
  try{
    const body=await req.json();
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
    if(!url||!key) return NextResponse.json({ok:true,stored:false});

    const sb=createClient(url,key,{auth:{persistSession:false}});
    const ua=text(req.headers.get("user-agent"),500);

    await sb.from("funnel_events").insert({
      event_name:text(body.event,80)||"Unknown",
      product_sku:text(body.product,120),
      value:safeValue(body.value),
      path:text(body.path,500),
      referrer:safeReferrer(body.referrer),
      utm_source:text(body.utm?.source,120),
      utm_medium:text(body.utm?.medium,120),
      utm_campaign:text(body.utm?.campaign,200),
      utm_content:text(body.utm?.content,200),
      utm_term:text(body.utm?.term,200),
      fbclid:text(body.utm?.fbclid,500),
      user_agent:ua,
      // IP addresses are deliberately not persisted. Sales-funnel reporting
      // only needs aggregate events and campaign attribution.
      ip_hash:null,
    });

    return NextResponse.json({ok:true});
  }catch{
    return NextResponse.json({ok:false},{status:400});
  }
}
