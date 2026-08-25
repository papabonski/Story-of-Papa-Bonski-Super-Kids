import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the boy's name in the story?",
    options: ["Tim", "Tom", "Ben", "Sam"],
    answer: "Tim",
  },
  {
    question: "What did Tim love most?",
    options: ["Adventures and stories", "Sleeping all day", "Counting stones", "Cleaning windows"],
    answer: "Adventures and stories",
  },
  {
    question: "What did Tim use as his cape?",
    options: ["A red blanket", "A school bag", "A green towel", "A paper map"],
    answer: "A red blanket",
  },
  {
    question: "What name did Tim give himself?",
    options: ["Captain Adventure", "Captain Sleepy", "Doctor Flower", "Mister Ocean"],
    answer: "Captain Adventure",
  },
  {
    question: "Where did Tim begin his adventure?",
    options: ["In the backyard", "At the airport", "Inside a cave", "On the moon"],
    answer: "In the backyard",
  },
  {
    question: "What did Tim bring to explore the garden?",
    options: ["His trusty toy telescope", "A big umbrella", "A cooking pan", "A football"],
    answer: "His trusty toy telescope",
  },
  {
    question: "What did Tim pretend the garden was?",
    options: ["A mystical jungle", "A busy city", "A frozen lake", "A dark classroom"],
    answer: "A mystical jungle",
  },
  {
    question: "How did Tim move through the bushes?",
    options: ["He tiptoed carefully", "He shouted loudly", "He drove a car", "He flew a plane"],
    answer: "He tiptoed carefully",
  },
  {
    question: "What did Tim imagine giant snakes were?",
    options: ["Garden hoses", "Tree branches", "Toy cars", "Clouds"],
    answer: "Garden hoses",
  },
  {
    question: "What did Tim pretend the flowers were?",
    options: ["Hummingbirds", "Sea shells", "Gold coins", "Tiny houses"],
    answer: "Hummingbirds",
  },
  {
    question: "What did Tim pretend to swing from?",
    options: ["Tree to tree", "Cloud to cloud", "Chair to chair", "Boat to boat"],
    answer: "Tree to tree",
  },
  {
    question: "What became Captain Adventure's ocean?",
    options: ["The little blue paddling pool", "A glass of milk", "A rainy window", "A sandy road"],
    answer: "The little blue paddling pool",
  },
  {
    question: "What did Tim use for islands?",
    options: ["Colorful shells", "Old books", "Shoes", "Pencils"],
    answer: "Colorful shells",
  },
  {
    question: "What appeared during the pretend storm?",
    options: ["A fearsome dragon", "A quiet rabbit", "A school bus", "A magic clock"],
    answer: "A fearsome dragon",
  },
  {
    question: "What did Captain Adventure do in the storm?",
    options: ["Steered to safety", "Went to sleep", "Dropped his cape", "Ran inside immediately"],
    answer: "Steered to safety",
  },
  {
    question: "How did Tim feel when the sun began to set?",
    options: ["Tired and happy", "Angry and lonely", "Bored and scared", "Confused and sad"],
    answer: "Tired and happy",
  },
  {
    question: "What did Tim learn about adventures?",
    options: ["They can happen anywhere", "They only happen far away", "They need expensive toys", "They are never fun"],
    answer: "They can happen anywhere",
  },
  {
    question: "Which word means imajinasi?",
    options: ["Imagination", "Telescope", "Ocean", "Cape"],
    answer: "Imagination",
  },
  {
    question: "Which word means keberanian?",
    options: ["Bravery", "Garden", "Flower", "Window"],
    answer: "Bravery",
  },
  {
    question: "What is the main message of the story?",
    options: ["Imagination can turn ordinary places into adventures", "Children should never play outside", "Only real ships can be fun", "Gardens are boring places"],
    answer: "Imagination can turn ordinary places into adventures",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["adventure", "petualangan", "ədˈventʃər"],
  ["captain", "kapten", "ˈkæptən"],
  ["bright", "cerah", "braɪt"],
  ["morning", "pagi", "ˈmɔːrnɪŋ"],
  ["sparkle", "kilauan / berbinar", "ˈspɑːrkl"],
  ["special", "istimewa", "ˈspeʃl"],
  ["plan", "rencana", "plæn"],
  ["cape", "jubah", "keɪp"],
  ["marched", "berbaris / melangkah mantap", "mɑːrtʃt"],
  ["backyard", "halaman belakang", "ˌbækˈjɑːrd"],
  ["trusty", "terpercaya", "ˈtrʌsti"],
  ["telescope", "teropong", "ˈtelɪskoʊp"],
  ["jungle", "hutan rimba", "ˈdʒʌŋɡl"],
  ["garden", "kebun", "ˈɡɑːrdn"],
  ["tiptoed", "berjalan berjingkat", "ˈtɪptoʊd"],
  ["bushes", "semak-semak", "ˈbʊʃɪz"],
  ["creatures", "makhluk-makhluk", "ˈkriːtʃərz"],
  ["spotted", "melihat / menemukan", "ˈspɑːtɪd"],
  ["giant", "raksasa", "ˈdʒaɪənt"],
  ["snake", "ular", "sneɪk"],
  ["hummingbird", "burung kolibri", "ˈhʌmɪŋbɜːrd"],
  ["pretended", "berpura-pura / membayangkan", "prɪˈtendɪd"],
  ["swing", "berayun", "swɪŋ"],
  ["sailed", "berlayar", "seɪld"],
  ["ocean", "lautan", "ˈoʊʃn"],
  ["paddling pool", "kolam anak kecil", "ˈpædlɪŋ puːl"],
  ["islands", "pulau-pulau", "ˈaɪləndz"],
  ["dragon", "naga", "ˈdræɡən"],
  ["bravery", "keberanian", "ˈbreɪvəri"],
  ["imagination", "imajinasi", "ɪˌmædʒɪˈneɪʃn"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Today is special.",
    meaning: "Hari ini istimewa.",
    useCase: "Dipakai saat anak ingin membuka cerita atau aktivitas dengan semangat.",
    dialog: [
      {
        speaker: "Tim",
        text: "Today is special because I have a plan.",
        translation: "Hari ini istimewa karena aku punya rencana.",
      },
      {
        speaker: "Dad",
        text: "What is your plan, Captain Adventure?",
        translation: "Apa rencanamu, Captain Adventure?",
      },
    ],
    practicePrompt: "Ajak anak melengkapi kalimat: Today is special because...",
  },
  {
    expression: "I am ready for...",
    meaning: "Aku siap untuk...",
    useCase: "Dipakai untuk menyatakan kesiapan sebelum memulai kegiatan.",
    dialog: [
      {
        speaker: "Tim",
        text: "I am ready for my backyard adventure.",
        translation: "Aku siap untuk petualangan halaman belakangku.",
      },
      {
        speaker: "Toy Telescope",
        text: "Then look closely and explore!",
        translation: "Kalau begitu lihat baik-baik dan jelajahi!",
      },
    ],
    practicePrompt: "Latih pola: I am ready for school. I am ready for reading.",
  },
  {
    expression: "Let's explore!",
    meaning: "Ayo menjelajah!",
    useCase: "Dipakai untuk mengajak teman memulai petualangan atau mencari tahu sesuatu.",
    dialog: [
      {
        speaker: "Tim",
        text: "The garden looks like a jungle. Let's explore!",
        translation: "Kebun ini terlihat seperti hutan rimba. Ayo menjelajah!",
      },
      {
        speaker: "Friend",
        text: "Great idea! I will follow you.",
        translation: "Ide bagus! Aku akan mengikutimu.",
      },
    ],
    practicePrompt: "Gunakan saat membuka buku baru: Let's explore this story!",
  },
  {
    expression: "Be careful.",
    meaning: "Hati-hati.",
    useCase: "Dipakai untuk mengingatkan seseorang agar bergerak aman dan pelan.",
    dialog: [
      {
        speaker: "Tim",
        text: "Be careful. There may be hidden creatures.",
        translation: "Hati-hati. Mungkin ada makhluk tersembunyi.",
      },
      {
        speaker: "Friend",
        text: "I will tiptoe through the bushes.",
        translation: "Aku akan berjingkat melewati semak-semak.",
      },
    ],
    practicePrompt: "Latih dengan situasi rumah: Be careful on the stairs. Be careful with hot water.",
  },
  {
    expression: "I spotted...",
    meaning: "Aku melihat / menemukan...",
    useCase: "Dipakai saat anak menemukan sesuatu dan ingin menunjukkannya.",
    dialog: [
      {
        speaker: "Tim",
        text: "I spotted a giant snake!",
        translation: "Aku melihat ular raksasa!",
      },
      {
        speaker: "Friend",
        text: "It is only the garden hose, Captain.",
        translation: "Itu hanya selang taman, Kapten.",
      },
    ],
    practicePrompt: "Ajak anak menunjuk benda sekitar: I spotted a book. I spotted a flower.",
  },
  {
    expression: "Imagine that...",
    meaning: "Bayangkan bahwa...",
    useCase: "Dipakai untuk bermain imajinasi dan membuat cerita lebih hidup.",
    dialog: [
      {
        speaker: "Tim",
        text: "Imagine that this pool is a vast ocean.",
        translation: "Bayangkan bahwa kolam ini adalah lautan yang luas.",
      },
      {
        speaker: "Friend",
        text: "Then we need a brave captain!",
        translation: "Kalau begitu kita butuh kapten pemberani!",
      },
    ],
    practicePrompt: "Latih dengan benda: Imagine that this chair is a ship.",
  },
  {
    expression: "Hold on tight!",
    meaning: "Pegang erat-erat!",
    useCase: "Dipakai dalam dialog aksi saat situasi terasa seru atau menantang.",
    dialog: [
      {
        speaker: "Tim",
        text: "The waves are high. Hold on tight!",
        translation: "Ombaknya tinggi. Pegang erat-erat!",
      },
      {
        speaker: "Friend",
        text: "I am holding on, Captain!",
        translation: "Aku berpegangan, Kapten!",
      },
    ],
    practicePrompt: "Role-play kapal mainan: satu anak berkata 'Hold on tight!'",
  },
  {
    expression: "We made it!",
    meaning: "Kita berhasil!",
    useCase: "Dipakai saat menyelesaikan tantangan atau sampai di tujuan.",
    dialog: [
      {
        speaker: "Tim",
        text: "We crossed the ocean. We made it!",
        translation: "Kita menyeberangi lautan. Kita berhasil!",
      },
      {
        speaker: "Friend",
        text: "That was an amazing adventure.",
        translation: "Itu petualangan yang luar biasa.",
      },
    ],
    practicePrompt: "Gunakan setelah anak selesai membaca satu halaman: We made it!",
  },
  {
    expression: "What a brave explorer!",
    meaning: "Sungguh penjelajah yang berani!",
    useCase: "Dipakai untuk memuji keberanian seseorang.",
    dialog: [
      {
        speaker: "Dad",
        text: "What a brave explorer you are!",
        translation: "Sungguh kamu penjelajah yang berani!",
      },
      {
        speaker: "Tim",
        text: "Thank you. I used my imagination.",
        translation: "Terima kasih. Aku memakai imajinasiku.",
      },
    ],
    practicePrompt: "Latih pujian lain: What a kind friend! What a smart reader!",
  },
  {
    expression: "Adventure can happen anywhere.",
    meaning: "Petualangan bisa terjadi di mana saja.",
    useCase: "Dipakai untuk menyimpulkan pesan cerita tentang imajinasi dan rasa ingin tahu.",
    dialog: [
      {
        speaker: "Tim",
        text: "Adventure can happen anywhere, even in my backyard.",
        translation: "Petualangan bisa terjadi di mana saja, bahkan di halaman belakangku.",
      },
      {
        speaker: "Dad",
        text: "Yes, when you use curiosity and imagination.",
        translation: "Ya, saat kamu memakai rasa ingin tahu dan imajinasi.",
      },
    ],
    practicePrompt: "Ajak anak menyebutkan tempat biasa yang bisa jadi tempat petualangan.",
  },
];


