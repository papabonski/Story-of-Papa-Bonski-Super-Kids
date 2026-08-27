const target=process.env.ORDERHERO_TEST_WEBHOOK_URL || "http://localhost:3000/api/orderhero/webhook";
const token=process.env.ORDERHERO_WEBHOOK_TOKEN;
const url=new URL(target); if(token&&!url.searchParams.has("token")) url.searchParams.set("token",token);
const payload={
  event:"payment.success",
  event_id:`TEST-${Date.now()}`,
  data:{order:{order_id:`PBSK-TEST-${Date.now()}`,payment_status:"paid",grand_total:149000,currency:"IDR",customer:{name:"Customer Test V5.4",email:`v54-${Date.now()}@example.com`,phone:"081234567890"},product:{sku:"PBSK-SUPER-KIDS",name:"Papa Bonski Super Kids"},metadata:{utm_source:"meta",utm_medium:"paid",utm_campaign:"v54_test"}}}
};
const res=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
console.log("POST",url.origin+url.pathname,"=>",res.status); console.log(await res.text());
if(!res.ok) process.exitCode=1;
