import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Iggy's Helpful Heart", "The Helpful Hive", "The Kindness Seed", "Timmy the Happy Turtle"],
    answer: "Iggy's Helpful Heart",
  },
  {
    question: "Who is the main character?",
    options: ["Iggy", "Buzz", "Maya", "Alex"],
    answer: "Iggy",
  },
  {
    question: "What kind of animal is Iggy?",
    options: ["An iguana", "A bee", "A turtle", "A koala"],
    answer: "An iguana",
  },
  {
    question: "Where did Iggy live?",
    options: ["In a sunny jungle", "In a snowy mountain", "In a city school", "Under the sea"],
    answer: "In a sunny jungle",
  },
  {
    question: "What did Iggy love doing?",
    options: ["Basking in the warm sun and exploring", "Sleeping all day", "Collecting shells", "Driving a car"],
    answer: "Basking in the warm sun and exploring",
  },
  {
    question: "Who did Iggy spot while climbing a tree?",
    options: ["A lost bird", "A lost turtle", "A lost rabbit", "A lost bee"],
    answer: "A lost bird",
  },
  {
    question: "What was the bird doing?",
    options: ["Chirping sadly", "Laughing loudly", "Swimming fast", "Planting seeds"],
    answer: "Chirping sadly",
  },
  {
    question: "What did Iggy ask the bird?",
    options: ["Can I help?", "Can I race?", "Can I sleep?", "Can I hide?"],
    answer: "Can I help?",
  },
  {
    question: "What did the bird need?",
    options: ["Its nest", "A toy car", "A school bag", "A compass"],
    answer: "Its nest",
  },
  {
    question: "Where did Iggy lead the bird?",
    options: ["To a cozy nook in a tree", "To a river stone", "To a classroom", "To the beach"],
    answer: "To a cozy nook in a tree",
  },
  {
    question: "How did the bird thank Iggy?",
    options: ["It chirped, 'Thank you, Iggy!'", "It ran away", "It gave him a puzzle", "It ignored him"],
    answer: "It chirped, 'Thank you, Iggy!'",
  },
  {
    question: "How did Iggy feel after helping the bird?",
    options: ["Happy inside", "Angry inside", "Sleepy inside", "Lonely inside"],
    answer: "Happy inside",
  },
  {
    question: "Who did Iggy find later?",
    options: ["A monkey with tangled vines", "A butterfly with a broken wing", "A boy with a cape", "A deer near a stream"],
    answer: "A monkey with tangled vines",
  },
  {
    question: "What problem did the monkey have?",
    options: ["Its vines were tangled", "It lost a medal", "It was afraid of school", "It could not find a hive"],
    answer: "Its vines were tangled",
  },
  {
    question: "Who helped untangle the vines?",
    options: ["Iggy and his jungle friends", "Only the monkey", "A group of children", "The river stones"],
    answer: "Iggy and his jungle friends",
  },
  {
    question: "What did the monkey say?",
    options: ["Thank you, Iggy!", "Go away, Iggy!", "I do not need help", "The garden is empty"],
    answer: "Thank you, Iggy!",
  },
  {
    question: "What did Iggy realize?",
    options: ["Helping made him feel grateful", "Helping made him tired forever", "Exploring was boring", "The jungle was unfriendly"],
    answer: "Helping made him feel grateful",
  },
  {
    question: "What did Iggy look for from that day on?",
    options: ["Ways to lend a hand", "Ways to hide", "Ways to stop helping", "Ways to leave the jungle"],
    answer: "Ways to lend a hand",
  },
  {
    question: "What effect did Iggy's kindness have on the jungle?",
    options: ["It made the jungle happier and friendlier", "It made the jungle darker", "It made everyone fight", "It changed the jungle into a city"],
    answer: "It made the jungle happier and friendlier",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["A helpful heart can make others happy", "Never help anyone", "Only big animals can be kind", "Kindness is not important"],
    answer: "A helpful heart can make others happy",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["helpful", "suka membantu", "ˈhelpfl"],
  ["heart", "hati", "hɑːrt"],
  ["Iggy", "Iggy / nama iguana", "ˈɪɡi"],
  ["iguana", "iguana", "ɪˈɡwɑːnə"],
  ["sunny", "cerah", "ˈsʌni"],
  ["jungle", "hutan tropis", "ˈdʒʌŋɡl"],
  ["basking", "berjemur", "ˈbæskɪŋ"],
  ["warm", "hangat", "wɔːrm"],
  ["exploring", "menjelajah", "ɪkˈsplɔːrɪŋ"],
  ["greenery", "pepohonan hijau", "ˈɡriːnəri"],
  ["climbing", "memanjat", "ˈklaɪmɪŋ"],
  ["spotted", "melihat / memperhatikan", "ˈspɑːtɪd"],
  ["lost", "tersesat", "lɔːst"],
  ["bird", "burung", "bɜːrd"],
  ["chirping", "berkicau", "ˈtʃɜːrpɪŋ"],
  ["sadly", "dengan sedih", "ˈsædli"],
  ["fluttered", "mengepak-ngepak", "ˈflʌtərd"],
  ["closer", "lebih dekat", "ˈkloʊsər"],
  ["nest", "sarang burung", "nest"],
  ["moment", "sebentar / momen", "ˈmoʊmənt"],
  ["cozy", "nyaman", "ˈkoʊzi"],
  ["nook", "sudut kecil", "nʊk"],
  ["thanked", "berterima kasih", "θæŋkt"],
  ["continued", "melanjutkan", "kənˈtɪnjuːd"],
  ["monkey", "monyet", "ˈmʌŋki"],
  ["tangled", "kusut / terlilit", "ˈtæŋɡld"],
  ["vines", "tanaman merambat", "vaɪnz"],
  ["friends", "teman-teman", "frendz"],
  ["grateful", "bersyukur", "ˈɡreɪtfl"],
  ["kindness", "kebaikan", "ˈkaɪndnəs"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Can I help?",
    meaning: "Bolehkah aku membantu?",
    useCase: "Dipakai saat ingin menawarkan bantuan dengan singkat dan ramah.",
    dialog: [
      {
        speaker: "Iggy",
        text: "Can I help?",
        translation: "Bolehkah aku membantu?",
      },
      {
        speaker: "Bird",
        text: "Yes. I need my nest.",
        translation: "Ya. Aku membutuhkan sarangku.",
      },
    ],
    practicePrompt: "Latih tawaran bantuan: Can I help? Yes, please.",
  },
  {
    expression: "I need my nest.",
    meaning: "Aku membutuhkan sarangku.",
    useCase: "Dipakai untuk menyampaikan kebutuhan utama dalam situasi sulit.",
    dialog: [
      {
        speaker: "Bird",
        text: "I need my nest.",
        translation: "Aku membutuhkan sarangku.",
      },
      {
        speaker: "Iggy",
        text: "I will help you find it.",
        translation: "Aku akan membantumu menemukannya.",
      },
    ],
    practicePrompt: "Ganti benda: I need my book. I need my bag.",
  },
  {
    expression: "I will help you.",
    meaning: "Aku akan membantumu.",
    useCase: "Dipakai untuk memberi janji bantuan secara sederhana.",
    dialog: [
      {
        speaker: "Iggy",
        text: "I will help you.",
        translation: "Aku akan membantumu.",
      },
      {
        speaker: "Bird",
        text: "Thank you, Iggy.",
        translation: "Terima kasih, Iggy.",
      },
    ],
    practicePrompt: "Latih kalimat dukungan: I will help you.",
  },
  {
    expression: "Follow me.",
    meaning: "Ikuti aku.",
    useCase: "Dipakai saat mengajak seseorang menuju tempat yang aman.",
    dialog: [
      {
        speaker: "Iggy",
        text: "Follow me to a cozy nook.",
        translation: "Ikuti aku ke sudut kecil yang nyaman.",
      },
      {
        speaker: "Bird",
        text: "I am coming.",
        translation: "Aku ikut.",
      },
    ],
    practicePrompt: "Latih instruksi pendek: Follow me. Come here.",
  },
  {
    expression: "Thank you, Iggy!",
    meaning: "Terima kasih, Iggy!",
    useCase: "Dipakai untuk berterima kasih setelah ditolong.",
    dialog: [
      {
        speaker: "Bird",
        text: "Thank you, Iggy!",
        translation: "Terima kasih, Iggy!",
      },
      {
        speaker: "Iggy",
        text: "You are welcome.",
        translation: "Sama-sama.",
      },
    ],
    practicePrompt: "Latih pasangan ekspresi: Thank you. You are welcome.",
  },
  {
    expression: "I feel happy inside.",
    meaning: "Aku merasa bahagia di dalam hati.",
    useCase: "Dipakai untuk menceritakan perasaan setelah melakukan kebaikan.",
    dialog: [
      {
        speaker: "Iggy",
        text: "I feel happy inside.",
        translation: "Aku merasa bahagia di dalam hati.",
      },
      {
        speaker: "Narrator",
        text: "He continued exploring, eager to help more.",
        translation: "Ia melanjutkan penjelajahan, ingin membantu lebih banyak.",
      },
    ],
    practicePrompt: "Ajak anak menyebut perasaan: I feel happy inside.",
  },
  {
    expression: "I found a monkey.",
    meaning: "Aku menemukan seekor monyet.",
    useCase: "Dipakai untuk menceritakan apa yang ditemukan dalam petualangan.",
    dialog: [
      {
        speaker: "Iggy",
        text: "I found a monkey with tangled vines.",
        translation: "Aku menemukan monyet dengan tanaman merambat yang kusut.",
      },
      {
        speaker: "Monkey",
        text: "Can you help me?",
        translation: "Bisakah kamu membantuku?",
      },
    ],
    practicePrompt: "Latih kalimat laporan: I found a bird. I found a flower.",
  },
  {
    expression: "Let's untangle the vines.",
    meaning: "Ayo kita uraikan tanaman merambat ini.",
    useCase: "Dipakai untuk mengajak teman menyelesaikan masalah bersama.",
    dialog: [
      {
        speaker: "Iggy",
        text: "Let's untangle the vines together.",
        translation: "Ayo kita uraikan tanaman merambat ini bersama-sama.",
      },
      {
        speaker: "Friends",
        text: "We can help!",
        translation: "Kami bisa membantu!",
      },
    ],
    practicePrompt: "Latih ajakan kerja sama: Let's help together.",
  },
  {
    expression: "You are kind.",
    meaning: "Kamu baik hati.",
    useCase: "Dipakai untuk memuji sikap baik seseorang.",
    dialog: [
      {
        speaker: "Monkey",
        text: "Thank you, Iggy. You are kind.",
        translation: "Terima kasih, Iggy. Kamu baik hati.",
      },
      {
        speaker: "Iggy",
        text: "I am glad you are safe.",
        translation: "Aku senang kamu aman.",
      },
    ],
    practicePrompt: "Ajak anak memuji teman: You are kind.",
  },
  {
    expression: "I want to lend a hand.",
    meaning: "Aku ingin membantu.",
    useCase: "Dipakai untuk menyatakan niat membantu orang lain.",
    dialog: [
      {
        speaker: "Iggy",
        text: "I want to lend a hand.",
        translation: "Aku ingin membantu.",
      },
      {
        speaker: "Narrator",
        text: "From that day on, Iggy looked for ways to help.",
        translation: "Sejak hari itu, Iggy mencari cara untuk membantu.",
      },
    ],
    practicePrompt: "Latih idiom ringan: lend a hand means help.",
  },
];

