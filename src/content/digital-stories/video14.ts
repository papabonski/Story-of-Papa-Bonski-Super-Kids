import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Draco's Kind Wings", "Iggy's Helpful Heart", "The Helpful Hive", "The Kindness Seed"],
    answer: "Draco's Kind Wings",
  },
  {
    question: "Who is the main character?",
    options: ["Draco", "Iggy", "Buzz", "Timmy"],
    answer: "Draco",
  },
  {
    question: "What kind of creature is Draco?",
    options: ["A dragon", "A gnome", "A bird", "A bee"],
    answer: "A dragon",
  },
  {
    question: "Where did Draco live?",
    options: ["In a faraway land", "In a busy city", "On a beach", "Inside a school"],
    answer: "In a faraway land",
  },
  {
    question: "What did Draco have?",
    options: ["Shimmering scales and majestic wings", "A red compass", "A broken shell", "A puzzle piece"],
    answer: "Shimmering scales and majestic wings",
  },
  {
    question: "What was Draco doing one day?",
    options: ["Soaring high in the sky", "Sleeping in a cave", "Swimming in a river", "Planting flowers"],
    answer: "Soaring high in the sky",
  },
  {
    question: "Who did Draco notice in the forest?",
    options: ["A group of tiny creatures", "A class of children", "A family of turtles", "A sleepy sunflower"],
    answer: "A group of tiny creatures",
  },
  {
    question: "How did the tiny creatures look?",
    options: ["Lost and worried", "Angry and loud", "Sleepy and bored", "Proud and silly"],
    answer: "Lost and worried",
  },
  {
    question: "What did Draco ask?",
    options: ["Can I help?", "Can I race?", "Can I hide?", "Can I eat?"],
    answer: "Can I help?",
  },
  {
    question: "Who replied to Draco?",
    options: ["A small gnome", "A butterfly", "A teacher", "A turtle"],
    answer: "A small gnome",
  },
  {
    question: "What were the gnomes looking for?",
    options: ["Their village", "Their kite", "Their medal", "Their book"],
    answer: "Their village",
  },
  {
    question: "How did Draco help the gnomes?",
    options: ["He offered them a ride on his back", "He gave them a boat", "He hid them in flowers", "He taught them math"],
    answer: "He offered them a ride on his back",
  },
  {
    question: "Where did Draco fly with the gnomes?",
    options: ["Over hills and valleys", "Under the sea", "Around a classroom", "Through a toy shop"],
    answer: "Over hills and valleys",
  },
  {
    question: "What did the gnomes say after arriving safely?",
    options: ["Thank you, Draco!", "Go away, Draco!", "We are still lost", "We do not like flying"],
    answer: "Thank you, Draco!",
  },
  {
    question: "How did Draco feel after helping the gnomes?",
    options: ["A warmth in his heart", "Cold and lonely", "Angry and tired", "Afraid of flying"],
    answer: "A warmth in his heart",
  },
  {
    question: "Who did Draco see next?",
    options: ["A family of birds", "A team of runners", "A group of ants", "A lost koala"],
    answer: "A family of birds",
  },
  {
    question: "What were the birds struggling to do?",
    options: ["Build their nest", "Find a school", "Carry a compass", "Grow a seed"],
    answer: "Build their nest",
  },
  {
    question: "How did Draco help the birds?",
    options: ["He warmed their sticks with gentle fiery breath", "He took their nest away", "He splashed water on them", "He gave them a puzzle"],
    answer: "He warmed their sticks with gentle fiery breath",
  },
  {
    question: "What did Draco use from that day on?",
    options: ["His kind wings and soft roar", "A loud horn", "A magic pencil", "A racing medal"],
    answer: "His kind wings and soft roar",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Using our gifts to help others brings joy", "Strong wings are only for showing off", "Never help lost friends", "Kindness makes places worse"],
    answer: "Using our gifts to help others brings joy",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Draco", "Draco / nama naga", "ˈdreɪkoʊ"],
  ["kind", "baik hati", "kaɪnd"],
  ["wings", "sayap", "wɪŋz"],
  ["faraway", "jauh sekali", "ˈfɑːrəweɪ"],
  ["land", "negeri / tanah", "lænd"],
  ["dragon", "naga", "ˈdræɡən"],
  ["shimmering", "berkilauan", "ˈʃɪmərɪŋ"],
  ["scales", "sisik", "skeɪlz"],
  ["majestic", "megah", "məˈdʒestɪk"],
  ["sparkled", "berkilau", "ˈspɑːrkəld"],
  ["sunlight", "cahaya matahari", "ˈsʌnlaɪt"],
  ["soaring", "terbang tinggi", "ˈsɔːrɪŋ"],
  ["sky", "langit", "skaɪ"],
  ["noticed", "memperhatikan", "ˈnoʊtɪst"],
  ["creatures", "makhluk-makhluk", "ˈkriːtʃərz"],
  ["scurrying", "berlarian kecil", "ˈskɜːriɪŋ"],
  ["lost", "tersesat", "lɔːst"],
  ["worried", "khawatir", "ˈwɜːrid"],
  ["gnome", "kurcaci", "noʊm"],
  ["village", "desa", "ˈvɪlɪdʒ"],
  ["swooped", "menukik turun", "swuːpt"],
  ["offered", "menawarkan", "ˈɔːfərd"],
  ["ride", "tumpangan", "raɪd"],
  ["hills", "bukit-bukit", "hɪlz"],
  ["valleys", "lembah-lembah", "ˈvæliz"],
  ["safely", "dengan aman", "ˈseɪfli"],
  ["warmth", "kehangatan", "wɔːrmθ"],
  ["birds", "burung-burung", "bɜːrdz"],
  ["nest", "sarang", "nest"],
  ["joy", "kegembiraan", "dʒɔɪ"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Can I help?",
    meaning: "Bolehkah aku membantu?",
    useCase: "Dipakai saat ingin menawarkan bantuan kepada seseorang yang terlihat kesulitan.",
    dialog: [
      {
        speaker: "Draco",
        text: "Can I help?",
        translation: "Bolehkah aku membantu?",
      },
      {
        speaker: "Gnome",
        text: "Yes, please. We are lost.",
        translation: "Ya, tolong. Kami tersesat.",
      },
    ],
    practicePrompt: "Latih tawaran bantuan: Can I help? Yes, please.",
  },
  {
    expression: "We're looking for our village.",
    meaning: "Kami sedang mencari desa kami.",
    useCase: "Dipakai untuk menjelaskan apa yang sedang dicari.",
    dialog: [
      {
        speaker: "Gnome",
        text: "We're looking for our village.",
        translation: "Kami sedang mencari desa kami.",
      },
      {
        speaker: "Draco",
        text: "I can help you find it.",
        translation: "Aku bisa membantu kalian menemukannya.",
      },
    ],
    practicePrompt: "Ganti objek: We're looking for our book.",
  },
  {
    expression: "We're lost.",
    meaning: "Kami tersesat.",
    useCase: "Dipakai saat seseorang tidak tahu jalan atau arah pulang.",
    dialog: [
      {
        speaker: "Gnome",
        text: "We're lost.",
        translation: "Kami tersesat.",
      },
      {
        speaker: "Draco",
        text: "Do not worry. I will help.",
        translation: "Jangan khawatir. Aku akan membantu.",
      },
    ],
    practicePrompt: "Latih kalimat situasi: I'm lost. We're lost.",
  },
  {
    expression: "Come ride on my back.",
    meaning: "Ayo naik di punggungku.",
    useCase: "Dipakai saat menawarkan tumpangan dalam konteks cerita fantasi.",
    dialog: [
      {
        speaker: "Draco",
        text: "Come ride on my back.",
        translation: "Ayo naik di punggungku.",
      },
      {
        speaker: "Gnomes",
        text: "Thank you, Draco!",
        translation: "Terima kasih, Draco!",
      },
    ],
    practicePrompt: "Latih ajakan sopan: Come with me.",
  },
  {
    expression: "Thank you, Draco!",
    meaning: "Terima kasih, Draco!",
    useCase: "Dipakai untuk mengucapkan terima kasih setelah dibantu.",
    dialog: [
      {
        speaker: "Gnomes",
        text: "Thank you, Draco!",
        translation: "Terima kasih, Draco!",
      },
      {
        speaker: "Draco",
        text: "You are welcome.",
        translation: "Sama-sama.",
      },
    ],
    practicePrompt: "Latih pasangan ekspresi: Thank you. You are welcome.",
  },
  {
    expression: "I want to help more.",
    meaning: "Aku ingin membantu lebih banyak.",
    useCase: "Dipakai untuk menyatakan niat melakukan lebih banyak kebaikan.",
    dialog: [
      {
        speaker: "Draco",
        text: "I want to help more.",
        translation: "Aku ingin membantu lebih banyak.",
      },
      {
        speaker: "Narrator",
        text: "He flew on and looked for someone in need.",
        translation: "Ia terus terbang dan mencari seseorang yang membutuhkan.",
      },
    ],
    practicePrompt: "Ajak anak membuat kalimat: I want to help my friend.",
  },
  {
    expression: "They need help.",
    meaning: "Mereka membutuhkan bantuan.",
    useCase: "Dipakai saat melihat orang lain sedang kesulitan.",
    dialog: [
      {
        speaker: "Draco",
        text: "The birds need help.",
        translation: "Burung-burung itu membutuhkan bantuan.",
      },
      {
        speaker: "Narrator",
        text: "They were struggling to build their nest.",
        translation: "Mereka sedang kesulitan membangun sarang.",
      },
    ],
    practicePrompt: "Latih observasi: He needs help. They need help.",
  },
  {
    expression: "Let me warm the sticks.",
    meaning: "Biarkan aku menghangatkan ranting-ranting ini.",
    useCase: "Dipakai saat menawarkan solusi praktis dalam cerita.",
    dialog: [
      {
        speaker: "Draco",
        text: "Let me warm the sticks gently.",
        translation: "Biarkan aku menghangatkan ranting-ranting ini dengan lembut.",
      },
      {
        speaker: "Birds",
        text: "That will help us weave the nest.",
        translation: "Itu akan membantu kami menganyam sarang.",
      },
    ],
    practicePrompt: "Latih pola izin: Let me help. Let me try.",
  },
  {
    expression: "Helping others brings me joy.",
    meaning: "Membantu orang lain memberiku kegembiraan.",
    useCase: "Dipakai untuk menyampaikan perasaan positif setelah membantu.",
    dialog: [
      {
        speaker: "Draco",
        text: "Helping others brings me joy.",
        translation: "Membantu orang lain memberiku kegembiraan.",
      },
      {
        speaker: "Birds",
        text: "Your kind wings helped us.",
        translation: "Sayap baikmu membantu kami.",
      },
    ],
    practicePrompt: "Latih refleksi: Helping others makes me happy.",
  },
  {
    expression: "I can use my gifts to help.",
    meaning: "Aku bisa menggunakan kelebihanku untuk membantu.",
    useCase: "Dipakai untuk menyimpulkan pesan moral cerita.",
    dialog: [
      {
        speaker: "Draco",
        text: "I can use my gifts to help.",
        translation: "Aku bisa menggunakan kelebihanku untuk membantu.",
      },
      {
        speaker: "Narrator",
        text: "His kingdom became kinder and brighter.",
        translation: "Kerajaannya menjadi lebih baik dan lebih cerah.",
      },
    ],
    practicePrompt: "Ajak anak menyebut bakatnya: I can use my voice to help.",
  },
];

