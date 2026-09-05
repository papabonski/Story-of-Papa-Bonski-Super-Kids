import Link from "next/link";
import Image from "next/image";
import { getRuntimeBrand } from "@/lib/white-label/settings";
import FunnelTracker from "@/components/marketing/FunnelTracker";
import CheckoutButton from "@/components/marketing/CheckoutButton";

export const dynamic="force-dynamic";

const benefits=[
  "Akses Papa Bonski Super Kids selama 1 tahun",
  "Termasuk 2 cerita personal",
  "Nama, usia, foto & karakter anak menjadi bahan personalisasi",
  "Ilustrasi personal + audio narasi",
  "Moral, doa & panduan orang tua",
  "Koleksi cerita yang bisa dibaca ulang",
  "Bonus video pembelajaran Bahasa Inggris",
];

export default async function SuperKids(){
  const brand=await getRuntimeBrand();
  return <main className="min-h-screen bg-surface pb-20 text-ink md:pb-0">
    <FunnelTracker event="ViewContent" product="PBSK-SUPER-KIDS" value={50000}/>

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
          <span className="inline-flex rounded-full bg-brand-accent/40 px-4 py-2 text-xs font-black uppercase tracking-wider">Cerita Personal untuk Anak</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.06] sm:text-5xl lg:text-6xl">Bukan sekadar cerita. Cerita tentang anak Anda.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Ubah momen anak sehari-hari—seperti membangun rutinitas tidur, semangat makan sayur, lebih siap berangkat sekolah, atau mengatur waktu layar—menjadi cerita personal yang bisa dibaca dan didengarkan bersama.
          </p>

          <div className="mt-7 grid gap-2 text-sm font-bold sm:grid-cols-2">
            {["Anak menjadi tokoh utama","Cerita sesuai momen hari ini","Ilustrasi + audio narasi","Moral, doa & panduan orang tua"].map(item=>
              <div key={item} className="flex items-center gap-2"><span className="text-emerald-600">✓</span><span>{item}</span></div>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <CheckoutButton label="Mulai 2 Cerita — Rp50.000" className="btn-primary text-center"/>
            <a href="#contoh" className="btn-secondary text-center">Lihat Cara Kerjanya</a>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-ink-soft">
            <span>✓ Akses 1 tahun</span><span>✓ Login dengan OTP email</span><span>✓ Tidak wajib install Play Store</span>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-surface-card p-5 shadow-xl ring-1 ring-black/5">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-primary/15 to-brand-accent/25 p-6 sm:p-7">
            <div className="mx-auto max-w-sm rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-xs font-black uppercase tracking-wider text-brand-primary">Paket Super Kids 1</p>
              <h2 className="mt-2 text-4xl font-extrabold">Rp50.000</h2>
              <p className="mt-1 text-sm font-bold text-ink-soft">2 cerita personal + akses 1 tahun</p>
              <div className="mt-5 space-y-3 text-sm">
                {["Cerita bergambar personal","Audio narasi","Moral, doa & panduan orang tua","Koleksi cerita untuk dibaca ulang","Bonus English Learning"].map(item=>
                  <div key={item} className="flex gap-2"><span>✅</span><span className="font-semibold">{item}</span></div>
                )}
              </div>
              <CheckoutButton label="Beli Papa Bonski Super Kids" className="mt-6 block rounded-2xl bg-brand-primary px-4 py-3 text-center font-extrabold text-white"/>
              <p className="mt-3 text-center text-[11px] leading-relaxed text-ink-faint">Bisa untuk anak sendiri atau sebagai hadiah. Email Pembeli dan Email Penerima boleh berbeda.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-y border-black/5 bg-white/70 px-5 py-8">
      <div className="mx-auto grid max-w-5xl gap-5 text-center sm:grid-cols-3">
        {[
          ["💛","Lebih dekat dengan dunia anak","Cerita memakai nama, profil, dan momen yang relevan dengan si kecil."],
          ["📖","Bukan hanya sekali baca","Cerita tersimpan di Koleksi dan dapat dibuka kembali selama akses aktif."],
          ["🎧","Bisa dibaca atau didengarkan","Nikmati teks, ilustrasi, dan audio narasi dalam satu pengalaman."],
        ].map(([icon,title,desc])=><div key={title}><div className="text-3xl">{icon}</div><h2 className="mt-2 font-extrabold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-ink-soft">{desc}</p></div>)}
      </div>
    </section>

    <section id="contoh" className="px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Dari momen sehari-hari menjadi cerita</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-extrabold">Mulai dari hal yang sedang dekat dengan anak hari ini.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-soft">Orang tua memilih momen dan tema. Papa Bonski membantu mengubahnya menjadi cerita yang terasa lebih dekat dengan kehidupan anak.</p>
        <div className="mx-auto mt-9 grid max-w-5xl gap-4 md:grid-cols-2">
          <div className="rounded-[2rem] bg-gradient-to-br from-brand-primary/10 to-brand-accent/20 p-6 sm:p-8">
            <p className="text-xs font-black text-brand-primary">CONTOH MOMEN</p>
            <h3 className="mt-2 text-2xl font-extrabold">Hari ini, momen apa yang ingin dijadikan cerita?</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm font-bold">
              <span className="rounded-xl bg-white p-3">🌙 Rutinitas tidur</span>
              <span className="rounded-xl bg-white p-3">🥦 Semangat makan sayur</span>
              <span className="rounded-xl bg-white p-3">🏫 Siap berangkat sekolah</span>
              <span className="rounded-xl bg-white p-3">📱 Atur waktu layar</span>
            </div>
          </div>
          <div className="rounded-[2rem] bg-surface-card p-6 ring-1 ring-black/5 sm:p-8">
            <p className="text-xs font-black text-brand-primary">HASIL PENGALAMAN</p>
            <h3 className="mt-2 text-2xl font-extrabold">Anak menjadi bagian dari ceritanya sendiri.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">Nama, usia, foto, karakter, dan pilihan tema digunakan untuk membantu membuat cerita lebih personal. Teks dapat direview sebelum ilustrasi dan audio dibuat.</p>
            <div className="mt-5 rounded-2xl bg-surface p-4 text-sm font-semibold">📖 Flipbook · 🎧 Audio · 🎨 Ilustrasi · 💛 Moral & doa</div>
          </div>
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
            <h2 className="mt-2 text-3xl font-extrabold">Satu paket untuk mulai membangun kebiasaan membaca yang lebih personal.</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">Paket awal memberi 2 cerita personal. Jika nanti membutuhkan cerita tambahan, top-up tersedia dari akun member yang sudah login.</p>
          </div>
          <div className="space-y-3">
            {benefits.map(b=><div key={b} className="flex gap-3 rounded-2xl bg-surface-card p-4 ring-1 ring-black/5"><span>✅</span><span className="font-bold">{b}</span></div>)}
          </div>
        </div>
      </div>
    </section>

    <section className="bg-brand-primary px-5 py-16 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-black uppercase tracking-widest opacity-80">Mulai dari cerita pertama</p>
        <h2 className="mt-3 text-4xl font-extrabold">2 cerita personal + akses 1 tahun, Rp50.000.</h2>
        <p className="mx-auto mt-4 max-w-xl opacity-90">Untuk anak sendiri atau hadiah. Setelah pembayaran terverifikasi, akses diberikan ke Email Penerima yang Anda tentukan sebelum checkout.</p>
        <CheckoutButton label="Mulai Sekarang — Rp50.000" className="mt-7 inline-flex rounded-full bg-white px-7 py-4 font-extrabold text-brand-primary shadow-lg"/>
      </div>
    </section>

    <section className="px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold">Pertanyaan yang sering ditanyakan</h2>
        <div className="mt-6 space-y-3">
          {[
            ["Apa yang saya dapat setelah membeli?","Akses Papa Bonski Super Kids selama 1 tahun dan kuota awal 2 cerita personal, termasuk ilustrasi, audio narasi, moral, doa, panduan orang tua, koleksi, dan bonus English Learning."],
            ["Email Penerima itu apa?","Email Penerima adalah email yang memiliki akses Papa Bonski dan selalu digunakan untuk login OTP. Jika membeli untuk diri sendiri, Email Pembeli dan Email Penerima boleh sama."],
            ["Bisa dibelikan untuk orang lain?","Bisa. Tentukan Email Penerima milik orang tua atau wali yang akan menggunakan Papa Bonski. Email Pembeli di OrderHero boleh berbeda."],
            ["Apa yang terjadi setelah pembayaran?","Setelah pembayaran terverifikasi, paket otomatis diaktifkan untuk Email Penerima. Pemilik akses kemudian login dengan kode OTP 6 digit."],
            ["Kalau 2 cerita sudah terpakai?","Pemilik akun dapat login lalu membeli tambahan +3 atau +8 cerita. Top-up masuk otomatis ke akun yang sedang login."],
            ["Apakah harus install dari Play Store?","Tidak. Papa Bonski dapat digunakan langsung dari browser dan juga dapat dipasang ke layar utama HP atau tablet."],
          ].map(([q,a])=>
            <details key={q} className="rounded-2xl bg-surface-card p-5 ring-1 ring-black/5">
              <summary className="cursor-pointer font-extrabold">{q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>
          )}
        </div>
      </div>
    </section>

    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 p-3 shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0 flex-1"><b className="block text-sm">2 cerita + akses 1 tahun</b><span className="text-xs text-ink-soft">Rp50.000</span></div>
        <CheckoutButton label="Mulai" className="rounded-full bg-brand-primary px-6 py-3 text-sm font-extrabold text-white"/>
      </div>
    </div>
  </main>
}
