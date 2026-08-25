import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["The Helpful Hive", "The Kindness Seed", "The Happy Turtle", "The Puzzle of Kindness"],
    answer: "The Helpful Hive",
  },
  {
    question: "Who is the main bee in the story?",
    options: ["Buzz", "Maya", "Kiko", "Ken"],
    answer: "Buzz",
  },
  {
    question: "What did Buzz love doing?",
    options: ["Flying and exploring", "Sleeping and hiding", "Running and racing", "Building boats"],
    answer: "Flying and exploring",
  },
  {
    question: "Who was struggling to fly?",
    options: ["A butterfly", "A bird", "An ant", "A turtle"],
    answer: "A butterfly",
  },
  {
    question: "What did Buzz ask the butterfly?",
    options: ["Can I help you?", "Can you run fast?", "Where is my toy?", "Do you like honey?"],
    answer: "Can I help you?",
  },
  {
    question: "Why could the butterfly not fly?",
    options: ["It had a broken wing", "It was sleeping", "It was too young", "It lost its flower"],
    answer: "It had a broken wing",
  },
  {
    question: "Who did Buzz ask for help?",
    options: ["The other bees", "The river stones", "The village children", "The old turtle"],
    answer: "The other bees",
  },
  {
    question: "Where did the bees carry the butterfly?",
    options: ["To the sweetest flowers", "To a classroom", "To a mountain cave", "To a racing track"],
    answer: "To the sweetest flowers",
  },
  {
    question: "How did the butterfly feel after being helped?",
    options: ["Thankful", "Angry", "Sleepy", "Jealous"],
    answer: "Thankful",
  },
  {
    question: "How did Buzz feel after helping the butterfly?",
    options: ["Happy", "Sad", "Afraid", "Bored"],
    answer: "Happy",
  },
  {
    question: "What happened during the rainstorm?",
    options: ["A family of ants needed shelter", "The bees went to school", "The flowers disappeared", "Buzz found a compass"],
    answer: "A family of ants needed shelter",
  },
  {
    question: "Where did Buzz invite the ants?",
    options: ["Into the hive", "Into the ocean", "Onto a kite", "Inside a book"],
    answer: "Into the hive",
  },
  {
    question: "What did the ants say about Buzz?",
    options: ["You are very kind", "You are too loud", "You are lost", "You are sleepy"],
    answer: "You are very kind",
  },
  {
    question: "What happened to the bird?",
    options: ["It got stuck in a net", "It built a nest", "It won a race", "It planted a seed"],
    answer: "It got stuck in a net",
  },
  {
    question: "How did the bees help the bird?",
    options: ["They worked together and freed the bird", "They ignored the bird", "They hid in flowers", "They asked the bird to swim"],
    answer: "They worked together and freed the bird",
  },
  {
    question: "What did the bird say to Buzz and the bees?",
    options: ["You are amazing", "Go away", "I dislike bees", "The hive is too small"],
    answer: "You are amazing",
  },
  {
    question: "What did Buzz realize?",
    options: ["Helping made everyone happy", "Helping was useless", "Flying was boring", "Flowers were scary"],
    answer: "Helping made everyone happy",
  },
  {
    question: "What did Buzz and the bees do from that day on?",
    options: ["Helped all in need", "Stopped helping", "Moved away", "Slept all day"],
    answer: "Helped all in need",
  },
  {
    question: "What filled the air around the hive?",
    options: ["Kindness", "Anger", "Snow", "Noise only"],
    answer: "Kindness",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Helping others makes the world happier", "Never help friends", "Only bees need kindness", "Exploring is always bad"],
    answer: "Helping others makes the world happier",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["helpful", "suka membantu", "ˈhelpfl"],
  ["hive", "sarang lebah", "haɪv"],
  ["Buzz", "Buzz / nama lebah", "bʌz"],
  ["bee", "lebah", "biː"],
  ["flying", "terbang", "ˈflaɪɪŋ"],
  ["exploring", "menjelajah", "ɪkˈsplɔːrɪŋ"],
  ["butterfly", "kupu-kupu", "ˈbʌtərflaɪ"],
  ["struggling", "kesulitan / berjuang", "ˈstrʌɡlɪŋ"],
  ["broken", "patah / rusak", "ˈbroʊkən"],
  ["wing", "sayap", "wɪŋ"],
  ["idea", "ide", "aɪˈdiːə"],
  ["asked", "meminta / bertanya", "æskt"],
  ["bees", "lebah-lebah", "biːz"],
  ["together", "bersama-sama", "təˈɡeðər"],
  ["carried", "membawa", "ˈkærid"],
  ["sweetest", "paling manis", "ˈswiːtɪst"],
  ["flowers", "bunga-bunga", "ˈflaʊərz"],
  ["smiled", "tersenyum", "smaɪld"],
  ["helping", "membantu", "ˈhelpɪŋ"],
  ["rainstorm", "hujan badai", "ˈreɪnstɔːrm"],
  ["family", "keluarga", "ˈfæməli"],
  ["ants", "semut-semut", "ænts"],
  ["shelter", "tempat berlindung", "ˈʃeltər"],
  ["grateful", "bersyukur / berterima kasih", "ˈɡreɪtfl"],
  ["kind", "baik hati", "kaɪnd"],
  ["proud", "bangga", "praʊd"],
  ["bird", "burung", "bɜːrd"],
  ["stuck", "tersangkut", "stʌk"],
  ["net", "jaring", "net"],
  ["kindness", "kebaikan", "ˈkaɪndnəs"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Can I help you?",
    meaning: "Bisakah aku membantumu?",
    useCase: "Dipakai saat melihat seseorang kesulitan dan ingin menawarkan bantuan.",
    dialog: [
      {
        speaker: "Buzz",
        text: "Can I help you?",
        translation: "Bisakah aku membantumu?",
      },
      {
        speaker: "Butterfly",
        text: "Yes, please. My wing is broken.",
        translation: "Ya, tolong. Sayapku patah.",
      },
    ],
    practicePrompt: "Latih dengan teman: Can I help you? Yes, please.",
  },
  {
    expression: "I have a broken wing.",
    meaning: "Sayapku patah.",
    useCase: "Dipakai untuk menjelaskan masalah atau kondisi tubuh dalam cerita.",
    dialog: [
      {
        speaker: "Butterfly",
        text: "I have a broken wing. I can't fly.",
        translation: "Sayapku patah. Aku tidak bisa terbang.",
      },
      {
        speaker: "Buzz",
        text: "I am sorry. I will find help.",
        translation: "Aku turut sedih. Aku akan mencari bantuan.",
      },
    ],
    practicePrompt: "Latih pola masalah: I have a broken toy. I can't use it.",
  },
  {
    expression: "I have an idea.",
    meaning: "Aku punya ide.",
    useCase: "Dipakai saat anak menemukan solusi untuk membantu.",
    dialog: [
      {
        speaker: "Buzz",
        text: "I have an idea. I will ask the other bees.",
        translation: "Aku punya ide. Aku akan meminta bantuan lebah-lebah lain.",
      },
      {
        speaker: "Butterfly",
        text: "Thank you, Buzz.",
        translation: "Terima kasih, Buzz.",
      },
    ],
    practicePrompt: "Ajak anak melengkapi: I have an idea. Let's...",
  },
  {
    expression: "Let's help together.",
    meaning: "Ayo membantu bersama.",
    useCase: "Dipakai untuk mengajak kelompok bekerja sama membantu seseorang.",
    dialog: [
      {
        speaker: "Buzz",
        text: "Let's help together and carry the butterfly.",
        translation: "Ayo membantu bersama dan membawa kupu-kupu.",
      },
      {
        speaker: "Bees",
        text: "Yes! We can carry her to the flowers.",
        translation: "Ya! Kita bisa membawanya ke bunga-bunga.",
      },
    ],
    practicePrompt: "Latih saat kerja kelompok: Let's help together.",
  },
  {
    expression: "Thank you, Buzz.",
    meaning: "Terima kasih, Buzz.",
    useCase: "Dipakai untuk berterima kasih setelah menerima bantuan.",
    dialog: [
      {
        speaker: "Butterfly",
        text: "Thank you, Buzz, and all the bees!",
        translation: "Terima kasih, Buzz, dan semua lebah!",
      },
      {
        speaker: "Buzz",
        text: "You are welcome. We are happy to help.",
        translation: "Sama-sama. Kami senang membantu.",
      },
    ],
    practicePrompt: "Latih respons: Thank you. You are welcome.",
  },
  {
    expression: "Please come into the hive.",
    meaning: "Silakan masuk ke sarang lebah.",
    useCase: "Dipakai saat menawarkan tempat berlindung atau mengundang seseorang masuk.",
    dialog: [
      {
        speaker: "Buzz",
        text: "Please come into the hive. You can stay dry here.",
        translation: "Silakan masuk ke sarang lebah. Kalian bisa tetap kering di sini.",
      },
      {
        speaker: "Ants",
        text: "Thank you! We needed shelter.",
        translation: "Terima kasih! Kami membutuhkan tempat berlindung.",
      },
    ],
    practicePrompt: "Latih undangan sopan: Please come in. You can sit here.",
  },
  {
    expression: "You are very kind.",
    meaning: "Kamu sangat baik hati.",
    useCase: "Dipakai untuk memuji kebaikan seseorang.",
    dialog: [
      {
        speaker: "Ants",
        text: "Buzz, you are very kind!",
        translation: "Buzz, kamu sangat baik hati!",
      },
      {
        speaker: "Buzz",
        text: "Thank you. I like helping others.",
        translation: "Terima kasih. Aku suka membantu orang lain.",
      },
    ],
    practicePrompt: "Ajak anak memuji teman: You are very kind.",
  },
  {
    expression: "Can we help free the bird?",
    meaning: "Bisakah kita membantu membebaskan burung itu?",
    useCase: "Dipakai saat meminta kerja sama untuk menyelamatkan atau membantu.",
    dialog: [
      {
        speaker: "Buzz",
        text: "Can we help free the bird from the net?",
        translation: "Bisakah kita membantu membebaskan burung itu dari jaring?",
      },
      {
        speaker: "Bees",
        text: "Yes. Let's work together carefully.",
        translation: "Ya. Ayo bekerja sama dengan hati-hati.",
      },
    ],
    practicePrompt: "Latih pola: Can we help...? Let's work together.",
  },
  {
    expression: "You are amazing!",
    meaning: "Kalian luar biasa!",
    useCase: "Dipakai untuk memuji bantuan atau usaha besar.",
    dialog: [
      {
        speaker: "Bird",
        text: "Thank you, Buzz and the bees! You are amazing!",
        translation: "Terima kasih, Buzz dan para lebah! Kalian luar biasa!",
      },
      {
        speaker: "Buzz",
        text: "We are glad you are safe.",
        translation: "Kami senang kamu aman.",
      },
    ],
    practicePrompt: "Gunakan saat memberi pujian: You are amazing!",
  },
  {
    expression: "Helping makes everyone happy.",
    meaning: "Membantu membuat semua orang bahagia.",
    useCase: "Dipakai untuk menyimpulkan pesan moral cerita.",
    dialog: [
      {
        speaker: "Buzz",
        text: "Helping makes everyone happy.",
        translation: "Membantu membuat semua orang bahagia.",
      },
      {
        speaker: "Bees",
        text: "Let's keep kindness buzzing in the air.",
        translation: "Ayo terus membuat kebaikan berdengung di udara.",
      },
    ],
    practicePrompt: "Jadikan closing chant: Helping makes everyone happy.",
  },
];

