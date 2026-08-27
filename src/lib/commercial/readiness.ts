import { verifyLicense } from "@/lib/licensing/verify";
export type CommercialCheck = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
  action?: string;
  href?: string;
};

export async function getCommercialReadiness(): Promise<CommercialCheck[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const gemini = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  const worker = process.env.STORY_WORKER_SECRET;
  const admin = process.env.ADMIN_DASHBOARD_SECRET || worker;
  const productionUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const customerName = process.env.PAPA_BONSKI_CUSTOMER_NAME;
  const installationId = process.env.PAPA_BONSKI_INSTALLATION_ID;

  const license = verifyLicense();

  const out: CommercialCheck[] = [
    { id: "supabase", label: "Supabase", ok: !!(url && anon && service), detail: url && anon && service ? "Konfigurasi utama terisi" : "URL/anon/service role belum lengkap", action: "Jalankan Easy Setup", href: "/setup" },
    { id: "gemini", label: "Gemini AI", ok: !!gemini, detail: gemini ? "API key terisi" : "API key belum diisi", action: "Buka Setup", href: "/setup" },
    { id: "worker", label: "Story worker", ok: !!worker, detail: worker ? "Secret worker tersedia" : "Secret worker belum ada", action: "Buka Setup", href: "/setup" },
    { id: "admin", label: "Admin", ok: !!admin, detail: admin ? "Password admin tersedia" : "Password admin belum ada", action: "Buka Admin", href: "/admin" },
    { id: "customer", label: "Customer profile", ok: !!(customerName && installationId), detail: customerName && installationId ? `${customerName} · ${installationId}` : "Nama customer / installation ID belum diisi" },
    { id: "production", label: "Production URL", ok: !!productionUrl, detail: productionUrl ? productionUrl.replace(/^https?:\/\//, "") : "Isi NEXT_PUBLIC_APP_URL setelah deploy" },
    { id: "license", label: "Commercial License", ok: license.valid, detail: license.reason, action: "Lihat License", href: "/license" },
  ];

  if (url && service) {
    try {
      const r = await fetch(`${url}/rest/v1/white_label_settings?select=id&limit=1`, {
        headers: { apikey: service, Authorization: `Bearer ${service}` }, cache: "no-store",
      });
      out.push({ id: "schema", label: "Database schema", ok: r.ok, detail: r.ok ? "0001_init.sql terdeteksi" : `Belum siap (HTTP ${r.status})`, action: "Periksa Setup", href: "/setup" });
    } catch {
      out.push({ id: "schema", label: "Database schema", ok: false, detail: "Tidak dapat menghubungi Supabase", action: "Periksa Setup", href: "/setup" });
    }
  } else {
    out.push({ id: "schema", label: "Database schema", ok: false, detail: "Supabase belum lengkap", action: "Periksa Setup", href: "/setup" });
  }

  return out;
}
