import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SELLER_COOKIE = "pb_seller_session";
const SELLER_SESSION_TTL_SECONDS = 12 * 60 * 60;

function normalizeSecret(value: string | undefined) {
  return (value ?? "").trim();
}

function configuredSecrets() {
  return [
    normalizeSecret(process.env.ADMIN_DASHBOARD_SECRET),
    normalizeSecret(process.env.STORY_WORKER_SECRET),
  ].filter(Boolean);
}

function signingSecret() {
  return configuredSecrets()[0] ?? "";
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(expiresAt: number) {
  const secret = signingSecret();
  if (!secret) return "";
  return createHmac("sha256", secret)
    .update(`papa-bonski-seller:v1:${expiresAt}`)
    .digest("base64url");
}

export function sellerAuthConfigured() {
  return configuredSecrets().length > 0;
}

export function verifySellerSecret(submitted: string) {
  const candidate = normalizeSecret(submitted);
  if (!candidate) return false;
  return configuredSecrets().some((secret) => safeEqual(candidate, secret));
}

export async function createSellerSession() {
  if (!sellerAuthConfigured()) {
    throw new Error("Seller Center belum memiliki secret admin.");
  }
  const expiresAt = Math.floor(Date.now() / 1000) + SELLER_SESSION_TTL_SECONDS;
  const value = `v1.${expiresAt}.${signature(expiresAt)}`;
  const cookieStore = await cookies();
  cookieStore.set(SELLER_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/seller",
    maxAge: SELLER_SESSION_TTL_SECONDS,
  });
}

export async function clearSellerSession() {
  const cookieStore = await cookies();
  cookieStore.set(SELLER_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/seller",
    maxAge: 0,
  });
}

export async function hasSellerSession() {
  if (!sellerAuthConfigured()) return false;
  const raw = (await cookies()).get(SELLER_COOKIE)?.value ?? "";
  const [version, expiresRaw, suppliedSignature] = raw.split(".");
  const expiresAt = Number(expiresRaw);
  if (version !== "v1" || !Number.isFinite(expiresAt) || !suppliedSignature) return false;
  const now = Math.floor(Date.now() / 1000);
  if (expiresAt <= now || expiresAt > now + SELLER_SESSION_TTL_SECONDS + 60) return false;
  return safeEqual(suppliedSignature, signature(expiresAt));
}

export async function requireSellerSession(nextPath = "/seller") {
  if (await hasSellerSession()) return;
  const safeNext = nextPath.startsWith("/seller") && !nextPath.startsWith("//") ? nextPath : "/seller";
  redirect(`/seller/login?next=${encodeURIComponent(safeNext)}`);
}
