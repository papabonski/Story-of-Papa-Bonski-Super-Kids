"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function customerLogout() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut({ scope: "local" });
  if (error) throw new Error("Gagal keluar dari perangkat ini. Silakan coba lagi.");
  redirect("/login?loggedOut=1");
}
