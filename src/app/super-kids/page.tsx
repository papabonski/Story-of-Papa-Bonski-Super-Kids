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
  "Moral, doa & panduan orang tua",
  "Koleksi cerita yang bisa dibaca ulang",
  "Bonus video pembelajaran Bahasa Inggris",
];

const parentConcerns=[
  {
    icon:"📱",
    hook:"Gadget selalu jadi rebutan?",
    concern:"Saat layar dimatikan, anak sulit beralih ke kegiatan lain atau cepat kesal.",
    solution:"Jadikan screen time sebagai tema cerita. Anak diajak melihat kebiasaan layar melalui dirinya sendiri sebagai tokoh utama, lalu orang tua dapat memasukkan batas dan pesan yang ingin dibicarakan.",
  },
  {
    icon:"💛",
    hook:"Anak masih sulit mengelola emosi?",
    concern:"Marah, sulit menunggu giliran, enggan berbagi, atau belum nyaman beradaptasi dengan teman.",
    solution:"Pilih situasi yang sedang dialami anak dan tuangkan respons yang ingin dilatih ke dalam cerita. Cerita menjadi pembuka percakapan yang lebih dekat, bukan ceramah satu arah.",
  },
  {
    icon:"🌟",
    hook:"Anak mudah minder atau takut mencoba?",
    concern:"Ia mulai membandingkan diri, bergantung pada pujian, atau ragu pada kemampuannya sendiri.",
    solution:"Tempatkan anak sebagai tokoh utama yang belajar mencoba, mengenali kekuatannya, dan merasa aman dicintai. Anda dapat mereview setiap bagian sebelum ilustrasi dan audio dibuat.",
  },
  {
    icon:"🥦",
    hook:"Waktu makan dan tidur jadi perjuangan?",
    concern:"Pilih-pilih makanan, sulit tidur teratur, atau kurang tertarik pada kebiasaan sehat.",
    solution:"Ubah rutinitas makan, tidur, dan bergerak menjadi petualangan personal. Pesan keluarga hadir dalam pengalaman yang bisa dibaca dan didengarkan bersama.",
  },
  {
    icon:"🛡️",
    hook:"Bagaimana saat Anda tidak selalu di sisinya?",
    concern:"Sekolah, teman, bullying, dan pengaruh luar membuat orang tua ingin membekali anak dengan pegangan yang kuat.",
    solution:"Tuangkan nilai seperti jujur, berani berkata tidak, sopan, berempati, dan meminta bantuan ke dalam cerita yang dekat dengan dunianya.",
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
          <span className="inline-flex rounded-full bg-brand-accent/40 px-4 py-2 text-xs font-black uppercase tracking-wider">Tuangkan nilai-nilai hidup Anda untuk si kecil</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.06] sm:text-5xl lg:text-6xl">Anak Jadi Tokoh Utama</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            Jadikan si kecil kesayangan Anda tokoh utama dalam ceritanya sendiri. Pilih momen yang sedang dekat dengannya, lalu tuangkan nilai-nilai hidup Anda melalui cerita personal bergambar dan audio.
          </p>

          <div className="mt-7 grid gap-2 text-sm font-bold sm:grid-cols-2">
            {["Anak menjadi tokoh utama","Cerita sesuai momen hari ini","Ilustrasi + audio narasi","Moral, doa & panduan orang tua"].map(item=>
              <div key={item} className="flex items-center gap-2"><span className="text-emerald-600">✓</span><span>{item}</span></div>
            )}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#cara-kerja" className="btn-primary text-center">Pelajari Selengkapnya</a>
            <CheckoutButton label="Buat Cerita Pertama — Rp25.000" className="btn-secondary text-center"/>
          </div>
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
          ["📖","Bukan hanya sekali baca","Cerita tersimpan di Koleksi dan dapat dibuka kembali selama akses aktif."],
          ["🎧","Bisa dibaca atau didengarkan","Nikmati teks, ilustrasi, dan audio narasi dalam satu pengalaman."],
        ].map(([icon,title,desc])=><div key={title}><div className="text-3xl">{icon}</div><h2 className="mt-2 font-extrabold">{title}</h2><p className="mt-1 text-sm leading-relaxed text-ink-soft">{desc}</p></div>)}
      </div>
    </section>

    <section className="px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Yang sering membuat ibu khawatir</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-extrabold">Nilai yang ingin Anda tanamkan bisa dimulai dari cerita yang dekat dengannya.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-ink-soft">Papa Bonski membantu mengubah momen keseharian menjadi bahan percakapan antara orang tua dan anak. Anda memilih pesannya, anak menjadi tokoh utamanya.</p>
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
        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-relaxed text-ink-faint">Papa Bonski adalah media cerita dan pendamping percakapan keluarga, bukan pengganti bantuan profesional apabila anak mengalami masalah yang membutuhkan penanganan khusus.</p>
      </div>
    </section>

    <section id="cara-kerja" className="bg-white/70 px-5 py-16">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-black uppercase tracking-widest text-brand-primary">Cerita yang dekat dengan kehidupan si kecil</p>
        <h2 className="mx-auto mt-2 max-w-3xl text-center text-3xl font-extrabold">Tuangkan nilai-nilai hidup Anda melalui momen yang sedang dekat dengannya.</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-ink-soft">Apakah itu kebiasaan tidurnya, kebiasaan makannya, motivasinya untuk belajar, atau cara mengatur waktu layar. Momen keseharian menjadi cerita yang lebih mudah dirasakan oleh anak.</p>
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
            <h3 className="mt-2 text-2xl font-extrabold">Anda tetap memegang kendali atas pesan ceritanya.</h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">Nama, usia, foto, karakter, dan pilihan tema membantu membuat cerita lebih personal. Anda dapat mereview dan menyempurnakan cerita untuk menuangkan nilai-nilai hidup Anda sebelum ilustrasi dan audio dibuat.</p>
            <div className="mt-5 rounded-2xl bg-surface p-4 text-sm font-semibold">📖 Flipbook · 🎧 Audio · 🎨 Ilustrasi · 💛 Moral & doa</div>
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
            <h2 className="mt-2 text-3xl font-extrabold">Satu paket untuk mulai membangun kebiasaan membaca yang lebih personal.</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">Paket awal memberi 1 cerita personal. Jika nanti membutuhkan cerita tambahan, tersedia Paket Bertumbuh +3 cerita dan Paket Keluarga +8 cerita dari akun member yang sudah login.</p>
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
        <h2 className="mt-3 text-4xl font-extrabold">Tuangkan nilai-nilai hidup Anda dalam cerita si kecil.</h2>
        <p className="mx-auto mt-4 max-w-xl opacity-90">Dapatkan 1 cerita personal bergambar dan audio. Kuota tidak kedaluwarsa, hanya Rp25.000.</p>
        <CheckoutButton label="Buat Cerita Pertama — Rp25.000" className="mt-7 inline-flex rounded-full bg-white px-7 py-4 font-extrabold text-brand-primary shadow-lg"/>
      </div>
    </section>

    <section className="px-5 py-14">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl font-extrabold">Pertanyaan yang sering ditanyakan</h2>
        <div className="mt-6 space-y-3">
          {[
            ["Apa yang saya dapat setelah membeli?","Kuota awal 1 cerita personal, termasuk ilustrasi, audio narasi, moral, doa, panduan orang tua, koleksi, dan bonus English Learning. Kuota cerita tidak kedaluwarsa."],
            ["Email Penerima itu apa?","Email Penerima adalah email yang memiliki akses Papa Bonski dan selalu digunakan untuk login OTP. Jika membeli untuk diri sendiri, Email Pembeli dan Email Penerima boleh sama."],
            ["Bisa dibelikan untuk orang lain?","Bisa. Tentukan Email Penerima milik orang tua atau wali yang akan menggunakan Papa Bonski. Email Pembeli di OrderHero boleh berbeda."],
            ["Apa yang terjadi setelah pembayaran?","Setelah pembayaran terverifikasi, paket otomatis diaktifkan untuk Email Penerima. Pemilik akses kemudian login dengan kode OTP 6 digit."],
            ["Kalau cerita pertama sudah terpakai?","Pemilik akun dapat login lalu membeli Paket Bertumbuh +3 cerita seharga Rp60.000 atau Paket Keluarga +8 cerita seharga Rp120.000. Top-up masuk otomatis ke akun yang sedang login."],
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
        <div className="min-w-0 flex-1"><b className="block text-sm">1 cerita personal</b><span className="text-xs text-ink-soft">Rp25.000 · kuota tidak kedaluwarsa</span></div>
        <CheckoutButton label="Mulai" className="rounded-full bg-brand-primary px-6 py-3 text-sm font-extrabold text-white"/>
      </div>
    </div>
  </main>
}
