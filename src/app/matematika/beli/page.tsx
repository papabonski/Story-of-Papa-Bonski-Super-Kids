import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FunnelTracker from "@/components/marketing/FunnelTracker";

export const metadata: Metadata = {
  title: "Papa Bonski Matematika — Belajar Matematika Seru untuk Anak",
  description: "Game matematika anak usia 6–12 tahun dengan empat level, soal acak, mode bermain bersama, bintang, dan lencana.",
};

const levels = [
  { n: "1", title: "Basic Math", age: "Usia 6–7 tahun", note: "Dasar berhitung yang ramah untuk pemula.", color: "bg-orange-50 text-orange-800" },
  { n: "2", title: "Daily Math", age: "Usia 8–9 tahun", note: "Matematika sehari-hari yang terasa dekat.", color: "bg-emerald-50 text-emerald-800" },
  { n: "3", title: "Smart Math", age: "Usia 10–12 tahun", note: "Latihan logika dan hitungan yang lebih menantang.", color: "bg-amber-50 text-amber-800" },
  { n: "4", title: "Master Math", age: "Tingkat lanjut", note: "Tantangan lanjutan untuk anak yang siap naik level.", color: "bg-rose-50 text-rose-800" },
];

const subjects = ["Kali & Bagi", "Waktu & Uang", "Pengukuran", "Kelipatan & Faktor", "Pecahan & Bangun", "Soal Cerita", "Campur Semua"];

function BuyButton({ className = "", label = "Dapatkan Akses Rp25.000 →" }: { className?: string; label?: string }) {
  return <Link href="/matematika/checkout" className={`inline-flex items-center justify-center rounded-2xl bg-brand-primary px-6 py-4 text-center font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl ${className}`}>
    {label}
  </Link>;
}

