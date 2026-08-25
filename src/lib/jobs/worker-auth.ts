export const STORY_WORKER_HEADER = "x-story-worker-secret";

export function isStoryWorkerRequest(req: Request): boolean {
  const secret = process.env.STORY_WORKER_SECRET;
  return !!secret && req.headers.get(STORY_WORKER_HEADER) === secret;
}

export function requireStoryWorker(req: Request): Response | null {
  if (isStoryWorkerRequest(req)) return null;
  return Response.json({ error: "Tidak diizinkan." }, { status: 401 });
}