export const video14: DigitalStory = {
  id: "video14",
  number: 14,
  title: "Draco's Kind Wings",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Draco's-Kind-Wings.jpg",
  videoPreviewUrl: drivePreview("1hQdfsC32njwD9DGzUKA-_OeF5GLcwZPZ"),
  videoViewUrl: driveView("1hQdfsC32njwD9DGzUKA-_OeF5GLcwZPZ"),
  pdfPreviewUrl: drivePreview("11udaFr_WC9Ha4b-0ugikkm84kY9BRSNZ"),
  pdfViewUrl: "https://drive.google.com/file/d/11udaFr_WC9Ha4b-0ugikkm84kY9BRSNZ/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Draco, seekor naga ungu yang tinggal di negeri jauh. Ia memiliki sisik berkilau dan sayap megah yang bersinar indah di bawah cahaya matahari.",
    "Suatu hari saat terbang tinggi, Draco melihat sekelompok makhluk kecil yang tampak tersesat dan khawatir. Ia menawarkan bantuan, lalu seekor gnome kecil menjelaskan bahwa mereka sedang mencari desa mereka.",
    "Draco turun dengan lembut dan menawarkan tumpangan di punggungnya. Ia membawa para gnome melewati bukit dan lembah sampai mereka tiba di desa dengan selamat. Para gnome pun berterima kasih dengan gembira.",
    "Setelah merasakan kehangatan di hatinya, Draco ingin membantu lebih banyak. Ia lalu melihat keluarga burung yang kesulitan membangun sarang, kemudian menggunakan napas apinya dengan lembut untuk menghangatkan ranting agar mudah dianyam.",
    "Draco menyadari bahwa membantu orang lain membawa kegembiraan. Sejak saat itu, ia terbang ke berbagai tempat dengan sayap baik dan suara lembutnya untuk menolong makhluk yang membutuhkan, sehingga kerajaannya menjadi lebih cerah dan ramah.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
