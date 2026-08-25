const baseUrl =
  process.env.STORY_WORKER_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.APP_URL ||
  "http://127.0.0.1:3100";
const secret = process.env.STORY_WORKER_SECRET;
const intervalMs = Number(process.env.STORY_WORKER_INTERVAL_MS || 5000);
const limit = Number(process.env.STORY_WORKER_LIMIT || 5);
const workerId = `story-worker-${process.pid}`;

if (!secret) {
  console.error("STORY_WORKER_SECRET belum di-set.");
  process.exit(1);
}

let stopped = false;
process.on("SIGINT", () => {
  stopped = true;
});
process.on("SIGTERM", () => {
  stopped = true;
});

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

while (!stopped) {
  try {
    const res = await fetch(new URL("/api/jobs/process", baseUrl), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-story-worker-secret": secret,
      },
      body: JSON.stringify({ limit, workerId }),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("[story-worker]", res.status, json.error || res.statusText);
    } else if (json.processed > 0) {
      console.log("[story-worker]", JSON.stringify(json));
    }
  } catch (error) {
    console.error("[story-worker]", error instanceof Error ? error.message : error);
  }

  await wait(intervalMs);
}

console.log("[story-worker] stopped");
