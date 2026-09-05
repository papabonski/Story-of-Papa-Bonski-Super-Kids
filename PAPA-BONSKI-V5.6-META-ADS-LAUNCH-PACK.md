# Papa Bonski V5.6 — Meta Ads Launch Pack

## Objective
Primary goal: sell **Papa Bonski Super Kids 1 — Rp50.000** from Meta traffic to `/super-kids`.

Do not send cold traffic to Seller Center, member login, or root brand page. Cold traffic should land directly on the product sales page.

## Campaign naming
Suggested campaign:
`PBSK | Sales | SuperKids | Prospecting | ID`

Suggested creative naming:
- `problem_bedtime_01`
- `problem_gadget_01`
- `problem_vegetable_01`
- `child_hero_01`
- `demo_flow_01`
- `gift_parent_01`

UTM example:
`utm_source=meta&utm_medium=paid_social&utm_campaign=superkids_launch&utm_content=problem_bedtime_01`

## Creative Angle A — Problem first
### Hook options
- “Si kecil susah tidur? Coba jadikan dia tokoh utama dalam cerita sebelum tidur.”
- “Daripada terus mengingatkan soal gadget, bagaimana kalau pesannya masuk lewat cerita yang memakai nama anak sendiri?”
- “Tidak mau makan sayur? Buat cerita yang terasa seperti memang dibuat untuk si kecil.”

### Primary text
Masalah kecil sehari-hari sering lebih mudah dibicarakan lewat cerita.

Di Papa Bonski Super Kids, orang tua memilih kebutuhan anak, lalu Papa Bonski membantu membuat cerita personal dengan nama, profil, ilustrasi, audio narasi, moral, doa, dan panduan orang tua.

Paket awal Rp50.000 sudah termasuk 2 cerita personal + akses 1 tahun.

### Headline
`Cerita Personal untuk Kebutuhan Anak Hari Ini`

### CTA
`Pelajari Selengkapnya` atau `Beli Sekarang`

## Creative Angle B — Anak menjadi tokoh utama
### Hook
“Bagaimana reaksinya ketika mendengar namanya sendiri di dalam cerita?”

### Primary text
Bukan sekadar cerita umum. Papa Bonski membantu membuat pengalaman membaca yang memakai nama, usia, karakter, dan kebutuhan anak sebagai bagian dari cerita.

Baca bersama. Dengarkan audionya. Simpan di koleksi dan buka kembali kapan diperlukan.

Rp50.000 untuk 2 cerita personal + akses 1 tahun.

### Headline
`Anak Anda Menjadi Tokoh Utama`

## Creative Angle C — Demo produk
### Storyboard 15–25 detik
1. Screen: pilih kebutuhan anak — “Susah tidur / takut sekolah / gadget / sayur”
2. Screen: isi profil anak
3. Screen: review teks cerita
4. Screen: tampilkan ilustrasi + flipbook
5. Screen: tekan audio
6. End card: `2 Cerita Personal + Akses 1 Tahun — Rp50.000`

### Voice-over concept
“Pilih kebutuhan si kecil, buat profilnya, review ceritanya, lalu nikmati cerita personal lengkap dengan ilustrasi dan audio. Papa Bonski Super Kids, mulai Rp50.000.”

## Creative Angle D — Gift
### Hook
“Hadiah digital yang benar-benar memakai nama anak.”

### Primary text
Papa Bonski Super Kids juga bisa dibelikan untuk orang lain.

Saat membeli, tentukan Email Penerima yang akan memiliki akses. Email Pembeli untuk transaksi boleh berbeda.

Cocok sebagai hadiah digital untuk keluarga dengan anak kecil.

### Headline
`Hadiah Cerita Personal untuk Si Kecil`

## Short copy variants
### Variant 1
Anak jadi tokoh utama. Pilih kebutuhan hari ini, lalu buat cerita personal dengan ilustrasi dan audio. 2 cerita + akses 1 tahun Rp50.000.

### Variant 2
Susah tidur, gadget, takut sekolah, atau tidak mau sayur? Jadikan topik itu cerita personal yang terasa lebih dekat dengan anak.

### Variant 3
Nama, karakter, ilustrasi, audio, moral, dan doa dalam satu cerita personal untuk si kecil. Mulai 2 cerita Rp50.000.

## Landing-page message match
Creative harus konsisten dengan headline landing:
**“Bukan sekadar cerita. Cerita tentang anak Anda.”**

Do not promise:
- guaranteed behavior change
- guaranteed educational outcome
- medical/therapeutic outcomes
- fake testimonials
- fake scarcity or countdown

## Initial testing matrix
Test variables separately where possible:
- Angle: problem vs child-hero vs demo vs gift
- Format: short video vs static visual
- Hook: bedtime vs gadget vs school vs vegetables
- CTA: Learn More vs Shop Now if supported

Keep landing URL and offer constant during the first creative comparison so results are easier to interpret.

## Decision signals
Prioritize diagnostics in this order:
1. Delivery / CPM: can Meta reach the audience efficiently?
2. Thumb-stop / CTR: does the creative earn attention and clicks?
3. Landing ViewContent → InitiateCheckout: does the page explain the offer well enough?
4. InitiateCheckout → Paid: does checkout/price create friction?
5. Paid order attribution: which campaign/creative actually produced revenue?

Do not scale spend based only on clicks or CTR. Revenue and paid-order attribution are the final business signals.

## Pre-launch checklist
- Meta Pixel ID active on Production
- Standard `ViewContent` fires on `/super-kids`
- Standard `InitiateCheckout` fires on CTA
- UTM persists to checkout
- One UTM-tagged test payment becomes a paid order with attribution
- OrderHero webhook health green
- Mobile landing checked manually
- Payment → OTP → member access checked

## Creative production notes
For static/image/video assets, use real Papa Bonski UI and product output whenever possible. Avoid implying that a generic stock child is an actual customer. Product demonstrations should show the real workflow and real story screens.
