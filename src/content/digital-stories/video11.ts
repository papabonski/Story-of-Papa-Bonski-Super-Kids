import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["The Kindness Seed", "The Running Dream", "The Magic Compass", "The Lost River"],
    answer: "The Kindness Seed",
  },
  {
    question: "Who is the main character?",
    options: ["Maya", "Kiko", "Alex", "Timmy"],
    answer: "Maya",
  },
  {
    question: "Where did Maya live?",
    options: ["In a small village", "In a big city", "On a mountain", "Inside a castle"],
    answer: "In a small village",
  },
  {
    question: "What did Maya love doing?",
    options: ["Helping others", "Hiding toys", "Running away", "Sleeping all day"],
    answer: "Helping others",
  },
  {
    question: "What did Maya find one day?",
    options: ["A tiny seed", "A golden key", "A blue bird", "A red kite"],
    answer: "A tiny seed",
  },
  {
    question: "What did the seed do in the sun?",
    options: ["It sparkled", "It sang loudly", "It flew away", "It turned into water"],
    answer: "It sparkled",
  },
  {
    question: "What did Maya decide to do with the seed?",
    options: ["Plant it", "Throw it away", "Hide it under a bed", "Give it to a bird"],
    answer: "Plant it",
  },
  {
    question: "Where did Maya place the seed?",
    options: ["In the soil", "In a cup of tea", "On a roof", "Inside a book"],
    answer: "In the soil",
  },
  {
    question: "What did Maya do every day?",
    options: ["Watered the seed with care", "Forgot the seed", "Painted the seed", "Carried it to school"],
    answer: "Watered the seed with care",
  },
  {
    question: "How did Maya feel when nothing happened?",
    options: ["Sad", "Angry", "Sleepy", "Silly"],
    answer: "Sad",
  },
  {
    question: "What did Maya see one morning?",
    options: ["A tiny sprout", "A tiny boat", "A tiny turtle", "A tiny cloud"],
    answer: "A tiny sprout",
  },
  {
    question: "How did Maya feel when the sprout appeared?",
    options: ["Thrilled", "Bored", "Jealous", "Afraid"],
    answer: "Thrilled",
  },
  {
    question: "What did the sprout grow into?",
    options: ["A beautiful plant with colorful flowers", "A tall tower", "A wooden bridge", "A toy car"],
    answer: "A beautiful plant with colorful flowers",
  },
  {
    question: "What did people ask Maya?",
    options: ["How did you grow such a beautiful flower?", "Where is your school?", "Can you run faster?", "Why is the sky blue?"],
    answer: "How did you grow such a beautiful flower?",
  },
  {
    question: "What did Maya say she planted?",
    options: ["A seed of kindness", "A seed of gold", "A seed of trouble", "A seed of rain"],
    answer: "A seed of kindness",
  },
  {
    question: "What did the villagers realize?",
    options: ["Maya's kindness made the seed bloom", "The seed was a toy", "Flowers never grow", "Kindness is not useful"],
    answer: "Maya's kindness made the seed bloom",
  },
  {
    question: "What did everyone plant after that?",
    options: ["Seeds of kindness", "Seeds of anger", "Seeds of noise", "Seeds of fear"],
    answer: "Seeds of kindness",
  },
  {
    question: "What did the villagers do more often?",
    options: ["Helped each other, shared, and smiled", "Argued and shouted", "Hid from each other", "Stopped planting"],
    answer: "Helped each other, shared, and smiled",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Kindness can grow and spread", "Never help anyone", "Plants grow without care", "Villages need no friends"],
    answer: "Kindness can grow and spread",
  },
  {
    question: "Which word means kebaikan?",
    options: ["Kindness", "Soil", "Sprout", "Village"],
    answer: "Kindness",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["kindness", "kebaikan", "ˈkaɪndnəs"],
  ["seed", "biji", "siːd"],
  ["village", "desa", "ˈvɪlɪdʒ"],
  ["little", "kecil", "ˈlɪtl"],
  ["girl", "anak perempuan", "ɡɜːrl"],
  ["helping", "membantu", "ˈhelpɪŋ"],
  ["others", "orang lain", "ˈʌðərz"],
  ["found", "menemukan", "faʊnd"],
  ["tiny", "sangat kecil", "ˈtaɪni"],
  ["sparkled", "berkilau", "ˈspɑːrkld"],
  ["sun", "matahari", "sʌn"],
  ["plant", "menanam / tanaman", "plænt"],
  ["dug", "menggali", "dʌɡ"],
  ["hole", "lubang", "hoʊl"],
  ["gently", "dengan lembut", "ˈdʒentli"],
  ["placed", "meletakkan", "pleɪst"],
  ["soil", "tanah", "sɔɪl"],
  ["watered", "menyiram", "ˈwɔːtərd"],
  ["care", "perhatian / merawat", "ker"],
  ["weeks", "minggu-minggu", "wiːks"],
  ["passed", "berlalu", "pæst"],
  ["happened", "terjadi", "ˈhæpənd"],
  ["sad", "sedih", "sæd"],
  ["grow", "tumbuh", "ɡroʊ"],
  ["morning", "pagi", "ˈmɔːrnɪŋ"],
  ["sprout", "tunas", "spraʊt"],
  ["thrilled", "sangat senang", "θrɪld"],
  ["sunlight", "sinar matahari", "ˈsʌnlaɪt"],
  ["flowers", "bunga-bunga", "ˈflaʊərz"],
  ["bloom", "mekar", "bluːm"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I love helping others.",
    meaning: "Aku suka membantu orang lain.",
    useCase: "Dipakai saat anak ingin menyampaikan kebiasaan baik atau kesukaan membantu.",
    dialog: [
      {
        speaker: "Maya",
        text: "I love helping others in my village.",
        translation: "Aku suka membantu orang lain di desaku.",
      },
      {
        speaker: "Friend",
        text: "That is kind of you, Maya.",
        translation: "Itu baik sekali darimu, Maya.",
      },
    ],
    practicePrompt: "Ajak anak melengkapi: I love helping others by...",
  },
  {
    expression: "What is this?",
    meaning: "Apa ini?",
    useCase: "Dipakai saat anak menemukan sesuatu dan ingin bertanya.",
    dialog: [
      {
        speaker: "Maya",
        text: "What is this tiny seed?",
        translation: "Apa biji kecil ini?",
      },
      {
        speaker: "Maya's Friend",
        text: "It sparkles in the sun.",
        translation: "Biji itu berkilau di bawah matahari.",
      },
    ],
    practicePrompt: "Latih dengan benda sekitar: What is this? It is a seed.",
  },
  {
    expression: "I'll plant this seed.",
    meaning: "Aku akan menanam biji ini.",
    useCase: "Dipakai saat membuat keputusan atau rencana sederhana.",
    dialog: [
      {
        speaker: "Maya",
        text: "I'll plant this seed and see what happens.",
        translation: "Aku akan menanam biji ini dan melihat apa yang terjadi.",
      },
      {
        speaker: "Friend",
        text: "That sounds exciting!",
        translation: "Itu terdengar menyenangkan!",
      },
    ],
    practicePrompt: "Latih pola rencana: I'll plant this. I'll water this. I'll help you.",
  },
  {
    expression: "Be gentle.",
    meaning: "Bersikaplah lembut / hati-hati.",
    useCase: "Dipakai saat melakukan sesuatu yang membutuhkan perhatian.",
    dialog: [
      {
        speaker: "Maya",
        text: "Be gentle with the tiny seed.",
        translation: "Bersikaplah lembut dengan biji kecil ini.",
      },
      {
        speaker: "Friend",
        text: "I will place it carefully in the soil.",
        translation: "Aku akan meletakkannya dengan hati-hati di tanah.",
      },
    ],
    practicePrompt: "Gunakan saat merawat tanaman atau hewan: Be gentle.",
  },
  {
    expression: "Nothing happened.",
    meaning: "Tidak terjadi apa-apa.",
    useCase: "Dipakai saat anak menunggu hasil tetapi belum melihat perubahan.",
    dialog: [
      {
        speaker: "Maya",
        text: "Weeks passed, but nothing happened.",
        translation: "Minggu-minggu berlalu, tetapi tidak terjadi apa-apa.",
      },
      {
        speaker: "Friend",
        text: "Maybe it needs more time.",
        translation: "Mungkin itu membutuhkan lebih banyak waktu.",
      },
    ],
    practicePrompt: "Latih respons sabar: Nothing happened yet. I will wait.",
  },
  {
    expression: "Don't give up yet.",
    meaning: "Jangan menyerah dulu.",
    useCase: "Dipakai untuk memberi semangat saat hasil belum terlihat.",
    dialog: [
      {
        speaker: "Maya",
        text: "I feel sad. The seed did not grow.",
        translation: "Aku merasa sedih. Bijinya belum tumbuh.",
      },
      {
        speaker: "Friend",
        text: "Don't give up yet. Keep caring for it.",
        translation: "Jangan menyerah dulu. Terus rawat bijinya.",
      },
    ],
    practicePrompt: "Role-play: satu anak merasa sedih, anak lain berkata 'Don't give up yet.'",
  },
  {
    expression: "It is growing!",
    meaning: "Itu sedang tumbuh!",
    useCase: "Dipakai saat melihat perkembangan yang membuat senang.",
    dialog: [
      {
        speaker: "Maya",
        text: "Look! A tiny sprout is peeking out. It is growing!",
        translation: "Lihat! Tunas kecil muncul. Itu sedang tumbuh!",
      },
      {
        speaker: "Friend",
        text: "Your care is working!",
        translation: "Perawatanmu berhasil!",
      },
    ],
    practicePrompt: "Gunakan saat melihat kemajuan: It is growing! I am improving!",
  },
  {
    expression: "How did you grow it?",
    meaning: "Bagaimana kamu menumbuhkannya?",
    useCase: "Dipakai saat bertanya cara seseorang berhasil melakukan sesuatu.",
    dialog: [
      {
        speaker: "Villager",
        text: "How did you grow such a beautiful flower?",
        translation: "Bagaimana kamu menumbuhkan bunga seindah ini?",
      },
      {
        speaker: "Maya",
        text: "I cared for it every day.",
        translation: "Aku merawatnya setiap hari.",
      },
    ],
    practicePrompt: "Latih pertanyaan: How did you make it? How did you learn it?",
  },
  {
    expression: "I planted a seed of kindness.",
    meaning: "Aku menanam biji kebaikan.",
    useCase: "Dipakai untuk menyampaikan pesan moral cerita.",
    dialog: [
      {
        speaker: "Villager",
        text: "What kind of seed was it?",
        translation: "Biji jenis apa itu?",
      },
      {
        speaker: "Maya",
        text: "I planted a seed of kindness.",
        translation: "Aku menanam biji kebaikan.",
      },
    ],
    practicePrompt: "Minta anak menyebutkan satu seed of kindness yang bisa ia tanam hari ini.",
  },
  {
    expression: "Kindness can bloom.",
    meaning: "Kebaikan bisa mekar.",
    useCase: "Dipakai untuk menjelaskan bahwa tindakan baik bisa memberi dampak indah.",
    dialog: [
      {
        speaker: "Maya",
        text: "Kindness can bloom when we care for it.",
        translation: "Kebaikan bisa mekar saat kita merawatnya.",
      },
      {
        speaker: "Villagers",
        text: "Let's plant kindness in our village too.",
        translation: "Ayo tanam kebaikan di desa kita juga.",
      },
    ],
    practicePrompt: "Jadikan closing chant: Kindness can bloom. I can be kind today.",
  },
];

