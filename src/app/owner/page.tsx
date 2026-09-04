import { redirect } from "next/navigation";
import { requireSellerSession } from "@/lib/seller-auth";

export const dynamic = "force-dynamic";

export default async function OwnerPage() {
  await requireSellerSession("/owner");
  redirect("/seller/system");
}