export default function MatematikaSalesPage() {
  return (
    <main className="min-h-[100dvh] bg-[#fff9ef] text-ink">
      <FunnelTracker event="ViewContent" product="PBMAT-MATEMATIKA" value={25000} />

      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#fff9ef]/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-3 font-extrabold">
            <Image src="/matematika-game/assets/icons/icon-192.png" alt="Papa Bonski Matematika" width={48} height={48} className="rounded-xl" priority />
            <span className="hidden sm:inline">Papa Bonski Matematika</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login?next=%2Fapp" className="text-sm font-bold text-ink-soft">Sudah membeli? Login</Link>
            <BuyButton className="hidden !px-4 !py-2.5 text-sm sm:inline-flex" />
          </div>
        </div>
      </header>

      <section className="px-5 py-12 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-brand-primary">Belajar · Bermain · Naik Level</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">Matematika jadi petualangan seru, bukan tugas yang menakutkan.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">Anak berlatih sesuai usia, memilih fokus materi, lalu mengumpulkan bintang dan lencana. Soal diacak agar bermain tetap menantang.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <BuyButton />
              <p className="text-sm font-bold text-ink-soft">Sekali bayar · Akses seumur hidup</p>
            </div>
            <p className="mt-4 text-sm text-ink-soft">Sudah punya Super Kids atau Mandarin? Harga add-on hanya <b>Rp15.000</b> setelah login.</p>
          </div>

          <div className="rounded-[2rem] bg-white p-5 shadow-2xl ring-1 ring-black/[0.06]">
            <div className="rounded-[1.5rem] border-2 border-ink bg-[linear-gradient(#e9e1d4_1px,transparent_1px),linear-gradient(90deg,#e9e1d4_1px,transparent_1px)] bg-[size:28px_28px] p-5 shadow-[0_6px_0_#393743]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Image src="/matematika-game/assets/icons/icon-192.png" alt="" width={52} height={52} className="rounded-xl" />
                  <div><p className="font-extrabold">Papa Bonski Matematika</p><p className="text-xs text-ink-soft">Petualangan berhitung anak SD</p></div>
                </div>
                <span className="rounded-full border-2 border-ink bg-amber-50 px-3 py-1 text-sm font-black">⭐ 536</span>
              </div>
              <div className="mt-6 rounded-2xl border-2 border-ink bg-white p-6 text-center shadow-[0_5px_0_#393743]">
                <p className="text-4xl">⭐</p>
                <h2 className="mt-2 text-2xl font-extrabold">Halo, teman kecil!</h2>
                <p className="mt-2 text-sm text-ink-soft">Siap kumpulkan bintang sebanyak-banyaknya?</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-orange-50 p-4 font-extrabold">👥 Main Bareng</div>
                  <div className="rounded-xl bg-violet-50 p-4 font-extrabold">🎯 Tantangan Teman</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-primary">Lihat cara bermainnya</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Intip keseruan Papa Bonski Matematika</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Saksikan bagaimana anak memilih level, menentukan fokus materi, menjawab soal, dan mengumpulkan bintang.
            </p>
          </div>
          <div className="mt-8 overflow-hidden rounded-[2rem] bg-[#2f2141] p-2 shadow-2xl ring-1 ring-black/10 sm:p-4">
            <video
              className="aspect-video w-full rounded-[1.5rem] bg-black object-contain"
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Video demonstrasi Papa Bonski Matematika"
            >
              <source src="/media/papa-bonski-matematika-demo-web.mp4" type="video/mp4" />
              Browser Anda belum mendukung pemutaran video.
            </video>
          </div>
          <div className="mt-7 flex flex-col items-center gap-3 text-center">
            <BuyButton />
            <p className="text-sm font-bold text-ink-soft">Sekali bayar · Akses seumur hidup</p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-primary">Satu game, bertahap sesuai kemampuan</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Empat level untuk tumbuh bersama anak</h2>
          </div>
          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {levels.map(level => <div key={level.n} className="rounded-3xl border border-black/5 bg-[#fffaf2] p-5 shadow-sm">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-black ${level.color}`}>{level.n}</span>
              <h3 className="mt-4 text-xl font-extrabold">{level.title}</h3>
              <p className="mt-1 text-sm font-bold text-brand-primary">{level.age}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{level.note}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-primary">Latihan terasa relevan</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">Pilih materi yang ingin dilatih hari ini</h2>
            <p className="mt-5 leading-relaxed text-ink-soft">Dari hitungan dasar sampai soal cerita sehari-hari. Anak dapat fokus pada satu materi atau mencampur semuanya untuk tantangan yang lebih beragam.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {subjects.map((subject, index) => <div key={subject} className="flex items-center gap-3 rounded-2xl bg-white p-4 font-extrabold shadow-sm ring-1 ring-black/[0.05]">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50">{["✖️","⏰","📏","🔍","🍰","📖","🎲"][index]}</span>
              {subject}
            </div>)}
          </div>
        </div>
      </section>

      <section className="bg-[#2f2141] px-5 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ["👥", "Bisa main bersama", "Main 2–4 pemain pada satu layar, atau tantang teman menggunakan perangkat berbeda."],
              ["🏅", "Bintang dan lencana", "Hadiah visual membuat kemajuan terasa dan menjaga semangat anak untuk mencoba lagi."],
              ["📲", "Bisa dipasang", "Pasang sebagai aplikasi di perangkat agar mudah dibuka dari layar utama; sebagian pengalaman dapat dimainkan tanpa internet."],
            ].map(([icon,title,copy]) => <div key={title} className="rounded-3xl bg-white/10 p-6 ring-1 ring-white/15">
              <p className="text-4xl">{icon}</p><h3 className="mt-4 text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/75">{copy}</p>
            </div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-16">
        <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white text-center shadow-xl ring-1 ring-black/[0.06]">
          <div className="bg-[#fff1d6] px-7 py-8 sm:px-10 sm:py-10">
            <p className="text-4xl" aria-hidden="true">☕</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
              Bunda nggak ngopi sekali,<br />
              <span className="text-brand-primary">Ananda belajar berkali-kali.</span>
            </h2>
            <p className="mt-5 text-xl font-extrabold leading-relaxed sm:text-2xl">
              Cukup Rp25 ribu sekali bayar,<br />
              seumur hidup bisa belajar.
            </p>
          </div>
          <div className="px-7 py-8 sm:px-10 sm:py-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-primary">Akses seumur hidup</p>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink-soft">Empat level, pilihan fokus materi, soal acak, mode bermain bersama, bintang, dan lencana dalam satu produk.</p>
            <BuyButton className="mt-7 w-full sm:w-auto" label="Kopiku untuk Ananda ☕" />
          </div>
          <p className="px-7 pb-8 text-xs text-ink-soft sm:px-10 sm:pb-10">Member aktif Super Kids atau Mandarin otomatis diarahkan ke harga add-on Rp15.000 setelah email diperiksa.</p>
        </div>
      </section>

      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-extrabold">Pertanyaan yang sering ditanyakan</h2>
          <div className="mt-8 space-y-3">
            {[
              ["Untuk usia berapa?", "Dirancang bertahap untuk anak usia sekitar 6–12 tahun, dengan empat level dari dasar hingga tingkat lanjut."],
              ["Apakah harus berlangganan?", "Tidak. Pembelian memberikan akses seumur hidup ke modul Matematika."],
              ["Bagaimana cara masuk setelah membeli?", "Gunakan email penerima saat checkout. Pada login pertama, kode OTP dikirim ke email tersebut."],
              ["Apakah bisa dipasang di HP atau komputer?", "Ya. Setelah login, aplikasi dapat dipasang pada perangkat yang mendukung agar mudah dibuka dari layar utama."],
            ].map(([q,a]) => <details key={q} className="rounded-2xl bg-[#fff9ef] p-5 ring-1 ring-black/[0.05]">
              <summary className="cursor-pointer font-extrabold">{q}</summary><p className="mt-3 text-sm leading-relaxed text-ink-soft">{a}</p>
            </details>)}
          </div>
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-sm text-ink-soft">© 2026 Papa Bonski · Belajar, bermain, dan bertumbuh bersama.</footer>

      <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
        <BuyButton className="w-full" />
      </div>
    </main>
  );
}
