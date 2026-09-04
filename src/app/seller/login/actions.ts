"use server";

import { redirect } from "next/navigation";
import {
  clearSellerSession,
  createSellerSession,
  sellerAuthConfigured,
  verifySellerSecret,
} from "@/lib/seller-auth";

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "/seller");
  return next.startsWith("/seller") && !next.startsWith("//") ? next : "/seller";
}

export async function sellerLogin(formData: FormData) {
  const next = safeNext(formData.get("next"));
  if (!sellerAuthConfigured()) {
    redirect(`/seller/login?error=${encodeURIComponent("Secret Seller Center belum dikonfigurasi.")}&next=${encodeURIComponent(next)}`);
  }

  const submitted = String(formData.get("secret") ?? "");
  if (!verifySellerSecret(submitted)) {
    redirect(`/seller/login?error=${encodeURIComponent("Secret tidak cocok.")}&next=${encodeURIComponent(next)}`);
  }

  await createSellerSession();
  redirect(next);
}

export async function sellerLogout() {
  await clearSellerSession();
  redirect("/seller/login");
}
