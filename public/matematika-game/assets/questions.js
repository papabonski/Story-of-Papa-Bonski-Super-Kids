/* Papa Bonski Matematika — Question Engine
   Soal dibuat acak setiap ronde berdasarkan Modul Matematika Anak SD.
   Setiap soal punya penjelasan "cara mengerjakan". */

(function () {
  // Sumber acak yang bisa diganti sementara dengan PRNG berbenih (seed)
  // agar "Kode Tantangan" menghasilkan soal yang sama persis di semua HP.
  var rng = Math.random;
  var R = function (a, b) { return Math.floor(rng() * (b - a + 1)) + a; };
  var pick = function (arr) { return arr[R(0, arr.length - 1)]; };
  var rp = function (n) { return "Rp" + n.toLocaleString("id-ID"); };
  var shuffle = function (a) {
    for (var i = a.length - 1; i > 0; i--) { var j = R(0, i), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };

  /* Bangun soal pilihan ganda: jawaban benar + pengecoh unik */
  function mc(q, correct, wrongs, explain, topic) {
    var opts = [String(correct)];
    wrongs.forEach(function (w) {
      var s = String(w);
      if (opts.indexOf(s) < 0 && opts.length < 4) opts.push(s);
    });
    /* Kurang dari 4 opsi (pengecoh dari pemanggil kembar/bentrok)? Tambal
       dengan pengecoh yang masuk akal. Jika jawabannya bukan angka atau uang,
       lebih baik tampil 3 opsi daripada opsi karangan yang membingungkan. */
    var teks = String(correct);
    var isUang = /^Rp[\d.]+$/.test(teks);
    var base = parseInt(teks, 10);
    var guard = 0;
    while (opts.length < 4 && (isUang || !isNaN(base)) && guard++ < 40) {
      var extra = null;
      if (isUang) {
        var uang = parseInt(teks.replace(/\D/g, ""), 10);
        var step = uang >= 10000 ? 5000 : uang >= 1000 ? 500 : 100;
        var beda = uang + step * R(1, 4) * (rng() < 0.5 ? -1 : 1);
        if (beda > 0) extra = rp(beda);
      } else {
        var v = base + R(1, 9) * (rng() < 0.5 ? -1 : 1);
        if (v >= 0) extra = teks.replace(String(base), String(v));   // pertahankan satuan, mis. "12 cm"
      }
      if (extra && opts.indexOf(extra) < 0) opts.push(extra);
    }
    shuffle(opts);
    return { q: q, opts: opts, ans: opts.indexOf(String(correct)), ex: explain, topic: topic };
  }

  /* ================= LEVEL 1 — BASIC MATH (6-7 th) ================= */
  var L1 = [
    function () { // perbandingan
      var a = R(5, 60), b = R(5, 60);
      var c = a > b ? ">" : (a < b ? "<" : "=");
      var opts = shuffle([">", "<", "="]);
      return {
        q: "Isi tanda yang tepat: " + a + " ... " + b,
        opts: opts, ans: opts.indexOf(c),
        ex: c === "=" ? "Kedua bilangan sama besar, jadi tandanya =." :
          "Bandingkan: " + Math.max(a, b) + " lebih besar dari " + Math.min(a, b) + ". Ingat, mulut buaya selalu terbuka ke bilangan yang lebih besar!",
        topic: "Perbandingan"
      };
    },
    function () { // ganjil genap
      var n = R(10, 99);
      var genap = n % 2 === 0;
      return mc("Bilangan " + n + " termasuk bilangan apa?",
        genap ? "Genap" : "Ganjil",
        [genap ? "Ganjil" : "Genap", "Pecahan", "Desimal"],
        "Lihat angka terakhirnya: " + (n % 10) + ". Angka " + (genap ? "0, 2, 4, 6, 8 berarti genap." : "1, 3, 5, 7, 9 berarti ganjil."),
        "Ganjil dan genap");
    },
    function () { // sebelum-sesudah
      var n = R(11, 98);
      return mc("Bilangan sebelum dan sesudah " + n + " adalah ...",
        (n - 1) + " dan " + (n + 1),
        [(n + 1) + " dan " + (n - 1), (n - 2) + " dan " + (n + 2), n + " dan " + (n + 2)],
        "Sebelum berarti dikurangi 1: " + n + " - 1 = " + (n - 1) + ". Sesudah berarti ditambah 1: " + n + " + 1 = " + (n + 1) + ".",
        "Urutan bilangan");
    },
    function () { // penjumlahan
      var a = R(11, 46), b = R(11, 46);
      var carry = (a % 10 + b % 10) > 9;
      return mc(a + " + " + b + " = ...", a + b, [a + b + 1, a + b - 1, a + b + 10],
        "Jumlahkan satuan dulu: " + (a % 10) + " + " + (b % 10) + " = " + (a % 10 + b % 10) +
        (carry ? " (tulis " + ((a % 10 + b % 10) % 10) + ", simpan 1). " : ". ") +
        "Lalu puluhan: " + Math.floor(a / 10) + " + " + Math.floor(b / 10) + (carry ? " + 1" : "") + ". Hasilnya " + (a + b) + ".",
        "Penjumlahan");
    },
    function () { // pengurangan
      var a = R(30, 95), b = R(11, a - 5);
      var borrow = (a % 10) < (b % 10);
      return mc(a + " - " + b + " = ...", a - b, [a - b + 1, a - b - 1, a - b + 10],
        (borrow ? "Satuan " + (a % 10) + " tidak bisa dikurangi " + (b % 10) + ", pinjam 1 puluhan dulu. " : "Kurangkan satuan, lalu puluhan. ") +
        a + " - " + b + " = " + (a - b) + ".",
        "Pengurangan");
    },
    function () { // pola
      var s = pick([2, 3, 5, 10]), st = R(1, 12);
      var seq = [st, st + s, st + 2 * s, st + 3 * s];
      return mc("Lanjutkan pola: " + seq.join(", ") + ", ...", st + 4 * s,
        [st + 4 * s + 1, st + 4 * s - 1, st + 5 * s],
        "Selisih antar bilangan adalah " + s + ", jadi aturannya +" + s + ". Setelah " + seq[3] + ": " + seq[3] + " + " + s + " = " + (st + 4 * s) + ".",
        "Pola angka");
    },
    function () { // nilai tempat
      var h = R(1, 9), p = R(1, 9), s = R(0, 9), n = h * 100 + p * 10 + s;
      var w = pick([{ d: h, pos: "ratusan", v: h * 100 }, { d: p, pos: "puluhan", v: p * 10 }]);
      return mc("Berapa nilai angka " + w.d + " pada bilangan " + n + "?", w.v,
        [w.d, w.v * 10, w.v + 10],
        "Angka " + w.d + " berada di tempat " + w.pos + ", jadi nilainya " + w.d + " × " + (w.pos === "ratusan" ? 100 : 10) + " = " + w.v + ".",
        "Nilai tempat");
    },
    function () { // soal cerita tambah
      var a = R(4, 25), b = R(4, 25);
      var nama = pick(["Dina", "Budi", "Sinta", "Rara", "Andi"]);
      var benda = pick(["kelereng", "stiker", "permen", "buku"]);
      return mc(nama + " punya " + a + " " + benda + ". Kakak memberi " + b + " lagi. Berapa " + benda + " " + nama + " sekarang?",
        a + b, [a + b - 1, a + b + 2, Math.abs(a - b)],
        "Kata kunci \"memberi lagi\" berarti bertambah, jadi pakai penjumlahan: " + a + " + " + b + " = " + (a + b) + ".",
        "Soal cerita");
    },
    function () { // soal cerita kurang
      var a = R(20, 60), b = R(5, a - 5);
      return mc("Ibu membeli " + a + " telur. Sebanyak " + b + " telur dipakai membuat kue. Berapa sisa telur?",
        a - b, [a - b + 2, a - b - 2, a + b],
        "Kata kunci \"sisa\" berarti pengurangan: " + a + " - " + b + " = " + (a - b) + ".",
        "Soal cerita");
    },
    function () { // bilangan terbesar & terkecil
      var arr = [];
      while (arr.length < 4) { var x = R(11, 99); if (arr.indexOf(x) < 0) arr.push(x); }
      var mode = pick(["terbesar", "terkecil"]);
      var ans = mode === "terbesar" ? Math.max.apply(null, arr) : Math.min.apply(null, arr);
      return mc("Bilangan " + mode + " dari " + arr.join(", ") + " adalah ...",
        ans, arr.filter(function (x) { return x !== ans; }),
        "Bandingkan semua bilangannya. Yang " + mode + " adalah " + ans + ".",
        "Bilangan terbesar & terkecil");
    },
    function () { // melengkapi (number bond)
      var total = R(10, 20), a = R(2, total - 2);
      return mc(a + " + ... = " + total, total - a, [total - a + 1, total - a - 1, total + a],
        "Cari selisihnya: " + total + " - " + a + " = " + (total - a) + ".",
        "Melengkapi");
    },
    function () { // bentuk / jumlah sisi
      var b = pick([{ n: "segitiga", s: 3 }, { n: "persegi", s: 4 }, { n: "persegi panjang", s: 4 }, { n: "segi lima", s: 5 }, { n: "segi enam", s: 6 }]);
      return mc("Berapa jumlah sisi " + b.n + "?", b.s, [b.s + 1, b.s - 1, b.s + 2],
        b.n.charAt(0).toUpperCase() + b.n.slice(1) + " memiliki " + b.s + " sisi.",
        "Bentuk");
    },
    function () { // penjumlahan tiga bilangan
      var a = R(3, 20), b = R(3, 20), c = R(3, 20);
      return mc(a + " + " + b + " + " + c + " = ...", a + b + c, [a + b + c + 1, a + b + c - 2, a + b + c + 10],
        "Jumlahkan bertahap: " + a + " + " + b + " = " + (a + b) + ", lalu + " + c + " = " + (a + b + c) + ".",
        "Penjumlahan berturut");
    },
    function () { // membaca jam dinding
      var h = R(1, 12), setengah = pick([true, false]);
      var next = h === 12 ? 1 : h + 1;
      var f = function (x) { return String(x).padStart(2, "0"); };
      var ans = setengah ? f(h) + ".30" : f(h) + ".00";
      return mc(setengah ?
        "Jarum pendek ada di antara angka " + h + " dan " + next + ", jarum panjang di angka 6. Pukul berapa?" :
        "Jarum pendek tepat di angka " + h + ", jarum panjang di angka 12. Pukul berapa?",
        ans,
        [setengah ? f(h) + ".00" : f(h) + ".30", f(next) + (setengah ? ".30" : ".00"), f(h) + ".15"],
        setengah ?
          "Jarum panjang di angka 6 berarti lewat 30 menit. Jarum pendek belum sampai angka " + next + ", jadi jamnya masih " + h + ". Pukul " + ans + "." :
          "Jarum panjang di angka 12 berarti tepat jam bulat, dan jarum pendek menunjuk angka " + h + ". Jadi pukul " + ans + ".",
        "Jam sederhana");
    },
    function () { // uang & kembalian sederhana
      var harga = R(2, 8) * 500, bayar = 5000, kembali = bayar - harga;
      return mc("Harga " + pick(["permen", "penghapus", "pensil", "roti"]) + " " + rp(harga) +
        ". Kamu membayar dengan uang " + rp(bayar) + ". Berapa kembaliannya?",
        rp(kembali), [rp(kembali + 500), rp(kembali - 500), rp(bayar)],
        "Uang kembali = uang yang dibayar - harga barang. " + rp(bayar) + " - " + rp(harga) + " = " + rp(kembali) + ".",
        "Uang sederhana");
    },
    function () { // menghitung banyak benda
      var ikon = pick(["🍎", "⭐", "🐟", "🎈", "🍬"]);
      var a = R(3, 8), b = R(2, 6);
      var gambar = function (n) { return new Array(n + 1).join(ikon); };
      return mc("Hitung gambarnya: " + gambar(a) + " lalu " + gambar(b) + ". Berapa semuanya?",
        a + b, [a + b + 1, a + b - 1, a * b],
        "Hitung kelompok pertama ada " + a + " gambar, kelompok kedua ada " + b + " gambar. Lalu jumlahkan: " + a + " + " + b + " = " + (a + b) + ".",
        "Menghitung benda");
    },
    function () { // lebih banyak atau lebih sedikit
      var n1 = R(4, 18), n2 = R(4, 18);
      while (n2 === n1) n2 = R(4, 18);
      var nm = shuffle(["Rina", "Tono", "Sari", "Doni"]).slice(0, 2);
      var benda = pick(["balon", "kelereng", "stiker", "permen"]);
      var mode = pick(["banyak", "sedikit"]);
      var ans = mode === "banyak" ? (n1 > n2 ? nm[0] : nm[1]) : (n1 < n2 ? nm[0] : nm[1]);
      var lain = ans === nm[0] ? nm[1] : nm[0];
      return mc(nm[0] + " punya " + n1 + " " + benda + ", " + nm[1] + " punya " + n2 + " " + benda +
        ". Siapa yang lebih " + mode + "?",
        ans, [lain, "Sama banyak", "Tidak bisa ditentukan"],
        "Bandingkan jumlahnya: " + n1 + " dan " + n2 + ". " + Math.max(n1, n2) + " lebih besar dari " + Math.min(n1, n2) +
        ", jadi yang lebih " + mode + " adalah " + ans + ".",
        "Banyak & sedikit");
    }
  ];

  /* ================= LEVEL 2 — DAILY MATH (8-9 th) ================= */
  var L2 = [
    function () { // perkalian
      var a = R(3, 9), b = R(3, 9);
      return mc(a + " × " + b + " = ...", a * b, [a * b + a, a * b - b, a + b],
        a + " × " + b + " artinya " + b + " dijumlahkan sebanyak " + a + " kali. Hasilnya " + (a * b) + ".",
        "Perkalian");
    },
    function () { // pembagian
      var b = R(3, 9), c = R(3, 9), a = b * c;
      return mc(a + " ÷ " + b + " = ...", c, [c + 1, c - 1, b],
        "Ingat kebalikan perkalian: " + b + " × " + c + " = " + a + ", jadi " + a + " ÷ " + b + " = " + c + ".",
        "Pembagian");
    },
    function () { // pembagian bersisa
      var b = R(3, 7), h = R(3, 8), sisa = R(1, b - 1), a = b * h + sisa;
      return mc(a + " ÷ " + b + " = ... sisa ...", h + " sisa " + sisa,
        [(h + 1) + " sisa " + sisa, h + " sisa " + (sisa + 1), (h - 1) + " sisa " + (b - sisa)],
        b + " × " + h + " = " + (b * h) + ", lalu " + a + " - " + (b * h) + " = " + sisa + ". Jadi hasilnya " + h + " sisa " + sisa + ".",
        "Pembagian bersisa");
    },
    function () { // durasi waktu
      var j = R(7, 19), d = pick([1, 2, 3]);
      var f = function (x) { return String(x).padStart(2, "0") + ".00"; };
      return mc("Film mulai pukul " + f(j) + " dan selesai pukul " + f(j + d) + ". Berapa lama filmnya?",
        d + " jam", [(d + 1) + " jam", (d === 1 ? 4 : d - 1) + " jam", d + " menit"],
        "Hitung dari " + f(j) + " ke " + f(j + d) + ", selisihnya " + d + " jam.",
        "Waktu");
    },
    function () { // hari
      var hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
      var i = R(0, 6), maju = R(2, 5);
      return mc("Hari ini " + hari[i] + ". " + maju + " hari lagi hari apa?",
        hari[(i + maju) % 7], [hari[(i + maju + 1) % 7], hari[(i + maju + 6) % 7], hari[(i + maju + 2) % 7]],
        "Hitung maju " + maju + " hari dari " + hari[i] + ", satu per satu, sampai di " + hari[(i + maju) % 7] + ".",
        "Kalender");
    },
    function () { // total belanja
      var a = R(2, 8) * 1000, b = R(2, 8) * 1000 + 500;
      return mc("Roti " + rp(a) + " dan susu " + rp(b) + ". Berapa total belanjanya?",
        rp(a + b), [rp(a + b + 500), rp(a + b - 500), rp(Math.abs(a - b))],
        "Total belanja = jumlahkan semua harga: " + rp(a) + " + " + rp(b) + " = " + rp(a + b) + ".",
        "Uang");
    },
    function () { // kembalian
      var harga = R(3, 15) * 1000 + pick([0, 500]);
      var bayar = harga <= 5000 ? 10000 : (harga <= 10000 ? 15000 : 20000);
      return mc("Belanja " + rp(harga) + ", dibayar dengan " + rp(bayar) + ". Berapa kembaliannya?",
        rp(bayar - harga), [rp(bayar - harga + 500), rp(bayar - harga + 1000), rp(harga)],
        "Kembalian = uang yang dibayarkan dikurangi total belanja: " + rp(bayar) + " - " + rp(harga) + " = " + rp(bayar - harga) + ".",
        "Uang");
    },
    function () { // konversi panjang
      var m = R(2, 9);
      return mc(m + " m = ... cm", m * 100, [m * 10, m * 1000, m * 100 + 10],
        "1 m = 100 cm, jadi " + m + " m = " + m + " × 100 = " + (m * 100) + " cm.",
        "Pengukuran");
    },
    function () { // konversi berat
      var kg = R(2, 6);
      return mc(kg + " kg = ... gram", (kg * 1000).toLocaleString("id-ID"),
        [(kg * 100).toLocaleString("id-ID"), (kg * 10000).toLocaleString("id-ID"), (kg * 1000 + 100).toLocaleString("id-ID")],
        "1 kg = 1.000 g, jadi " + kg + " kg = " + kg + " × 1.000 = " + (kg * 1000).toLocaleString("id-ID") + " g.",
        "Berat");
    },
    function () { // soal cerita perkalian
      var k = R(3, 6), isi = R(4, 12);
      return mc("Ada " + k + " kotak pensil, tiap kotak berisi " + isi + " pensil. Jumlah semua pensil = ...",
        k * isi, [k * isi + k, k + isi, k * isi - isi],
        "Kata kunci \"tiap kotak berisi sama\" berarti perkalian: " + k + " × " + isi + " = " + (k * isi) + " pensil.",
        "Soal cerita");
    },
    function () { // menabung
      var setor = pick([1000, 2000, 5000]), hari = R(4, 7);
      return mc("Dio menabung " + rp(setor) + " setiap hari selama " + hari + " hari. Berapa tabungan Dio?",
        rp(setor * hari), [rp(setor * (hari + 1)), rp(setor * (hari - 1)), rp(setor + hari * 100)],
        "Tabungan = setoran × jumlah hari = " + rp(setor) + " × " + hari + " = " + rp(setor * hari) + ".",
        "Uang");
    },
    function () { // kelipatan
      var k = pick([3, 4, 5, 6, 7, 8, 9]), m = R(2, 8), n = k * m;
      return mc("Kelipatan " + k + " setelah " + n + " adalah ...", n + k, [n + k + 1, n + k - 1, n + 2 * k],
        "Kelipatan " + k + " bertambah " + k + " tiap langkah: " + n + " + " + k + " = " + (n + k) + ".",
        "Kelipatan");
    },
    function () { // faktor
      var n = pick([12, 16, 18, 20, 24, 28, 30, 36]);
      var factors = []; for (var i = 2; i < n; i++) if (n % i === 0) factors.push(i);
      var ans = pick(factors);
      var wrongs = [], guard = 0;
      while (wrongs.length < 3 && guard++ < 80) {
        var w = R(2, n - 1);
        if (n % w !== 0 && wrongs.indexOf(w) < 0) wrongs.push(w);
      }
      return mc("Manakah faktor dari " + n + "?", ans, wrongs,
        ans + " membagi habis " + n + " (" + ans + " × " + (n / ans) + " = " + n + "), jadi " + ans + " adalah faktor " + n + ".",
        "Faktor");
    },
    function () { // pembulatan
      var to = pick([10, 100]);
      var n = to === 10 ? R(16, 99) : R(151, 899);   // jaga agar pengecoh tidak nol/negatif
      var rounded = Math.round(n / to) * to;
      var sisa = n % to;
      return mc("Bulatkan " + n + " ke " + to + " terdekat = ...", rounded, [rounded + to, rounded - to, n],
        "Lihat sisanya (" + sisa + "). Karena " + (sisa >= to / 2 ? "≥ " + (to / 2) + ", dibulatkan ke atas" : "< " + (to / 2) + ", dibulatkan ke bawah") + " menjadi " + rounded + ".",
        "Pembulatan");
    },
    function () { // kapasitas (liter - ml)
      var l = R(2, 9);
      return mc(l + " liter = ... ml", (l * 1000).toLocaleString("id-ID"),
        [(l * 100).toLocaleString("id-ID"), (l * 10000).toLocaleString("id-ID"), (l * 1000 + 100).toLocaleString("id-ID")],
        "1 liter = 1.000 ml, jadi " + l + " liter = " + l + " × 1.000 = " + (l * 1000).toLocaleString("id-ID") + " ml.",
        "Kapasitas");
    },
    function () { // pecahan sederhana dari sejumlah benda
      var m = pick([{ p: "1/2", d: 2, kata: "setengah" }, { p: "1/4", d: 4, kata: "seperempat" }, { p: "1/3", d: 3, kata: "sepertiga" }]);
      var n = R(2, 9) * m.d, benda = pick(["kue", "apel", "permen", "kelereng"]);
      return mc(m.p + " (" + m.kata + ") dari " + n + " " + benda + " adalah ...",
        n / m.d, [n / m.d + 1, n / m.d - 1, n],
        m.kata.charAt(0).toUpperCase() + m.kata.slice(1) + " berarti dibagi " + m.d + " sama banyak: " +
        n + " ÷ " + m.d + " = " + (n / m.d) + " " + benda + ".",
        "Pecahan sederhana");
    },
    function () { // keliling persegi & persegi panjang
      if (pick([1, 2]) === 1) {
        var s = R(5, 15);
        return mc("Keliling persegi dengan sisi " + s + " cm = ...", (4 * s) + " cm",
          [(s * s) + " cm", (2 * s) + " cm", (4 * s + 4) + " cm"],
          "Keliling persegi = 4 × sisi = 4 × " + s + " = " + (4 * s) + " cm.",
          "Keliling bangun");
      }
      var p = R(6, 15), l = R(2, 5);
      return mc("Keliling persegi panjang dengan panjang " + p + " cm dan lebar " + l + " cm = ...",
        (2 * (p + l)) + " cm",
        [(p + l) + " cm", (2 * p + l) + " cm", (2 * (p + l) + 2) + " cm"],
        "Keliling = 2 × (panjang + lebar) = 2 × (" + p + " + " + l + ") = 2 × " + (p + l) + " = " + (2 * (p + l)) + " cm.",
        "Keliling bangun");
    },
    function () { // konversi satuan waktu
      var mode = pick(["jam", "menit", "hari", "minggu"]);
      if (mode === "jam") {
        var j = R(2, 6);
        return mc(j + " jam = ... menit", j * 60, [j * 30, j * 60 + 60, j * 100],
          "1 jam = 60 menit, jadi " + j + " × 60 = " + (j * 60) + " menit.", "Konversi waktu");
      }
      if (mode === "menit") {
        var mn = R(2, 8);
        return mc(mn + " menit = ... detik", mn * 60, [mn * 30, mn * 100, mn * 60 - 60],
          "1 menit = 60 detik, jadi " + mn + " × 60 = " + (mn * 60) + " detik.", "Konversi waktu");
      }
      if (mode === "hari") {
        var h = R(2, 7);
        return mc(h + " hari = ... jam", h * 24, [h * 12, h * 24 + 24, h * 10],
          "1 hari = 24 jam, jadi " + h + " × 24 = " + (h * 24) + " jam.", "Konversi waktu");
      }
      var w = R(2, 6);
      return mc(w + " minggu = ... hari", w * 7, [w * 5, w * 7 + 7, w * 10],
        "1 minggu = 7 hari, jadi " + w + " × 7 = " + (w * 7) + " hari.", "Konversi waktu");
    },
    function () { // suhu naik & turun
      var awal = R(18, 30), naik = pick([true, false]), beda = R(2, 9);
      var akhir = naik ? awal + beda : awal - beda;
      return mc("Suhu ruangan " + awal + "°C, lalu " + (naik ? "naik" : "turun") + " " + beda + "°C. Berapa suhunya sekarang?",
        akhir + "°C", [(naik ? awal - beda : awal + beda) + "°C", (akhir + 1) + "°C", awal + "°C"],
        "Suhu " + (naik ? "naik berarti ditambah: " + awal + " + " + beda : "turun berarti dikurangi: " + awal + " - " + beda) +
        " = " + akhir + "°C.",
        "Suhu");
    }
  ];

  /* ================= LEVEL 3 — SMART MATH (10-12 th) ================= */
  var L3 = [
    function () { // pecahan ke desimal
      var p = pick([{ f: "1/2", d: "0,5" }, { f: "1/4", d: "0,25" }, { f: "3/4", d: "0,75" }, { f: "1/10", d: "0,1" }]);
      return mc("Pecahan " + p.f + " sama dengan desimal ...", p.d,
        ["0,2", "0,4", "0,35", "0,15", "0,05"].filter(function (x) { return x !== p.d; }).slice(0, 3),
        p.f + " artinya pembilang dibagi penyebut, hasilnya " + p.d + ".",
        "Desimal");
    },
    function () { // banding pecahan
      var pen = pick([5, 6, 7, 8, 9]), a = R(1, pen - 2), b = R(a + 1, pen - 1);
      return mc("Mana yang lebih besar: " + a + "/" + pen + " atau " + b + "/" + pen + "?",
        b + "/" + pen, [a + "/" + pen, "Sama besar", "Tidak bisa dibandingkan"],
        "Penyebutnya sama (" + pen + "), jadi bandingkan pembilangnya: " + b + " > " + a + ". Maka " + b + "/" + pen + " lebih besar.",
        "Pecahan");
    },
    function () { // pecahan dari bilangan
      var mode = pick([{ p: "1/2", div: 2 }, { p: "1/4", div: 4 }]);
      var n = R(2, 10) * mode.div;
      return mc(mode.p + " dari " + n + " = ...", n / mode.div,
        [n / mode.div + 2, n / mode.div + 1, n],
        mode.p + " dari " + n + " berarti " + n + " ÷ " + mode.div + " = " + (n / mode.div) + ".",
        "Pecahan");
    },
    function () { // persen
      var mode = pick([{ p: "50%", div: 2 }, { p: "25%", div: 4 }]);
      var n = R(2, 25) * mode.div;
      return mc(mode.p + " dari " + n + " = ...", n / mode.div,
        [n / mode.div + 5, n, n / mode.div - 2],
        mode.p + " sama dengan 1/" + mode.div + ", jadi " + n + " ÷ " + mode.div + " = " + (n / mode.div) + ".",
        "Persentase");
    },
    function () { // diskon
      var h = pick([20, 40, 60, 80]) * 1000;
      var d = pick([{ p: "50%", div: 2 }, { p: "25%", div: 4 }]);
      var hasil = h - h / d.div;
      return mc("Mainan " + rp(h) + " didiskon " + d.p + ". Berapa harga setelah diskon?",
        rp(hasil), [rp(h / d.div), rp(hasil + 5000), rp(h)],
        "Potongan = " + d.p + " × " + rp(h) + " = " + rp(h / d.div) + ". Harga baru = " + rp(h) + " - " + rp(h / d.div) + " = " + rp(hasil) + ".",
        "Diskon");
    },
    function () { // operasi campuran
      var a = R(2, 9), b = R(2, 6), c = R(2, 9);
      return mc(c + " + " + a + " × " + b + " = ...", c + a * b,
        [(c + a) * b, c + a * b - a, c + a + b],
        "Perkalian dikerjakan lebih dulu: " + a + " × " + b + " = " + (a * b) + ". Lalu " + c + " + " + (a * b) + " = " + (c + a * b) + ".",
        "Operasi campuran");
    },
    function () { // kurung
      var a = R(5, 12), b = R(2, a - 1), c = R(2, 5);
      return mc("(" + a + " - " + b + ") × " + c + " = ...", (a - b) * c,
        [(a - b) * c + c, (a + b) * c, a * c - b],
        "Kerjakan tanda kurung dulu: " + a + " - " + b + " = " + (a - b) + ". Lalu " + (a - b) + " × " + c + " = " + ((a - b) * c) + ".",
        "Operasi campuran");
    },
    function () { // keliling persegi
      var s = R(4, 12);
      return mc("Keliling persegi dengan sisi " + s + " cm adalah ...",
        (4 * s) + " cm", [(s * s) + " cm", (2 * s) + " cm", (4 * s + 4) + " cm"],
        "Persegi punya 4 sisi sama panjang. Keliling = 4 × " + s + " = " + (4 * s) + " cm.",
        "Geometri");
    },
    function () { // luas persegi panjang
      var p = R(5, 12), l = R(3, p - 1);
      return mc("Luas persegi panjang " + p + " cm × " + l + " cm = ...",
        (p * l) + " cm²", [(2 * (p + l)) + " cm²", (p * l + p) + " cm²", (p + l) + " cm²"],
        "Luas = panjang × lebar = " + p + " × " + l + " = " + (p * l) + " cm².",
        "Geometri");
    },
    function () { // logika jumlah-selisih
      var d = pick([2, 4, 6]), x = R(6, 14);
      var big = x + d, small = x;
      return mc("Dua bilangan jumlahnya " + (big + small) + " dan selisihnya " + d + ". Bilangan itu adalah ...",
        big + " dan " + small,
        [(big + 1) + " dan " + (small - 1), (big + d) + " dan " + small, (big - 1) + " dan " + (small + 1)],
        "Coba-coba dengan tabel: " + big + " + " + small + " = " + (big + small) + " dan " + big + " - " + small + " = " + d + ". Cocok!",
        "Logika");
    },
    function () { // data
      var a = R(5, 15), b = R(5, 15), c = R(5, 15);
      while (b === a) b = R(5, 15);
      while (c === a || c === b) c = R(5, 15);
      var max = Math.max(a, b, c);
      var nama = max === a ? "Apel" : (max === b ? "Mangga" : "Jeruk");
      return mc("Data buah favorit kelas: Apel " + a + " anak, Mangga " + b + " anak, Jeruk " + c + " anak. Buah apa yang paling disukai?",
        nama, ["Apel", "Mangga", "Jeruk"].filter(function (x) { return x !== nama; }),
        "Bandingkan ketiganya: " + max + " adalah yang terbanyak, jadi " + nama.toLowerCase() + " paling disukai.",
        "Data dan grafik");
    },
    function () { // fibonacci sederhana
      var a = 1, b = 1, seq = [a, b];
      for (var i = 0; i < 4; i++) { seq.push(seq[seq.length - 1] + seq[seq.length - 2]); }
      var ans = seq[seq.length - 1] + seq[seq.length - 2];
      return mc("Lanjutkan pola logika: " + seq.join(", ") + ", ...",
        ans, [ans + 1, ans - 2, seq[seq.length - 1] + 2],
        "Setiap bilangan adalah jumlah dua bilangan sebelumnya: " + seq[seq.length - 2] + " + " + seq[seq.length - 1] + " = " + ans + ".",
        "Logika");
    },
    function () { // bilangan bulat (negatif)
      if (pick([1, 2]) === 1) {
        var a = R(1, 9), b = R(a + 1, 15);
        return mc(a + " - " + b + " = ...", a - b, [b - a, a - b + 1, -(a + b)],
          "Karena " + a + " lebih kecil dari " + b + ", hasilnya bilangan negatif: " + a + " - " + b + " = " + (a - b) + ".",
          "Bilangan bulat");
      }
      var x = R(2, 9), c = R(x + 1, 15);
      return mc("(-" + x + ") + " + c + " = ...", c - x, [-(c - x), -(c + x), c + x],
        "Mulai dari -" + x + ", naik " + c + " langkah pada garis bilangan: hasilnya " + (c - x) + ".",
        "Bilangan bulat");
    },
    function () { // rata-rata
      var count = pick([3, 4]), avg = R(6, 20), vals = [], sum = 0;
      for (var i = 0; i < count - 1; i++) { var v = avg + R(-2, 2); vals.push(v); sum += v; }
      vals.push(avg * count - sum);
      return mc("Rata-rata dari " + shuffle(vals.slice()).join(", ") + " = ...", avg, [avg + 1, avg - 1, avg * count],
        "Rata-rata = jumlah data ÷ banyak data = " + (avg * count) + " ÷ " + count + " = " + avg + ".",
        "Rata-rata");
    },
    function () { // KPK & FPB
      var p = pick([[4, 6], [6, 8], [3, 9], [4, 10], [6, 9], [8, 12], [5, 10], [6, 4]]);
      var a = p[0], b = p[1];
      var gcd = function (x, y) { while (y) { var t = y; y = x % y; x = t; } return x; };
      var fpb = gcd(a, b), kpk = a * b / fpb;
      var isKpk = pick([true, false]);
      var ans = isKpk ? kpk : fpb;
      return mc((isKpk ? "KPK" : "FPB") + " dari " + a + " dan " + b + " = ...", ans,
        [isKpk ? fpb : kpk, ans + 1, ans - 1],
        isKpk ? "KPK = kelipatan persekutuan terkecil dari " + a + " dan " + b + ", yaitu " + kpk + "." :
          "FPB = faktor persekutuan terbesar dari " + a + " dan " + b + ", yaitu " + fpb + ".",
        "KPK dan FPB");
    },
    function () { // perpangkatan & akar
      var n = R(2, 12);
      if (pick([1, 2]) === 1) {
        return mc(n + "² = ...", n * n, [n * 2, n * n + 1, n * n - n],
          n + "² artinya " + n + " × " + n + " = " + (n * n) + ".",
          "Perpangkatan");
      }
      var sq = n * n;
      return mc("√" + sq + " = ...", n, [n + 1, n - 1, sq / 2],
        "√" + sq + " adalah bilangan yang bila dikuadratkan menjadi " + sq + ". Yaitu " + n + ", karena " + n + " × " + n + " = " + sq + ".",
        "Perpangkatan");
    },
    function () { // bilangan prima
      var prima = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
      var bukan = [9, 15, 21, 25, 27, 33, 35, 39, 49, 51];
      if (pick([1, 2]) === 1) {
        var p = pick(prima);
        return mc("Manakah yang termasuk bilangan prima?", p, shuffle(bukan.slice()).slice(0, 3),
          "Bilangan prima hanya punya dua pembagi: 1 dan dirinya sendiri. " + p + " memenuhi itu, jadi " + p + " bilangan prima.",
          "Bilangan prima");
      }
      var b = pick(bukan), f = 0;
      for (var i = 2; i < b; i++) if (b % i === 0) { f = i; break; }
      return mc("Apakah " + b + " termasuk bilangan prima?", "Bukan, karena bisa dibagi " + f,
        ["Ya, karena ganjil", "Ya, karena bukan bilangan genap", "Bukan, karena bilangan genap"],
        b + " bisa dibagi " + f + " (" + f + " × " + (b / f) + " = " + b + "). Karena punya pembagi selain 1 dan dirinya sendiri, " +
        b + " bukan bilangan prima.",
        "Bilangan prima");
    },
    function () { // skala pada denah / peta
      var skala = pick([100, 200, 500, 1000]), cm = R(2, 12);
      var meter = cm * skala / 100;
      return mc("Sebuah denah berskala 1 : " + skala + ". Jarak dua tempat pada denah " + cm + " cm. Jarak sebenarnya = ...",
        meter + " m", [(meter * 10) + " m", (meter + 1) + " m", (cm * skala) + " m"],
        "Skala 1 : " + skala + " berarti 1 cm pada denah = " + skala + " cm sebenarnya. Jadi " + cm + " × " + skala + " = " +
        (cm * skala) + " cm, lalu dibagi 100 menjadi " + meter + " m.",
        "Skala dan denah");
    },
    function () { // rasio / perbandingan a : b
      var k = R(2, 9), a = pick([1, 2, 3]), b = pick([2, 3, 4, 5]);
      while (b === a) b = pick([2, 3, 4, 5]);
      var total = (a + b) * k, bagian = a * k;
      var nm = shuffle(["Andi", "Budi", "Sinta", "Rara"]).slice(0, 2);
      return mc("Kelereng " + nm[0] + " dan " + nm[1] + " berbanding " + a + " : " + b + ". Jika seluruhnya " + total +
        " kelereng, berapa kelereng " + nm[0] + "?",
        bagian, [b * k, total - a, bagian + k],
        "Jumlah angka perbandingan = " + a + " + " + b + " = " + (a + b) + ". Nilai satu bagian = " + total + " ÷ " + (a + b) +
        " = " + k + ". Bagian " + nm[0] + " = " + a + " × " + k + " = " + bagian + ".",
        "Rasio");
    },
    function () { // luas segitiga
      var alas = R(4, 20), t = pick([4, 6, 8, 10, 12]);
      var luas = alas * t / 2;
      return mc("Luas segitiga dengan alas " + alas + " cm dan tinggi " + t + " cm = ...", luas + " cm²",
        [(alas * t) + " cm²", (alas + t) + " cm²", (luas + alas) + " cm²"],
        "Luas segitiga = (alas × tinggi) ÷ 2 = (" + alas + " × " + t + ") ÷ 2 = " + (alas * t) + " ÷ 2 = " + luas + " cm².",
        "Luas segitiga");
    }
  ];

  /* ================= LEVEL 4 — MASTER MATH (11-12 th, lanjut) ================= */
  var L4 = [
    function () { // aljabar sederhana
      var x = R(2, 15);
      if (pick([1, 2]) === 1) {
        var b = R(2, 20);
        return mc("Jika x + " + b + " = " + (x + b) + ", maka x = ...", x, [x + 1, x - 1, x + b],
          "Kurangi kedua ruas dengan " + b + ": x = " + (x + b) + " - " + b + " = " + x + ".",
          "Aljabar");
      }
      var a = R(2, 9);
      return mc("Jika " + a + "x = " + (a * x) + ", maka x = ...", x, [x + 1, x - 1, a * x],
        "Bagi kedua ruas dengan " + a + ": x = " + (a * x) + " ÷ " + a + " = " + x + ".",
        "Aljabar");
    },
    function () { // perbandingan senilai
      var per = pick([1000, 1500, 2000, 2500, 3000]), q1 = R(2, 4), q2 = R(5, 9);
      return mc(q1 + " buku harganya " + rp(per * q1) + ". Berapa harga " + q2 + " buku?",
        rp(per * q2), [rp(per * q2 + per), rp(per * q2 - per), rp(per * q1 * q2)],
        "Harga 1 buku = " + rp(per * q1) + " ÷ " + q1 + " = " + rp(per) + ". Maka " + q2 + " buku = " + q2 + " × " + rp(per) + " = " + rp(per * q2) + ".",
        "Perbandingan senilai");
    },
    function () { // volume kubus / balok
      if (pick([1, 2]) === 1) {
        var s = R(2, 9);
        return mc("Volume kubus dengan sisi " + s + " cm = ...", (s * s * s) + " cm³",
          [(s * s) + " cm³", (6 * s * s) + " cm³", (3 * s) + " cm³"],
          "Volume kubus = sisi × sisi × sisi = " + s + " × " + s + " × " + s + " = " + (s * s * s) + " cm³.",
          "Volume");
      }
      var p = R(3, 8), l = R(2, 6), t = R(2, 5);
      return mc("Volume balok " + p + " × " + l + " × " + t + " cm = ...", (p * l * t) + " cm³",
        [(p * l + t) + " cm³", (2 * (p * l + l * t + p * t)) + " cm³", (p + l + t) + " cm³"],
        "Volume balok = panjang × lebar × tinggi = " + p + " × " + l + " × " + t + " = " + (p * l * t) + " cm³.",
        "Volume");
    },
    function () { // lingkaran (π = 22/7)
      var r = pick([7, 14, 21]);
      if (pick([1, 2]) === 1) {
        var k = 2 * 22 / 7 * r;
        return mc("Keliling lingkaran jari-jari " + r + " cm (π = 22/7) = ...", k + " cm",
          [(k + r) + " cm", (22 / 7 * r) + " cm", (k - r) + " cm"],
          "Keliling = 2 × π × r = 2 × 22/7 × " + r + " = " + k + " cm.",
          "Lingkaran");
      }
      var luas = 22 / 7 * r * r;
      return mc("Luas lingkaran jari-jari " + r + " cm (π = 22/7) = ...", luas + " cm²",
        [(2 * 22 / 7 * r) + " cm²", (luas + r) + " cm²", (22 / 7 * r) + " cm²"],
        "Luas = π × r × r = 22/7 × " + r + " × " + r + " = " + luas + " cm².",
        "Lingkaran");
    },
    function () { // kecepatan
      var v = R(30, 80), t = R(2, 5), s = v * t, mode = pick(["jarak", "kecepatan", "waktu"]);
      if (mode === "jarak")
        return mc("Mobil melaju " + v + " km/jam selama " + t + " jam. Jarak tempuh = ...", s + " km",
          [(s + v) + " km", (v + t) + " km", (s - v) + " km"],
          "Jarak = kecepatan × waktu = " + v + " × " + t + " = " + s + " km.", "Kecepatan");
      if (mode === "kecepatan")
        return mc("Menempuh " + s + " km dalam " + t + " jam. Kecepatan = ...", v + " km/jam",
          [(v + 5) + " km/jam", (v - 5) + " km/jam", (v + 10) + " km/jam"],
          "Kecepatan = jarak ÷ waktu = " + s + " ÷ " + t + " = " + v + " km/jam.", "Kecepatan");
      return mc("Menempuh " + s + " km dengan kecepatan " + v + " km/jam. Waktu = ...", t + " jam",
        [(t + 1) + " jam", (t - 1) + " jam", (t + 2) + " jam"],
        "Waktu = jarak ÷ kecepatan = " + s + " ÷ " + v + " = " + t + " jam.", "Kecepatan");
    },
    function () { // statistika: modus / median
      if (pick([1, 2]) === 1) {
        var m = R(2, 9), a, b;
        do { a = R(2, 9); } while (a === m);
        do { b = R(2, 9); } while (b === m || b === a);
        var data = shuffle([m, m, m, a, b]);
        return mc("Modus dari data: " + data.join(", ") + " adalah ...", m, [a, b, m + 1],
          "Modus = nilai yang paling sering muncul. " + m + " muncul 3 kali, jadi modusnya " + m + ".",
          "Statistika");
      }
      var arr = []; while (arr.length < 5) { var x = R(2, 20); if (arr.indexOf(x) < 0) arr.push(x); }
      var sorted = arr.slice().sort(function (p, q) { return p - q; });
      return mc("Median dari data: " + arr.join(", ") + " adalah ...", sorted[2], [sorted[1], sorted[3], sorted[0]],
        "Urutkan dulu: " + sorted.join(", ") + ". Nilai tengahnya adalah " + sorted[2] + ".",
        "Statistika");
    },
    function () { // bilangan romawi
      var toRoman = function (num) {
        var m = [[100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]], r = "";
        m.forEach(function (p) { while (num >= p[0]) { r += p[1]; num -= p[0]; } });
        return r;
      };
      var n = R(4, 89);
      if (pick([1, 2]) === 1)
        return mc("Angka " + n + " dalam bilangan Romawi = ...", toRoman(n),
          [toRoman(n + 1), toRoman(n - 1), toRoman(n + 5)],
          "Angka " + n + " ditulis " + toRoman(n) + " dalam bilangan Romawi.", "Bilangan Romawi");
      return mc("Bilangan Romawi " + toRoman(n) + " bernilai ...", n, [n + 1, n - 1, n + 10],
        toRoman(n) + " bernilai " + n + ".", "Bilangan Romawi");
    },
    function () { // sudut penyiku / pelurus
      if (pick([1, 2]) === 1) {
        var a = R(20, 70);
        return mc("Besar sudut penyiku dari " + a + "° adalah ...", (90 - a) + "°",
          [(90 - a + 10) + "°", (180 - a) + "°", (90 - a - 10) + "°"],
          "Dua sudut penyiku berjumlah 90°, jadi 90° - " + a + "° = " + (90 - a) + "°.", "Sudut");
      }
      var b = R(30, 150);
      return mc("Besar sudut pelurus dari " + b + "° adalah ...", (180 - b) + "°",
        [(180 - b + 15) + "°", (180 - b - 15) + "°", b + "°"],
        "Dua sudut pelurus berjumlah 180°, jadi 180° - " + b + "° = " + (180 - b) + "°.", "Sudut");
    },
    function () { // persen lanjut (berapa persen)
      var p = pick([[10, 50, 20], [15, 60, 25], [20, 25, 80], [9, 30, 30], [12, 40, 30], [15, 20, 75], [24, 40, 60], [10, 40, 25]]);
      return mc("Berapa persen " + p[0] + " dari " + p[1] + "?", p[2] + "%",
        [(p[2] + 5) + "%", (p[2] - 5) + "%", (p[2] + 10) + "%"],
        "Persen = (bagian ÷ seluruh) × 100 = (" + p[0] + " ÷ " + p[1] + ") × 100 = " + p[2] + "%.",
        "Persen lanjut");
    },
    function () { // peluang sederhana
      var merah = R(2, 6), biru = R(2, 6), total = merah + biru;
      var gcd = function (x, y) { while (y) { var t = y; y = x % y; x = t; } return x; };
      var g = gcd(merah, total);
      var ans = (merah / g) + "/" + (total / g);
      return mc("Dalam kantong ada " + merah + " bola merah dan " + biru + " bola biru. Peluang terambil bola merah = ...",
        ans, [merah + "/" + biru, biru + "/" + total, total + "/" + merah],
        "Peluang = banyak kejadian yang diharapkan ÷ seluruh kemungkinan = " + merah + "/" + total +
        (g > 1 ? ", lalu disederhanakan (bagi " + g + ") menjadi " + ans + "." : "."),
        "Peluang");
    },
    function () { // koordinat kartesius
      var x = R(1, 9), y = R(1, 9);
      while (y === x) y = R(1, 9);
      if (pick([1, 2]) === 1)
        return mc("Titik P berada " + x + " satuan ke kanan dan " + y + " satuan ke atas dari titik (0, 0). Koordinat P = ...",
          "(" + x + ", " + y + ")",
          ["(" + y + ", " + x + ")", "(" + x + ", -" + y + ")", "(-" + x + ", " + y + ")"],
          "Koordinat ditulis (x, y). Ke kanan " + x + " satuan berarti x = " + x + ", ke atas " + y + " satuan berarti y = " + y +
          ". Jadi P(" + x + ", " + y + ").",
          "Koordinat");
      var absis = pick([true, false]);
      var ans = absis ? x : y;
      return mc((absis ? "Absis (x)" : "Ordinat (y)") + " dari titik Q(" + x + ", " + y + ") adalah ...",
        ans, [absis ? y : x, ans + 1, ans - 1],
        "Pada koordinat (x, y), bilangan pertama disebut absis dan bilangan kedua disebut ordinat. Jadi " +
        (absis ? "absisnya " : "ordinatnya ") + ans + ".",
        "Koordinat");
    },
    function () { // deret / barisan bilangan
      var a = R(2, 9), b = pick([3, 4, 5, 6, 7]), i;
      if (pick([1, 2]) === 1) {
        var seq = [];
        for (i = 0; i < 4; i++) seq.push(a + i * b);
        var next = a + 4 * b;
        return mc("Suku berikutnya dari barisan " + seq.join(", ") + ", ... adalah ...", next,
          [next + b, next - 1, next + 1],
          "Selisih tiap suku tetap, yaitu " + b + ". Jadi " + seq[3] + " + " + b + " = " + next + ".",
          "Deret bilangan");
      }
      var n = R(5, 9), jml = 0, s = [];
      for (i = 0; i < n; i++) { s.push(a + i * b); jml += a + i * b; }
      return mc("Jumlah semua bilangan pada barisan " + s.join(" + ") + " = ...", jml,
        [jml + b, jml - b, jml + 10],
        "Pakai rumus jumlah barisan: (banyak suku ÷ 2) × (suku pertama + suku terakhir) = (" + n + " ÷ 2) × (" +
        a + " + " + s[n - 1] + ") = " + jml + ".",
        "Deret bilangan");
    },
    function () { // untung & rugi
      var beli = pick([20000, 25000, 30000, 40000, 50000]);
      var bagian = pick([0.1, 0.2, 0.25]);
      var selisih = beli * bagian, persen = Math.round(bagian * 100);
      var untung = pick([true, false]);
      var jual = untung ? beli + selisih : beli - selisih;
      var barang = pick(["sepatu", "tas", "buku", "mainan"]);
      if (pick([1, 2]) === 1)
        return mc("Pedagang membeli " + barang + " seharga " + rp(beli) + " lalu menjualnya " + rp(jual) + ". Pedagang itu ...",
          (untung ? "Untung " : "Rugi ") + rp(selisih),
          [(untung ? "Rugi " : "Untung ") + rp(selisih), (untung ? "Untung " : "Rugi ") + rp(selisih + 1000), "Impas, tidak untung dan tidak rugi"],
          "Bandingkan harga jual dengan harga beli: " + rp(jual) + (untung ? " lebih besar dari " : " lebih kecil dari ") + rp(beli) +
          ". Selisihnya " + rp(beli) + " dan " + rp(jual) + " = " + rp(selisih) + ", jadi " + (untung ? "untung " : "rugi ") + rp(selisih) + ".",
          "Untung dan rugi");
      return mc(barang.charAt(0).toUpperCase() + barang.slice(1) + " dibeli " + rp(beli) + " dan dijual " + rp(jual) +
        ". Berapa persen " + (untung ? "untungnya" : "ruginya") + "?",
        persen + "%", [(persen + 5) + "%", (persen * 2) + "%", (persen - 5) + "%"],
        "Persen " + (untung ? "untung" : "rugi") + " = (selisih ÷ harga beli) × 100 = (" + rp(selisih) + " ÷ " + rp(beli) +
        ") × 100 = " + persen + "%.",
        "Untung dan rugi");
    }
  ];

  var POOLS = { 1: L1, 2: L2, 3: L3, 4: L4 };

  /* Hash string → integer (FNV-1a) untuk mengubah kode tantangan jadi seed */
  function strHash(str) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h >>> 0;
  }
  /* PRNG deterministik (mulberry32) */
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Peta topik → generator soalnya. Dibuat sekali per level dengan mencicipi
     tiap generator (satu generator bisa punya beberapa cabang soal), supaya
     kartu game per-topik selalu dapat soal yang benar-benar sesuai topiknya. */
  var TOPIC_INDEX = {};
  function topicIndex(level) {
    if (TOPIC_INDEX[level]) return TOPIC_INDEX[level];
    var pool = POOLS[level] || L1, map = {};
    var prev = rng;
    rng = Math.random;   // jangan pakai rng berbenih saat mengindeks
    try {
      pool.forEach(function (gen) {
        for (var i = 0; i < 20; i++) {
          var t = gen().topic;
          if (!map[t]) map[t] = [];
          if (map[t].indexOf(gen) < 0) map[t].push(gen);
        }
      });
    } finally {
      rng = prev;
    }
    TOPIC_INDEX[level] = map;
    return map;
  }

  window.MFQ_QUESTIONS = {
    /* Ambil n soal. Jika `seed` diberikan (angka/kode), soal jadi deterministik:
       kode yang sama → set soal yang sama persis di perangkat mana pun. */
    build: function (level, n, seed) {
      var prev = rng;
      if (seed !== undefined && seed !== null && seed !== "") {
        rng = mulberry32(typeof seed === "string" ? strHash(seed) : (seed >>> 0));
      }
      try {
        var pool = POOLS[level] || L1;
        var order = shuffle(pool.slice());
        var qs = [];
        for (var i = 0; i < n; i++) {
          var g = order[i % order.length];
          qs.push(g());
        }
        return shuffle(qs);
      } finally {
        rng = prev;
      }
    },
    /* Ambil n soal dari SATU topik saja (untuk kartu game per-topik) */
    buildByTopic: function (level, topic, n) {
      var gens = topicIndex(level)[topic];
      if (!gens || !gens.length) return this.build(level, n);   // topik tak dikenal → soal campuran
      var qs = [];
      for (var i = 0; i < n; i++) qs.push(gens[Math.floor(rng() * gens.length)]());
      return qs;
    },
    /* Daftar topik yang benar-benar tersedia di satu level (untuk pengecekan) */
    topics: function (level) { return Object.keys(topicIndex(level)); },
    hash: strHash
  };
})();
