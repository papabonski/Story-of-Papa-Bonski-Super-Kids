import { NextResponse } from "next/server";
import { claimCustomerByVerifiedEmail } from "@/lib/customer-access";

export async function POST() {
  const result = await claimCustomerByVerifiedEmail();
  return NextResponse.json(result, { status: result.ok ? 200 : result.reason === "not_authenticated" ? 401 : 404 });
}
