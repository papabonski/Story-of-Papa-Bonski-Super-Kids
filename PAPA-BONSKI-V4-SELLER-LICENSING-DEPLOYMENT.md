# Papa Bonski Super Kids V4 — Seller / Licensing & One-Click Deployment

V4 menambahkan lapisan seller untuk provisioning customer, license bertanda tangan digital (Ed25519), License Status, Seller Center, dan jalur deployment Vercel.

## 1. Inisialisasi seller (sekali saja)

```bash
npm run seller:init
```

Perintah ini membuat `.seller/license-private.pem` dan `.seller/license-public.pem`.

**Private key wajib disimpan oleh seller dan jangan pernah diberikan kepada customer.** Public key aman dipakai untuk verifikasi deployment.

## 2. Buat license customer

```bash
npm run seller:license
```

Masukkan nama customer, Installation ID, paket, masa berlaku, dan jumlah seat. Hasil license disimpan di folder `licenses/`.

## 3. Environment license customer

Tambahkan ke `.env.local` / Vercel:

```env
PAPA_BONSKI_LICENSE_REQUIRED="true"
PAPA_BONSKI_LICENSE_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\\n...\\n-----END PUBLIC KEY-----"
PAPA_BONSKI_LICENSE_TOKEN="<token dari seller>"
PAPA_BONSKI_INSTALLATION_ID="PBSK-XXXXXXXX"
```

Installation ID harus sama dengan license yang dibuat seller.

## 4. Cek license

Buka `/license` atau `GET /api/license/status`.

## 5. One-Click Vercel

Jika seller memiliki GitHub template repository, isi:

```env
PAPA_BONSKI_TEMPLATE_REPOSITORY_URL="https://github.com/SELLER/REPO"
```

Lalu buka `/seller/deploy` dan klik **Deploy with Vercel**. Vercel akan membuka flow clone/deploy template repository. Secret customer tetap harus dimasukkan sebagai Vercel Environment Variables.

Alternatif dari terminal:

```bash
npm run deploy:vercel
```

## 6. Batasan licensing

License V4 menggunakan digital signature sehingga customer tidak dapat membuat token license baru tanpa private seller key. Namun karena produk ini berupa source code yang diserahkan kepada customer, pemilik source secara teknis dapat menghapus pemeriksaan license. Untuk DRM yang lebih kuat, gunakan activation/licensing server terpisah yang dikuasai seller.
