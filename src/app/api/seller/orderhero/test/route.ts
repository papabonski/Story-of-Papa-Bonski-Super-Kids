import { NextResponse } from "next/server";
import { hasSellerSession } from "@/lib/seller-auth";
import { submitOrderHeroPayloadInternally } from "@/lib/seller-orderhero-console";

export const runtime = "nodejs";

export async function POST() {
  if (!(await hasSellerSession())) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  try {
    const orderId = `PBSK-SELLER-TEST-${Date.now()}`;
    const payload = {
      event: "seller.receiver_test",
      data: {
        order: {
          order_id: orderId,
          payment_status: "pending",
          customer: {
            name: "Seller Receiver Test",
            email: "seller-test@papabonski.invalid",
          },
        },
      },
    };

    const test = await submitOrderHeroPayloadInternally(payload, "seller.receiver_test");
    return NextResponse.json(
      {
        ok: test.ok,
        safe: true,
        note: "Test memakai status pending, sehingga tidak membuat customer, order paid, subscription, atau kuota cerita.",
        testOrderId: orderId,
        receiverStatus: test.status,
        receiverResult: test.result,
      },
      { status: test.ok ? 200 : 502 },
    );
  } catch (error) {
    console.error("seller receiver test failed", error);
    return NextResponse.json(
      { ok: false, error: "test_failed", detail: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
