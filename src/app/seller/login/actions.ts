"use server";

import { redirect } from "next/navigation";
import { clearSellerSession } from "@/lib/seller-auth";

export async function sellerLogout() {
  await clearSellerSession();
  redirect("/seller/login");
}