export const video12: DigitalStory = {
  id: "video12",
  number: 12,
  title: "The Helpful Hive",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/The-Helpful-Hive.jpg",
  videoPreviewUrl: drivePreview("1kPkRAlkdrjMmBblCA8aw1iq-xswgV7aZ"),
  videoViewUrl: driveView("1kPkRAlkdrjMmBblCA8aw1iq-xswgV7aZ"),
  pdfPreviewUrl: drivePreview("1O-TKYgNfefsfGa7kS1yNmNZ9igvd9_FJ"),
  pdfViewUrl: "https://drive.google.com/file/d/1O-TKYgNfefsfGa7kS1yNmNZ9igvd9_FJ/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Buzz, seekor lebah kecil yang tinggal di taman bunga dekat sarang lebah yang hangat. Buzz suka terbang dan menjelajah di antara bunga-bunga.",
    "Suatu hari, Buzz melihat seekor kupu-kupu yang kesulitan terbang karena sayapnya patah. Buzz bertanya apakah ia bisa membantu, lalu meminta lebah-lebah lain untuk bersama-sama membawa kupu-kupu ke bunga-bunga yang paling manis.",
    "Tidak lama kemudian, hujan deras turun dan keluarga semut membutuhkan tempat berlindung. Buzz mengundang mereka masuk ke sarang lebah, sehingga para semut merasa aman dan sangat berterima kasih.",
    "Pada hari lain, seekor burung tersangkut di jaring. Buzz meminta para lebah membantu, dan mereka bekerja sama membebaskan burung itu. Burung tersebut berterima kasih dan memuji Buzz serta para lebah.",
    "Buzz menyadari bahwa membantu orang lain membuat semua orang bahagia. Sejak saat itu, Buzz dan para lebah selalu membantu siapa pun yang membutuhkan, sehingga sarang mereka menjadi tempat penuh kebaikan dan taman terasa lebih ramah.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