export const video3: DigitalStory = {
  id: "video3",
  number: 3,
  title: "A Day with Captain Adventure",
  language: "English",
  level: "Beginner",
  thumbnail: "/thumbnail-video/A-Day-with-Captain-Adventure.jpg",
  videoPreviewUrl: drivePreview("1EtwxaHeMiEdjs7LRPKci3HFtS_YjWHs-"),
  videoViewUrl: driveView("1EtwxaHeMiEdjs7LRPKci3HFtS_YjWHs-"),
  pdfPreviewUrl: drivePreview("1oTUpeDQGork0N8d-ytqynK88F1Ao8U1M"),
  pdfViewUrl: "https://drive.google.com/file/d/1oTUpeDQGork0N8d-ytqynK88F1Ao8U1M/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan Tim, seorang anak laki-laki yang bangun pada pagi yang cerah dengan mata berbinar karena ia punya rencana istimewa. Ia memakai selimut merah sebagai jubah dan menyebut dirinya Captain Adventure.",
  "Dengan teropong mainannya, Tim menjelajahi halaman belakang seperti hutan rimba yang ajaib. Ia berjingkat melewati semak-semak, membayangkan selang taman sebagai ular raksasa dan bunga-bunga sebagai burung kolibri berwarna-warni.",
  "Petualangan Tim berlanjut ke kolam kecil biru yang ia bayangkan sebagai lautan luas. Ia memakai topi kardus, berlayar dengan keberanian, mengumpulkan kerang sebagai pulau, dan menghadapi badai serta naga dalam imajinasinya.",
  "Saat matahari terbenam, Tim merasa lelah tetapi bahagia. Ia belajar bahwa petualangan bisa terjadi di mana saja, bahkan di halaman belakang rumah, selama ia memakai imajinasi, rasa ingin tahu, dan keberanian."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
