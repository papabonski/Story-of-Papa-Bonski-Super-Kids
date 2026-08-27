#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
console.log('\n🐻 Papa Bonski V4 — Vercel production deployment\n');
if (!fs.existsSync('.env.local')) {
  console.error('❌ .env.local not found. Run: npm run setup');
  process.exit(1);
}
console.log('Vercel CLI will open/link the project and deploy it to production.');
console.log('Important: verify the same environment variables exist in Vercel Project Settings.\n');
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const r = spawnSync(cmd, ['vercel', '--prod'], { stdio: 'inherit', shell: false });
process.exit(r.status ?? 1);
