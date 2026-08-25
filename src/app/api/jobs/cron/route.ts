import { NextResponse } from "next/server";
import { STORY_WORKER_HEADER } from "@/lib/jobs/worker-auth";

export const runtime = "nodejs";
export const maxDuration = 300;

function limitFromEnv(): number {
  const raw = Number(process.env.STORY_WORKER_CRON_LIMIT ?? process.env.STORY_WORKER_LIMIT);
  return Number.isFinite(raw) ? Math.max(1, Math.min(20, raw)) : 10;
}

export async function GET(req: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const workerSecret = process.env.STORY_WORKER_SECRET;

  if (!cronSecret || req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Tidak diizinkan." }, { status: 401 });
  }

  if (!workerSecret) {
    return NextResponse.json(
      { error: "STORY_WORKER_SECRET belum dikonfigurasi." },
      { status: 500 }
    );
  }

  const res = await fetch(new URL("/api/jobs/process", req.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [STORY_WORKER_HEADER]: workerSecret,
    },
    body: JSON.stringify({ limit: limitFromEnv(), workerId: "vercel-cron" }),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return NextResponse.json(json, { status: res.status });
}
