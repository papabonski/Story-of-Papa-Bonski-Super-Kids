# Papa Bonski V5.6 — Meta Ads Launch Pack

## Objective
Primary goal: sell **Papa Bonski Super Kids 1 — Rp50.000** from Meta traffic to `/super-kids`.

Do not send cold traffic to Seller Center, member login, or root brand page. Cold traffic should land directly on the product sales page.

## Campaign naming
Suggested campaign:
`PBSK | Sales | SuperKids | Prospecting | ID`

Suggested creative naming:
- `routine_bedtime_01`
- `routine_screen_time_01`
- `routine_vegetable_01`
- `child_hero_01`
- `demo_flow_01`
- `gift_parent_01`

UTM example:
`utm_source=meta&utm_medium=paid_social&utm_campaign=superkids_launch&utm_content=routine_bedtime_01`

## Creative Angle A — Everyday routine first
### Hook options
- “Jadikan rutinitas sebelum tidur lebih personal dengan cerita yang menempatkan si kecil sebagai tokoh utama.”
- “Ingin membantu mengatur waktu layar? Bawa pesannya lewat cerita yang memakai nama anak sendiri.”
- “Belajar menikmati sayur bisa jadi tema petualangan baru untuk si kecil.”

### Primary text
Momen kecil sehari-hari bisa menjadi bahan cerita yang dekat dengan dunia anak.

Di Papa Bonski Super Kids, orang tua memilih momen dan tema, lalu Papa Bonski membantu membuat cerita personal dengan nama, profil, ilustrasi, audio narasi, moral, doa, dan panduan orang tua.

Paket awal Rp50.000 sudah termasuk 2 cerita personal + akses 1 tahun.

### Headline
`Cerita Personal untuk Momen Anak Hari Ini`

### CTA
`Pelajari Selengkapnya` atau `Beli Sekarang`

## Creative Angle B — Anak menjadi tokoh utama
### Hook
“Bagaimana reaksinya ketika mendengar namanya sendiri di dalam cerita?”

### Primary text
Bukan sekadar cerita umum. Papa Bonski membantu membuat pengalaman membaca yang memakai nama, usia, karakter, dan pilihan tema anak sebagai bagian dari cerita.

Baca bersama. Dengarkan audionya. Simpan di koleksi dan buka kembali kapan diperlukan.

Rp50.000 untuk 2 cerita personal + akses 1 tahun.

### Headline
`Anak Anda Menjadi Tokoh Utama`

## Creative Angle C — Demo produk
### Storyboard 15–25 detik
1. Screen: pilih momen anak — “Rutinitas tidur / sekolah / waktu layar / sayur”
2. Screen: isi profil anak
3. Screen: review teks cerita
4. Screen: tampilkan ilustrasi + flipbook
5. Screen: tekan audio
6. End card: `2 Cerita Personal + Akses 1 Tahun — Rp50.000`

### Voice-over concept
“Pilih momen si kecil, buat profilnya, review ceritanya, lalu nikmati cerita personal lengkap dengan ilustrasi dan audio. Papa Bonski Super Kids, mulai Rp50.000.”

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
Anak jadi tokoh utama. Pilih momen hari ini, lalu buat cerita personal dengan ilustrasi dan audio. 2 cerita + akses 1 tahun Rp50.000.

### Variant 2
Rutinitas tidur, waktu layar, persiapan sekolah, atau belajar menikmati sayur bisa dijadikan tema cerita personal yang terasa lebih dekat dengan anak.

### Variant 3
Nama, karakter, ilustrasi, audio, moral, dan doa dalam satu cerita personal untuk si kecil. Mulai 2 cerita Rp50.000.

## Landing-page message match
Creative harus konsisten dengan headline landing:
**“Bukan sekadar cerita. Cerita tentang anak Anda.”**

Do not promise:
- guaranteed behavior change
- guaranteed educational outcome
- medical/therapeutic outcomes
- diagnosis, treatment, or claims about a child's health or psychological condition
- fake testimonials
- fake scarcity or countdown

Gunakan framing **momen, rutinitas, tema, dan pengalaman membaca**, bukan diagnosis atau klaim bahwa produk menyelesaikan kondisi kesehatan/perilaku tertentu.

## Initial testing matrix
Test variables separately where possible:
- Angle: everyday-routine vs child-hero vs demo vs gift
- Format: short video vs static visual
- Hook: bedtime routine vs screen time vs school preparation vs vegetables
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
- Review `Manage Data Source Categories` in Meta Events Manager and request review if Papa Bonski is assigned to a sensitive category that does not accurately describe the product

## Creative production notes
For static/image/video assets, use real Papa Bonski UI and product output whenever possible. Avoid implying that a generic stock child is an actual customer. Product demonstrations should show the real workflow and real story screens.