export const video13: DigitalStory = {
  id: "video13",
  number: 13,
  title: "Iggy's Helpful Heart",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Iggy's-Helpful-Heart.jpg",
  videoPreviewUrl: drivePreview("1PFYKNKwaxjjW2y8mnhd-38WiqPqi8HgA"),
  videoViewUrl: driveView("1PFYKNKwaxjjW2y8mnhd-38WiqPqi8HgA"),
  pdfPreviewUrl: drivePreview("11EFG39efF5u3sXFavDCydEHnozaUr8jF"),
  pdfViewUrl: "https://drive.google.com/file/d/11EFG39efF5u3sXFavDCydEHnozaUr8jF/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Iggy, seekor iguana ramah yang tinggal di hutan tropis yang cerah. Ia suka berjemur di bawah sinar matahari hangat dan menjelajah di antara pepohonan hijau.",
    "Saat memanjat pohon, Iggy melihat seekor burung kecil yang tersesat dan berkicau sedih. Iggy bertanya apakah ia bisa membantu, lalu mendengarkan ketika burung itu berkata bahwa ia membutuhkan sarangnya.",
    "Iggy berpikir sejenak dan menuntun burung itu ke sudut pohon yang nyaman. Burung kecil merasa aman, lalu berterima kasih kepada Iggy karena telah membantunya menemukan tempat berlindung.",
    "Setelah itu, Iggy melanjutkan penjelajahannya dan bertemu seekor monyet yang terlilit tanaman merambat. Iggy memanggil teman-teman hutannya, dan bersama-sama mereka menguraikan tanaman itu sampai monyet bebas.",
    "Iggy merasa bahagia dan bersyukur karena membantu orang lain membuat hatinya hangat. Sejak hari itu, ia selalu mencari cara untuk mengulurkan tangan, dan kebaikannya membuat hutan menjadi tempat yang lebih ramah bagi semua penghuni.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
