import Link from "next/link";
import Image from "next/image";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import FunnelTracker from "@/components/marketing/FunnelTracker";
import CheckoutButton from "@/components/marketing/CheckoutButton";

export const dynamic="force-dynamic";

const benefits=[
  "Termasuk 1 cerita personal",
  "Kuota cerita tidak kedaluwarsa",
  "Nama, usia, foto & karakter anak menjadi bahan personalisasi",
  "Ilustrasi personal + audio narasi",
  "Nilai, nasihat & panduan orang tua",
  "Koleksi cerita yang bisa dibaca ulang",
  "Bonus video pembelajaran Bahasa Inggris",
];

const parentConcerns=[
  {
    icon:"📱",
    hook:"Gadget selalu jadi rebutan?",
    concern:"Saat layar dimatikan, anak sulit beralih ke kegiatan lain atau cepat kesal.",
    solution:"Buat petualangan tentang seorang anak yang belajar membagi waktu, menemukan kegiatan lain, dan memahami kapan layar perlu beristirahat. Bunda dapat memasukkan batas serta pesan yang biasa diterapkan di rumah.",
  },
  {
    icon:"💛",
    hook:"Anak masih sulit mengelola emosi?",
    concern:"Marah, sulit menunggu giliran, enggan berbagi, atau belum nyaman beradaptasi dengan teman.",
    solution:"Buat cerita tentang tokoh yang belajar mengenali perasaan, mengambil jeda, menunggu giliran, dan menyampaikan keinginannya. Cerita menjadi pembuka percakapan, bukan ceramah satu arah.",
  },
  {
    icon:"🌟",
    hook:"Anak mudah minder atau takut mencoba?",
    concern:"Ia mulai membandingkan diri, bergantung pada pujian, atau ragu pada kemampuannya sendiri.",
    solution:"Tempatkan anak sebagai tokoh utama yang berani mencoba sedikit demi sedikit, belajar dari kesalahan, dan menemukan kemampuan dalam dirinya. Bunda dapat mereview pesannya sebelum ilustrasi dan audio dibuat.",
  },
  {
    icon:"🥦",
    hook:"Waktu makan dan tidur jadi perjuangan?",
    concern:"Pilih-pilih makanan, sulit tidur teratur, atau kurang tertarik pada kebiasaan sehat.",
    solution:"Ubah rutinitas makan, tidur, dan bergerak menjadi petualangan personal. Si kecil melihat pilihan tokohnya dan akibatnya melalui pengalaman yang dapat dibaca dan didengarkan bersama.",
  },
  {
    icon:"🛡️",
    hook:"Bagaimana saat Anda tidak selalu di sisinya?",
    concern:"Sekolah, teman, bullying, dan pengaruh luar membuat orang tua ingin membekali anak dengan pegangan yang kuat.",
    solution:"Tuangkan nilai seperti jujur, berani berkata tidak, sopan, berempati, memilih teman, dan meminta bantuan kepada orang dewasa yang dipercaya ke dalam cerita yang dekat dengan dunianya.",
  },
];