export const video11: DigitalStory = {
  id: "video11",
  number: 11,
  title: "The Kindness Seed",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/The-Kindness-Seed.jpg",
  videoPreviewUrl: drivePreview("1Hbz4Z9C5z3m7e09AtNJngbCkxSFmjrZX"),
  videoViewUrl: driveView("1Hbz4Z9C5z3m7e09AtNJngbCkxSFmjrZX"),
  pdfPreviewUrl: drivePreview("1UeqASuBqkJKm95RDoEANCt6MEEIlNeKL"),
  pdfViewUrl: "https://drive.google.com/file/d/1UeqASuBqkJKm95RDoEANCt6MEEIlNeKL/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Maya, seorang anak perempuan kecil yang tinggal di sebuah desa dan senang membantu orang lain. Suatu hari, Maya menemukan biji kecil yang berkilau di bawah sinar matahari.",
    "Maya memutuskan untuk menanam biji itu. Ia menggali lubang kecil, meletakkan biji dengan lembut, lalu menyiramnya setiap hari dengan penuh perhatian.",
    "Beberapa minggu berlalu dan tidak ada yang terjadi, sehingga Maya merasa sedih. Namun suatu pagi, ia melihat tunas kecil muncul dari tanah. Maya sangat senang dan merawatnya lebih baik lagi.",
    "Tunas itu tumbuh menjadi tanaman indah dengan bunga warna-warni. Ketika penduduk desa bertanya bagaimana Maya menumbuhkan bunga itu, Maya menjawab bahwa ia menanam biji kebaikan.",
    "Sejak saat itu, para penduduk ikut menanam kebaikan dengan saling membantu, berbagi, dan tersenyum. Desa mereka menjadi tempat yang lebih bahagia dan ramah.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
