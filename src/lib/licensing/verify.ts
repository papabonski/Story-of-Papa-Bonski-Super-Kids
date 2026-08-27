import crypto from "node:crypto";

export type LicensePayload = {
  v: number;
  product: string;
  customer?: string;
  installationId?: string;
  plan?: string;
  seats?: number;
  issuedAt?: string;
  expiresAt?: string | null;
};

export type LicenseStatus = {
  valid: boolean;
  reason: string;
  payload?: LicensePayload;
};

export function verifyLicense(token = process.env.PAPA_BONSKI_LICENSE_TOKEN, publicKey = process.env.PAPA_BONSKI_LICENSE_PUBLIC_KEY): LicenseStatus {
  if (process.env.PAPA_BONSKI_LICENSE_REQUIRED !== "true") return { valid: true, reason: "Licensing is optional for this deployment." };
  if (!token) return { valid: false, reason: "License token is missing." };
  if (!publicKey) return { valid: false, reason: "License public key is missing." };
  try {
    const [payloadPart, signaturePart] = token.trim().split(".");
    if (!payloadPart || !signaturePart) return { valid: false, reason: "License token format is invalid." };
    const ok = crypto.verify(null, Buffer.from(payloadPart), publicKey.replace(/\\n/g, "\n"), Buffer.from(signaturePart, "base64url"));
    if (!ok) return { valid: false, reason: "License signature is invalid." };
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8")) as LicensePayload;
    if (payload.product !== "papa-bonski-super-kids") return { valid: false, reason: "License is for a different product.", payload };
    if (payload.expiresAt && Date.now() > Date.parse(payload.expiresAt)) return { valid: false, reason: "License has expired.", payload };
    const installId = process.env.PAPA_BONSKI_INSTALLATION_ID;
    if (installId && payload.installationId && payload.installationId !== installId) return { valid: false, reason: "License installation ID does not match this deployment.", payload };
    return { valid: true, reason: "License signature and validity checks passed.", payload };
  } catch {
    return { valid: false, reason: "License could not be parsed or verified." };
  }
}
