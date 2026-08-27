#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
echo "🐻 Papa Bonski Super Kids — Easy Install V3"
command -v node >/dev/null || { echo "Node.js 20+ belum tersedia. Install Node.js lalu ulangi."; exit 1; }
npm install
npm run setup
echo "Setup selesai. Jalankan: npm run dev"
