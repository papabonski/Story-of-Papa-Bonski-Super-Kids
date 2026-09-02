import Link from "next/link";
import Image from "next/image";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import FunnelTracker from "@/components/marketing/FunnelTracker";
import CheckoutButton from "@/components/marketing/CheckoutButton";

export const dynamic="force-dynamic";

const benefits=[
  "Akses Papa Bonski Super Kids selama 1 tahun",
  "Termasuk 2 cerita personal",
  "Cerita dengan nama, foto & karakter anak",
  "Ilustrasi personal + audio narasi",
  "Moral, doa & panduan orang tua",
  "Koleksi cerita yang bisa dibaca ulang",
  "Bonus video pembelajaran Bahasa Inggris",
];

export default async function SuperKids(){
  const brand=await getRuntimeBrand();
  return <main className="min-h-screen bg-surface text-ink">
    <FunnelTracker event="ViewContent" product="PBSK-SUPER-KIDS" />

    <header className="px-5 py-5">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/super-kids" className="flex items-center gap-2">
          <Image src={brand.logoSrc||"/logo.png"} alt={brand.name} width={48} height={48} className="rounded-xl"/>
          <b>Papa Bonski</b>
        </Link>
        <Link href="/login" className="text-sm font-extrabold">Sudah beli? Login Member</Link>
      </div>
    </header>

    <section className="px-5 pb-14 pt-8">
      <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.12fr_.88fr]">
        <div>
          <span className="rounded-full bg-brand-accent/40 px-4 py-2 text-xs font-black uppercase tracking-wider">Papa Bonski Super Kids</span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] sm:text-5xl">Cerita personal yang menjadikan si kecil tokoh utama.</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Bunda cukup pilih profil, kebutuhan, dan tema cerita. Papa Bonski membantu membuat cerita bergambar personal yang bisa dibaca dan didengarkan bersama anak.
          </p>

          <div className="mt-7 grid gap-2 text-sm font-bold sm:grid-cols-2">
            {["Nama & karakter anak masuk ke cerita","Ilustrasi personal","Audio narasi","Moral, doa & panduan orang tua"].map(item=>
              <div key={item} className="flex items-center gap-2"><span className="text-emerald-600">✓</span><span>{item}</span></div>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CheckoutButton label="Beli Sekarang — Rp50.000" className="btn-primary text-center"/>
            <a href="#contoh" className="btn-secondary text-center">Lihat Contoh Hasil</a>
          </div>
          <p className="mt-3 text-xs text-ink-faint">Pembayaran aman melalui halaman checkout resmi Papa Bonski.</p>
        </div>

        <div className="rounded-[2.5rem] bg-surface-card p-5 shadow-xl ring-1 ring-black/5">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-primary/15 to-brand-accent/20 p-7">
            <div className="mx-auto max-w-sm rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-xs font-black uppercase tracking-wider text-brand-primary">Paket Retail</p>
              <h2 className="mt-2 text-3xl font-extrabold">Rp50.000</h2>
              <p className="mt-1 text-sm font-bold text-ink-soft">Akses 1 tahun + 2 cerita personal</p>
              <div className="mt-5 space-y-2 text-sm">
                {["Cerita bergambar personal","Audio narasi","Moral, doa & parent guide","Bisa dibaca ulang dari Koleksi"].map(item=>
                  <div key={item} className="flex gap-2"><span>✅</span><span className="font-semibold">{item}</span></div>
                )}
              </div>
              <CheckoutButton label="Beli Papa Bonski Super Kids" className="mt-6 block rounded-2xl bg-brand-primary px-4 py-3 text-center font-extrabold text-white"/>
              <p className="mt-3 text-center text-[11px] text-ink-faint">Tambahan cerita tersedia bila dibutuhkan.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="contoh" className="bg-white/60 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Contoh Pengalaman</p>
        <h2 className="mx-auto mt-2 max-w-2xl text-center text-3xl font-extrabold">Dari kebutuhan anak hari ini menjadi cerita yang terasa dekat dengannya.</h2>
        <div className="mx-auto mt-9 max-w-3xl rounded-[2rem] bg-surface-card p-6 shadow-sm ring-1 ring-black/5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-gradient-to-br from-brand-primary/10 to-brand-accent/20 p-6">
              <p className="text-xs font-black text-brand-primary">PILIH KEBUTUHAN</p>
              <h3 className="mt-2 text-2xl font-extrabold">Hari ini, apa yang dibutuhkan si kecil?</h3>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm font-bold">
                <span className="rounded-xl bg-white p-3">😴 Susah tidur</span>
                <span className="rounded-xl bg-white p-3">🥦 Tidak mau sayur</span>
                <span className="rounded-xl bg-white p-3">🏫 Takut sekolah</span>
                <span className="rounded-xl bg-white p-3">📱 Gadget</span>
              </div>
            </div>
            <div className="rounded-3xl bg-white p-6 ring-1 ring-black/5">
              <p className="text-xs font-black text-brand-primary">HASILNYA</p>
              <h3 className="mt-2 text-2xl font-extrabold">Cerita khusus untuk anak Anda</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">Nama, usia, foto, dan karakter anak digunakan untuk membantu membuat cerita yang lebih personal. Teks dapat direview dulu sebelum ilustrasi dan audio dibuat.</p>
              <div className="mt-4 rounded-2xl bg-surface p-4 text-sm font-semibold">📖 Flipbook · 🎧 Audio · 🎨 Ilustrasi · 💛 Moral & doa</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="cara-kerja" className="px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Cara Kerja</p>
        <h2 className="mx-auto mt-2 max-w-2xl text-center text-3xl font-extrabold">4 langkah sederhana dari pembelian hingga cerita siap dinikmati.</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-4">
          {[
            ["1","Beli & login","Setelah pembayaran, login memakai email yang sama dan kode OTP 6 digit."],
            ["2","Buat profil anak","Isi nama, usia, foto, dan karakter anak untuk digunakan kembali."],
            ["3","Pilih kebutuhan","Pilih tema atau masalah anak hari ini, lalu review teks ceritanya."],
            ["4","Baca & dengarkan","Setelah disetujui, ilustrasi dan audio dibuat untuk flipbook."],
          ].map(([n,t,d])=>
            <div key={n} className="rounded-3xl bg-surface-card p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary font-black text-white">{n}</div>
              <h3 className="mt-4 font-extrabold">{t}</h3>
              <p className="mt-2 text-sm text-ink-soft">{d}</p>
            </div>
          )}
        </div>
      </div>
    </section>

    <section className="bg-white/60 px-5 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-brand-primary">Yang Didapat</p>
            <h2 className="mt-2 text-3xl font-extrabold">Satu paket untuk mulai membuat cerita personal.</h2>
            <p className="mt-4 text-ink-soft">Semua fitur utama sudah aktif setelah pembayaran terverifikasi.</p>
          </div>
          <div className="space-y-3">
            {benefits.map(b=><div key={b} className="flex gap-3 rounded-2xl bg-surface-card p-4 ring-1 ring-black/5"><span>✅</span><span className="font-bold">{b}</span></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-brand-primary px-5 py-16 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-widest opacity-80">Siap membuat cerita pertama?</p>
        <h2 className="mt-3 text-4xl font-extrabold">Mulai dengan 2 cerita personal untuk si kecil.</h2>
        <p className="mx-auto mt-4 max-w-xl opacity-90">Akses 1 tahun. Setelah pembayaran, login menggunakan email pembelian dan kode OTP 6 digit.</p>
        <CheckoutButton label="Beli Sekarang — Rp50.000" className="mt-7 inline-flex rounded-full bg-white px-7 py-4 font-extrabold text-brand-primary shadow-lg"/>
      </div>
    </section>

    <section className="px-5 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold">Pertanyaan yang sering ditanyakan</h2>
        <div className="mt-6 space-y-3">
          {[
            ["Apa yang saya dapat setelah membeli?","Akses Papa Bonski Super Kids selama 1 tahun dan kuota awal 2 cerita personal."],
            ["Bagaimana saya masuk setelah membeli?","Gunakan email yang sama seperti saat pembelian. Papa Bonski akan mengirim kode OTP 6 digit untuk masuk."],
            ["Kalau 2 cerita sudah terpakai?","Anda dapat membeli tambahan kuota cerita langsung dari dalam aplikasi saat dibutuhkan."],
            ["Apakah harus install dari Play Store?","Tidak. Papa Bonski dapat dibuka langsung dan juga dipasang ke layar utama HP atau tablet."],
            ["Apakah bisa dipakai di HP dan tablet?","Ya. Papa Bonski dirancang agar nyaman digunakan di HP, tablet, dan laptop."],
          ].map(([q,a])=>
            <details key={q} className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/5">
              <summary className="cursor-pointer font-extrabold">{q}</summary>
              <p className="mt-3 text-sm text-ink-soft">{a}</p>
            </details>
          )}
        </div>
      </div>
    </section>
  </main>
}
