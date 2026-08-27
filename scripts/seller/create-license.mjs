#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const b64u = (v) => Buffer.from(v).toString('base64url');
const privatePath = path.resolve('.seller/license-private.pem');
if (!fs.existsSync(privatePath)) {
  console.error('❌ No seller private key. Run: npm run seller:init');
  process.exit(1);
}
const rl = readline.createInterface({ input, output });
const ask = async (q, d='') => ((await rl.question(`${q}${d ? ` [${d}]` : ''}: `)).trim() || d);
const customer = await ask('Customer / business name');
const installationId = await ask('Installation ID', `PBSK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`);
const plan = await ask('Plan', 'commercial');
const months = Number(await ask('License months (0 = no expiry)', '12'));
const seats = Number(await ask('Max installations/seats', '1'));
const now = new Date();
const expiresAt = months > 0 ? new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + months, now.getUTCDate(), 23,59,59)).toISOString() : null;
const payload = {
  v: 1,
  product: 'papa-bonski-super-kids',
  customer,
  installationId,
  plan,
  seats,
  issuedAt: now.toISOString(),
  expiresAt,
};
const payloadPart = b64u(JSON.stringify(payload));
const privateKey = fs.readFileSync(privatePath, 'utf8');
const signature = crypto.sign(null, Buffer.from(payloadPart), privateKey).toString('base64url');
const token = `${payloadPart}.${signature}`;
fs.mkdirSync('licenses', { recursive: true });
const safe = installationId.replace(/[^A-Za-z0-9_-]/g, '_');
const file = path.resolve(`licenses/${safe}.license.txt`);
fs.writeFileSync(file, token + '\n');
rl.close();
console.log('\n✅ License created:', file);
console.log('Customer:', customer || '(not set)');
console.log('Installation ID:', installationId);
console.log('Expires:', expiresAt ?? 'Never');
console.log('\nCopy this token into PAPA_BONSKI_LICENSE_TOKEN on the customer deployment.');