export default async function SuperKids(){
  const brand=await getRuntimeBrand();
  return <main className="min-h-screen bg-surface pb-20 text-ink md:pb-0">
    <FunnelTracker event="ViewContent" product="PBSK-SUPER-KIDS" value={25000}/>

    <header className="px-5 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/super-kids" className="flex items-center gap-2">
          <Image src={brand.logoSrc||"/logo.png"} alt={brand.name} width={48} height={48} className="rounded-xl"/>
          <b>Papa Bonski</b>
        </Link>
        <Link href="/login" className="text-right text-sm font-extrabold">Sudah membeli? Login</Link>
      </div>
    </header>

    <section className="px-5 pb-14 pt-6 sm:pt-10">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.08fr_.92fr]">
        <div>
          <span className="inline-flex rounded-full bg-brand-accent/40 px-4 py-2 text-xs font-black uppercase tracking-wider">Sampaikan nilai tanpa terasa menggurui</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.06] sm:text-5xl lg:text-6xl">Anak Jadi Tokoh Utama. Nasihat Bunda Menjadi Cerita.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Sampaikan nilai kehidupan melalui cerita personal yang dekat dengan keseharian si kecil. Ia mengikuti perjalanan tokohnya, melihat pilihan dan akibatnya, lalu diajak menemukan pelajarannya sendiri.
          </p>

          <div className="mt-7 grid gap-2 text-sm font-bold sm:grid-cols-2">
            {["Anak menjadi tokoh utama","Cerita sesuai momen hari ini","Ilustrasi + audio narasi","Nilai pilihan Bunda"].map(item=>
              <div key={item} className="flex items-center gap-2"><span className="text-emerald-600">✓</span><span>{item}</span></div>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#kekhawatiran-bunda" className="btn-primary text-center">Pelajari Cara Kerjanya</a>
            <CheckoutButton label="Buat Cerita Pertama — Rp25.000" className="btn-secondary text-center"/>
          </div>
          <a href="#harga" className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-brand-primary shadow-sm ring-1 ring-black/5">
            <span aria-hidden="true">☕</span>
            <span>1 cerita personal seharga secangkir kopi</span>
          </a>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-ink-soft">
            <span>✓ 1 cerita personal</span><span>✓ Kuota tidak kedaluwarsa</span><span>✓ Login dengan OTP email</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] bg-surface-card p-3 shadow-xl ring-1 ring-black/5 sm:p-5">
          <Image src="/landing/contoh-cerita-sheilla.webp" alt="Contoh cerita personal Sheilla dengan ilustrasi dan audio narasi" width={1400} height={677} priority className="h-auto w-full rounded-[1.75rem]"/>
          <div className="px-3 pb-2 pt-4 text-center">
            <p className="text-sm font-extrabold">Contoh hasil cerita personal</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">Ilustrasi, teks, dan audio narasi dinikmati dalam satu pengalaman.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-black/5 bg-white/70 px-5 py-8">
      <div className="mx-auto grid max-w-5xl gap-5 text-center sm:grid-cols-3">
        {[
          ["💛","Lebih dekat dengan dunia anak","Cerita memakai nama, profil, dan momen yang relevan dengan si kecil."],
          ["📖","Bukan hanya sekali baca","Cerita tersimpan di Koleksi dan dapat dibuka kembali. Kuota cerita tidak kedaluwarsa."],
          ["🎧","Bisa dibaca atau didengarkan","Nikmati teks, ilustrasi, dan audio narasi dalam satu pengalaman."],
        ].map(([icon,title,desc])=><div key={title}><div className="text-3xl">{icon}</div><h2 className="mt-2 font-extrabold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-ink-soft">{desc}</p></div>)}
      </div>
    </section>

    <section id="kekhawatiran-bunda" className="scroll-mt-6 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Apakah Bunda sedang menghadapi ini?</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-extrabold">Setiap anak sedang menjalani prosesnya sendiri.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-ink-soft">Mungkin salah satu situasi ini terasa dekat dengan keluarga Anda. Papa Bonski membantu mengubahnya menjadi bahan cerita dan percakapan antara orang tua dan anak.</p>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {parentConcerns.map((item,index)=><article key={item.hook} className={`rounded-[2rem] bg-surface-card p-6 shadow-sm ring-1 ring-black/5 sm:p-7 ${index===parentConcerns.length-1?"md:col-span-2 md:mx-auto md:max-w-[calc(50%-0.625rem)]":""}`}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/25 text-2xl">{item.icon}</div>
              <div>
                <h3 className="text-xl font-extrabold">{item.hook}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.concern}</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl bg-brand-primary/5 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-brand-primary">Bagaimana Papa Bonski membantu</p>
              <p className="mt-2 text-sm font-semibold leading-relaxed">{item.solution}</p>
            </div>
          </article>)}
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-[2rem] bg-brand-primary px-6 py-8 text-center text-white sm:px-10">
          <p className="text-sm font-black uppercase tracking-widest opacity-80">Mengapa melalui cerita?</p>
          <h3 className="mt-3 text-2xl font-extrabold">Nasihat yang baik tidak selalu mudah diterima.</h3>
          <p className="mt-4 leading-relaxed opacity-90">Semakin sering anak diingatkan, terkadang semakin cepat ia menutup telinga. Bukan karena nasihat Bunda tidak penting. Bisa jadi cara penyampaiannya belum terasa dekat dengan dunia si kecil.</p>
          <p className="mt-3 font-bold">Anak menyukai cerita—terlebih ketika ia mengenali dirinya sebagai tokoh utama.</p>
        </div>
        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-relaxed text-ink-faint">Papa Bonski adalah media cerita dan pendamping percakapan keluarga, bukan pengganti bantuan profesional apabila anak mengalami masalah yang membutuhkan penanganan khusus.</p>
      </div>
    </section>

    <section id="cara-kerja" className="bg-white/70 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Biarkan cerita membantu menyampaikannya</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-extrabold">Si kecil tidak hanya diberi tahu. Ia diajak melihat, merasakan, dan memahami.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-soft">Pilih kebiasaan tidur, makan, motivasi belajar, waktu layar, emosi, atau pergaulan sebagai tema. Anak mengikuti perjalanan tokohnya dan diajak memahami akibat dari sebuah pilihan melalui jalan cerita.</p>
        <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-primary/10 to-brand-accent/20 p-6 sm:p-8">
            <p className="text-xs font-black text-brand-primary">CONTOH MOMEN</p>
            <h3 className="mt-2 text-2xl font-extrabold">Momen apa yang sedang dekat dengan si kecil?</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold">
              <span className="rounded-xl bg-white p-3">🌙 Rutinitas tidur</span>
              <span className="rounded-xl bg-white p-3">🥦 Semangat makan sayur</span>
              <span className="rounded-xl bg-white p-3">🏫 Siap berangkat sekolah</span>
              <span className="rounded-xl bg-white p-3">📱 Atur waktu layar</span>
            </div>
          </div>
          <div className="rounded-[2rem] bg-surface-card p-6 ring-1 ring-black/5 sm:p-8">
            <p className="text-xs font-black text-brand-primary">HASIL PENGALAMAN</p>
            <h3 className="mt-2 text-2xl font-extrabold">Bunda tetap memegang kendali atas pesan ceritanya.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">Nama, usia, foto, karakter, dan pilihan tema membantu membuat cerita lebih personal. Bunda dapat mereview dan menyempurnakan teks terlebih dahulu sebelum ilustrasi dan audio dibuat.</p>
            <div className="mt-5 rounded-2xl bg-surface p-4 text-sm font-semibold">📖 Cerita personal · 🎧 Audio · 🎨 Ilustrasi · 💛 Nilai pilihan Bunda</div>
          </div>
        </div>
        <div className="mx-auto mt-6 max-w-5xl overflow-hidden rounded-[2rem] bg-surface-card p-3 shadow-lg ring-1 ring-black/5 sm:p-5">
          <Image src="/landing/contoh-cerita-sheilla.webp" alt="Halaman cerita personal Mata Cantik Sheilla yang Ingin Melek" width={1400} height={677} className="h-auto w-full rounded-[1.4rem]"/>
          <p className="px-3 pb-2 pt-4 text-center text-sm font-semibold text-ink-soft">Contoh “Mata Cantik Sheilla yang Ingin Melek” — anak menjadi bagian dari cerita yang dekat dengan kesehariannya.</p>
        </div>
      </div>
    </section>

    <section className="bg-white/70 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Dari nilai hidup menjadi cerita miliknya</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-extrabold">Anak bukan hanya membaca cerita—ia menjadi tokoh utama di dalamnya.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center leading-relaxed text-ink-soft">Buat profil si kecil, pilih momen yang ingin dibicarakan, lalu review ceritanya. Setelah Anda puas, Papa Bonski menyiapkan ilustrasi dan audio untuk dinikmati bersama.</p>
        <div className="mt-9 grid gap-5 lg:grid-cols-3">
          {[
            ["/landing/profil-anak.webp","1. Buat profil anak","Masukkan informasi yang membantu cerita terasa lebih dekat dengan dunia anak.","Tampilan pembuatan profil anak"],
            ["/landing/review-cerita.webp","2. Tuangkan nilai hidup Anda","Review dan sempurnakan teks sebelum ilustrasi dan audio diproses.","Tampilan review teks cerita"],
            ["/landing/contoh-cerita-sheilla.webp","3. Baca dan dengarkan","Nikmati cerita bergambar, teks, dan audio narasi bersama anak.","Tampilan hasil cerita bergambar dan audio"],
          ].map(([src,title,desc,alt])=><article key={title} className="overflow-hidden rounded-[2rem] bg-surface-card shadow-sm ring-1 ring-black/5">
            <Image src={src} alt={alt} width={1200} height={720} className="aspect-[16/10] w-full object-cover object-top"/>
            <div className="p-5"><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="bg-white/60 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Cara Membeli & Menggunakan</p>
        <h2 className="mx-auto mt-2 max-w-2xl text-center text-3xl font-extrabold">Tidak perlu instalasi rumit.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-4">
          {[
            ["1","Tentukan Email Penerima","Email ini menjadi pemilik akses dan dipakai untuk login OTP. Untuk diri sendiri, gunakan email Anda."],
            ["2","Selesaikan pembayaran","Di OrderHero, isi Nama, WhatsApp, dan Email Pembeli untuk transaksi."],
            ["3","Login dengan OTP","Setelah pembayaran terverifikasi, masuk memakai Email Penerima dan kode OTP 6 digit."],
            ["4","Buat cerita pertama","Buat profil anak, pilih tema, review cerita, lalu nikmati ilustrasi dan audio."],
          ].map(([n,t,d])=>
            <div key={n} className="rounded-3xl bg-surface-card p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary font-black text-white">{n}</div>
              <h3 className="mt-4 font-extrabold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{d}</p>
            </div>
          )}
        </div>
      </div>
    </section>

    <section className="px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand-primary">Yang Didapat</p>
            <h2 className="mt-2 text-3xl font-extrabold">Bukan sekadar mengganti nama anak.</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">Cerita disusun dari profil si kecil, momen yang sedang dihadapi, dan nilai yang ingin Bunda sampaikan. Hasilnya menjadi pengalaman personal yang dapat dibaca dan didengarkan bersama.</p>
            <div className="mt-6 rounded-2xl bg-brand-accent/20 p-5">
              <p className="font-extrabold">Contoh nilai yang dapat dituangkan</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">Mandiri · percaya diri · jujur · sabar · berani mencoba · menghargai orang lain · mengatur waktu layar · menjaga kebiasaan makan dan tidur</p>
            </div>
          </div>
          <div className="space-y-3">
            {benefits.map(b=><div key={b} className="flex gap-3 rounded-2xl bg-surface-card p-4 ring-1 ring-black/5"><span>✅</span><span className="font-bold">{b}</span></div>)}
          </div>
        </div>
      </div>
    </section>

    <section id="harga" className="scroll-mt-6 bg-brand-primary px-5 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-widest opacity-80">Seharga secangkir kopi ☕</p>
          <h2 className="mt-3 text-4xl font-extrabold">Mulai dari satu cerita yang benar-benar tentang si kecil.</h2>
          <p className="mx-auto mt-4 max-w-2xl opacity-90">Satu cangkir kopi mungkin habis hari ini. Cerita personal si kecil dapat dibaca dan didengarkan kembali bersama Bunda.</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <article className="flex flex-col rounded-[2rem] bg-white p-6 text-ink shadow-xl sm:p-8">
            <span className="w-fit rounded-full bg-brand-accent/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-brand-primary">Untuk mulai mencoba</span>
            <h3 className="mt-4 text-2xl font-extrabold">Paket Cobain</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Cobain satu cerita unik yang dibuat khusus tentang si kecil.</p>
            <div className="mt-6"><span className="text-4xl font-extrabold">Rp25.000</span><span className="ml-2 text-sm font-bold text-ink-soft">1 cerita</span></div>
            <ul className="mt-6 space-y-3 text-sm font-semibold">
              <li>✓ Cerita personal bergambar</li>
              <li>✓ Audio narasi</li>
              <li>✓ Dapat direview sebelum diproses</li>
              <li>✓ Kuota tidak kedaluwarsa</li>
            </ul>
            <CheckoutButton label="Buat Cerita Si Kecil" className="mt-7 w-full rounded-full bg-brand-primary px-5 py-3 text-center font-extrabold text-white"/>
          </article>

          <article className="flex flex-col rounded-[2rem] bg-emerald-50 p-6 text-ink ring-2 ring-emerald-300 sm:p-8">
            <span className="w-fit rounded-full bg-emerald-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-900">Untuk melanjutkan</span>
            <h3 className="mt-4 text-2xl font-extrabold">Paket Nambah</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Tambah cerita untuk mendampingi si kecil belajar mandiri dan percaya diri.</p>
            <div className="mt-6"><span className="text-4xl font-extrabold">Rp60.000</span><span className="ml-2 text-sm font-bold text-ink-soft">+3 cerita</span></div>
            <p className="mt-2 text-sm font-extrabold text-emerald-800">Rp20.000 per cerita</p>
            <ul className="mt-6 space-y-3 text-sm font-semibold">
              <li>✓ Untuk akun yang sudah memiliki akses</li>
              <li>✓ Tema berbeda untuk momen lainnya</li>
              <li>✓ Kuota tidak kedaluwarsa</li>
            </ul>
            <Link href="/login" className="mt-auto pt-7 text-center text-sm font-extrabold text-emerald-900 underline decoration-2 underline-offset-4">Login untuk menambah kuota</Link>
          </article>

          <article className="flex flex-col rounded-[2rem] bg-sky-50 p-6 text-ink ring-2 ring-sky-300 sm:p-8">
            <span className="w-fit rounded-full bg-sky-200 px-3 py-1 text-xs font-black uppercase tracking-wider text-sky-900">Paling hemat</span>
            <h3 className="mt-4 text-2xl font-extrabold">Paket Rame-Rame</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">Bisa menggunakan banyak profil—buatkan cerita untuk anak, saudara, atau teman-temannya.</p>
            <div className="mt-6"><span className="text-4xl font-extrabold">Rp120.000</span><span className="ml-2 text-sm font-bold text-ink-soft">+8 cerita</span></div>
            <p className="mt-2 text-sm font-extrabold text-sky-800">Rp15.000 per cerita</p>
            <ul className="mt-6 space-y-3 text-sm font-semibold">
              <li>✓ Dapat menggunakan beberapa profil</li>
              <li>✓ Seluruh cerita tersimpan dalam satu akun</li>
              <li>✓ Kuota tidak kedaluwarsa</li>
            </ul>
            <Link href="/login" className="mt-auto pt-7 text-center text-sm font-extrabold text-sky-900 underline decoration-2 underline-offset-4">Login untuk menambah kuota</Link>
          </article>
        </div>

        <p className="mx-auto mt-7 max-w-3xl text-center text-sm leading-relaxed text-white/85">Seluruh kuota melekat pada satu akun Papa Bonski dan tidak dapat dipindahkan atau dibagikan ke akun Papa Bonski lainnya.</p>
      </div>
    </section>

    <section className="px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold">Pertanyaan yang sering ditanyakan</h2>
        <div className="mt-6 space-y-3">
          {[
            ["Apakah ini buku fisik atau produk digital?","Papa Bonski adalah produk digital. Cerita dibuat, dibaca, dan didengarkan melalui browser di HP, tablet, atau laptop. Tidak ada buku fisik yang dikirim."],
            ["Apa yang saya dapat setelah membeli?","Paket Cobain memberi kuota 1 cerita personal, termasuk ilustrasi, audio narasi, panduan orang tua, koleksi, dan bonus English Learning. Kuota cerita tidak kedaluwarsa."],
            ["Apakah isi cerita bisa saya periksa?","Bisa. Bunda dapat mereview dan menyempurnakan teks ceritanya terlebih dahulu sebelum ilustrasi dan audio diproses."],
            ["Apakah satu akun dapat memiliki beberapa profil anak?","Bisa. Profil yang berbeda dapat digunakan untuk membuat cerita tentang anak, saudara, atau teman. Seluruh kuota dan cerita tetap melekat pada satu akun Papa Bonski."],
            ["Email Penerima itu apa?","Email Penerima adalah email yang memiliki akses Papa Bonski dan selalu digunakan untuk login OTP. Jika membeli untuk diri sendiri, Email Pembeli dan Email Penerima boleh sama."],
            ["Bisa dibelikan untuk orang lain?","Bisa. Tentukan Email Penerima milik orang tua atau wali yang akan menggunakan Papa Bonski. Email Pembeli di OrderHero boleh berbeda."],
            ["Apa yang terjadi setelah pembayaran?","Setelah pembayaran terverifikasi, paket otomatis diaktifkan untuk Email Penerima. Pemilik akses kemudian login dengan kode OTP 6 digit."],
            ["Kalau cerita pertama sudah terpakai?","Pemilik akun dapat login lalu membeli Paket Nambah +3 cerita seharga Rp60.000 atau Paket Rame-Rame +8 cerita seharga Rp120.000. Penambahan kuota masuk ke akun yang sedang login."],
            ["Apakah kuota dapat dikirim ke akun lain?","Tidak. Seluruh kuota melekat pada akun Papa Bonski yang membelinya dan tidak dapat dipindahkan atau dibagikan ke akun Papa Bonski lainnya."],
            ["Apakah harus install dari Play Store?","Tidak. Papa Bonski dapat digunakan langsung dari browser dan juga dapat dipasang ke layar utama HP atau tablet."],
            ["Apakah Papa Bonski menggantikan bantuan profesional?","Tidak. Papa Bonski adalah media cerita dan pendamping percakapan keluarga, bukan pengganti psikolog, dokter, atau tenaga profesional lainnya."],
          ].map(([q,a])=>
            <details key={q} className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/5">
              <summary className="cursor-pointer font-extrabold">{q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          )}
        </div>
      </div>
    </section>

    <section className="px-5 pb-20 pt-8">
      <div className="mx-auto max-w-3xl rounded-[2.5rem] bg-gradient-to-br from-brand-accent/35 to-white p-7 text-center ring-1 ring-black/5 sm:p-10">
        <p className="text-sm font-black uppercase tracking-widest text-brand-primary">Nilai apa yang ingin Bunda sampaikan?</p>
        <h2 className="mt-3 text-3xl font-extrabold">Buat nasihat Bunda menjadi cerita milik si kecil.</h2>
        <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">Mulai dengan satu cerita personal. Jadikan si kecil tokoh utama, lalu dampingi ia menemukan pelajarannya melalui kisah yang dekat dengan kehidupannya.</p>
        <CheckoutButton label="Buat 1 Cerita — Rp25.000" className="mt-7 inline-flex rounded-full bg-brand-primary px-7 py-4 font-extrabold text-white shadow-lg"/>
      </div>
    </section>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1"><b className="block text-sm">1 cerita personal</b><span className="text-xs text-ink-soft">Rp25.000 · kuota tidak kedaluwarsa</span></div>
        <CheckoutButton label="Mulai" className="rounded-full bg-brand-primary px-6 py-3 text-sm font-extrabold text-white"/>
      </div>
    </div>
  </main>
}
