import { NextResponse } from "next/server";
import { verifyLicense } from "@/lib/licensing/verify";
export const dynamic = "force-dynamic";
export async function GET() {
  const status = verifyLicense();
  return NextResponse.json({ ...status, token: undefined, publicKey: undefined }, { status: status.valid ? 200 : 403 });
}
