#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const required = ["package.json", "src/app/page.tsx", "src/app/owner/page.tsx", "src/app/install/page.tsx", "supabase/migrations/0001_init.sql", "public/logo.png"];
const missing = required.filter((file) => !fs.existsSync(path.resolve(file)));
console.log("\n🐻 Papa Bonski Super Kids — Commercial Package Check V3\n");
if (missing.length) {
  console.error("❌ File wajib hilang:\n" + missing.map((x) => ` - ${x}`).join("\n"));
  process.exit(1);
}
const envExists = fs.existsSync(".env.local");
console.log("✅ Struktur Commercial Edition lengkap");
console.log(envExists ? "✅ .env.local ditemukan" : "⚠️  .env.local belum ada — jalankan npm run setup");
console.log("✅ Owner Center: /owner");
console.log("✅ Customer install page: /install");
console.log("\nSebelum penjualan: npm run typecheck && npm run build\n");
