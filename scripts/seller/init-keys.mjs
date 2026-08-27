#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('.seller');
fs.mkdirSync(dir, { recursive: true });
const privatePath = path.join(dir, 'license-private.pem');
const publicPath = path.join(dir, 'license-public.pem');
if (fs.existsSync(privatePath) || fs.existsSync(publicPath)) {
  console.error('Seller keys already exist in .seller/. Move/delete them first if you intentionally want a new key pair.');
  process.exit(1);
}
const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519');
fs.writeFileSync(privatePath, privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600 });
fs.writeFileSync(publicPath, publicKey.export({ type: 'spki', format: 'pem' }), { mode: 0o644 });
console.log('✅ Seller license key pair created.');
console.log('PRIVATE:', privatePath, '(KEEP SECRET / NEVER SHIP TO CUSTOMER)');
console.log('PUBLIC :', publicPath, '(safe to include in deployments)');
