import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "Who were the three friends in the story?",
    options: ["Sam, Leo, and Max", "Jack, Sam, and Lin", "Nali, Tariq, and Zane", "Kiko, Lila, and Max"],
    answer: "Sam, Leo, and Max",
  },
  {
    question: "Where did the friends live?",
    options: ["In a cozy town", "On a beach island", "In a rainforest", "Beside a snowy mountain"],
    answer: "In a cozy town",
  },
  {
    question: "What did the friends love doing together?",
    options: ["Solving puzzles", "Building boats", "Playing drums", "Cooking soup"],
    answer: "Solving puzzles",
  },
  {
    question: "What did Leo find one day?",
    options: ["A special puzzle box", "A golden compass", "A red bucket", "A toy telescope"],
    answer: "A special puzzle box",
  },
  {
    question: "How many pieces did the puzzle have?",
    options: ["Three", "Five", "Seven", "Ten"],
    answer: "Three",
  },
  {
    question: "What word was on Sam's piece?",
    options: ["Kindness", "Sharing", "Caring", "Friendship"],
    answer: "Kindness",
  },
  {
    question: "What word was on Leo's piece?",
    options: ["Sharing", "Kindness", "Caring", "Puzzle"],
    answer: "Sharing",
  },
  {
    question: "What word was on Max's piece?",
    options: ["Caring", "Magic", "Home", "Smile"],
    answer: "Caring",
  },
  {
    question: "What happened when they put the pieces together?",
    options: ["The puzzle glowed", "The puzzle broke", "The box disappeared", "It started raining"],
    answer: "The puzzle glowed",
  },
  {
    question: "What did Leo say after seeing the puzzle glow?",
    options: ["It's a kindness puzzle!", "Let's hide it!", "This is too heavy!", "The puzzle is lost!"],
    answer: "It's a kindness puzzle!",
  },
  {
    question: "What did the friends realize?",
    options: ["Kindness is like a puzzle", "Puzzles should be solved alone", "Only one piece matters", "Kindness is not important"],
    answer: "Kindness is like a puzzle",
  },
  {
    question: "What did they do from that day on?",
    options: ["Looked for kindness every day", "Stopped helping others", "Kept the puzzle hidden", "Moved away from town"],
    answer: "Looked for kindness every day",
  },
  {
    question: "How did each kind act change the world?",
    options: ["It made the world brighter and happier", "It made everyone sleepy", "It made the puzzle smaller", "It made the town darker"],
    answer: "It made the world brighter and happier",
  },
  {
    question: "What did the story say kindness means?",
    options: ["Helping, sharing, and caring", "Winning, hiding, and shouting", "Running, jumping, and eating", "Sleeping, waiting, and forgetting"],
    answer: "Helping, sharing, and caring",
  },
  {
    question: "What did the friends promise?",
    options: ["To solve the puzzle of kindness every day", "To never share again", "To lose the puzzle pieces", "To stop being friends"],
    answer: "To solve the puzzle of kindness every day",
  },
  {
    question: "Which word means kebaikan?",
    options: ["Kindness", "Puzzle", "Town", "Piece"],
    answer: "Kindness",
  },
  {
    question: "Which word means berbagi?",
    options: ["Sharing", "Caring", "Glowed", "Found"],
    answer: "Sharing",
  },
  {
    question: "Which word means peduli?",
    options: ["Caring", "Cozy", "Puzzle", "Special"],
    answer: "Caring",
  },
  {
    question: "What kind of story is The Puzzle of Kindness?",
    options: ["A gentle story about friendship and helping others", "A scary monster story", "A story about racing cars", "A story with no lesson"],
    answer: "A gentle story about friendship and helping others",
  },
  {
    question: "What is the main message of the story?",
    options: ["Small acts of kindness can make life brighter", "Only puzzles are important", "Friends should compete all the time", "Helping others is useless"],
    answer: "Small acts of kindness can make life brighter",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["puzzle", "teka-teki / puzzle", "ˈpʌzl"],
  ["kindness", "kebaikan", "ˈkaɪndnəs"],
  ["cozy", "nyaman", "ˈkoʊzi"],
  ["town", "kota kecil", "taʊn"],
  ["friends", "teman-teman", "frendz"],
  ["solving", "memecahkan / menyelesaikan", "ˈsɑːlvɪŋ"],
  ["found", "menemukan", "faʊnd"],
  ["special", "istimewa", "ˈspeʃl"],
  ["box", "kotak", "bɑːks"],
  ["pieces", "potongan-potongan", "ˈpiːsɪz"],
  ["red", "merah", "red"],
  ["blue", "biru", "bluː"],
  ["yellow", "kuning", "ˈjeloʊ"],
  ["sharing", "berbagi", "ˈʃerɪŋ"],
  ["caring", "peduli / perhatian", "ˈkerɪŋ"],
  ["fit", "cocok / pas", "fɪt"],
  ["together", "bersama-sama", "təˈɡeðər"],
  ["glowed", "bercahaya", "ɡloʊd"],
  ["smiling", "tersenyum", "ˈsmaɪlɪŋ"],
  ["realized", "menyadari", "ˈriːəlaɪzd"],
  ["important", "penting", "ɪmˈpɔːrtnt"],
  ["helping", "membantu", "ˈhelpɪŋ"],
  ["share", "berbagi", "ʃer"],
  ["care", "peduli", "ker"],
  ["perfect", "sempurna / cocok", "ˈpɜːrfɪkt"],
  ["friendship", "persahabatan", "ˈfrendʃɪp"],
  ["brighter", "lebih cerah", "ˈbraɪtər"],
  ["happier", "lebih bahagia", "ˈhæpiər"],
  ["promise", "janji", "ˈprɑːmɪs"],
  ["every day", "setiap hari", "ˈevri deɪ"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Let's solve it together.",
    meaning: "Ayo kita selesaikan bersama.",
    useCase: "Dipakai saat mengajak teman menyelesaikan tugas atau masalah bersama.",
    dialog: [
      {
        speaker: "Sam",
        text: "This puzzle looks tricky. Let's solve it together.",
        translation: "Puzzle ini terlihat sulit. Ayo kita selesaikan bersama.",
      },
      {
        speaker: "Leo",
        text: "Yes, teamwork will help us.",
        translation: "Ya, kerja sama akan membantu kita.",
      },
    ],
    practicePrompt: "Gunakan saat belajar kelompok: Let's solve it together.",
  },
  {
    expression: "I found a piece.",
    meaning: "Aku menemukan satu potongan.",
    useCase: "Dipakai saat menemukan bagian penting dari permainan atau tugas.",
    dialog: [
      {
        speaker: "Leo",
        text: "I found a piece with the word kindness.",
        translation: "Aku menemukan potongan dengan kata kindness.",
      },
      {
        speaker: "Max",
        text: "Great! Maybe it fits in the middle.",
        translation: "Bagus! Mungkin itu cocok di tengah.",
      },
    ],
    practicePrompt: "Latih dengan benda nyata: I found a piece. Where does it go?",
  },
  {
    expression: "Where does it fit?",
    meaning: "Ini cocok di mana?",
    useCase: "Dipakai saat mencari tempat yang tepat untuk sesuatu.",
    dialog: [
      {
        speaker: "Max",
        text: "Where does this orange piece fit?",
        translation: "Potongan oranye ini cocok di mana?",
      },
      {
        speaker: "Sam",
        text: "Try putting it next to sharing.",
        translation: "Coba letakkan di sebelah sharing.",
      },
    ],
    practicePrompt: "Gunakan saat bermain puzzle: Where does it fit? Try here.",
  },
  {
    expression: "That was kind of you.",
    meaning: "Itu baik sekali darimu.",
    useCase: "Dipakai untuk memuji tindakan baik teman.",
    dialog: [
      {
        speaker: "Leo",
        text: "I shared my red piece with Max.",
        translation: "Aku berbagi potongan merahku dengan Max.",
      },
      {
        speaker: "Sam",
        text: "That was kind of you.",
        translation: "Itu baik sekali darimu.",
      },
    ],
    practicePrompt: "Latih memberi pujian: That was kind of you. Thank you.",
  },
  {
    expression: "Let's share the pieces.",
    meaning: "Ayo berbagi potongannya.",
    useCase: "Dipakai agar semua anak ikut berpartisipasi.",
    dialog: [
      {
        speaker: "Sam",
        text: "Let's share the pieces so everyone can help.",
        translation: "Ayo berbagi potongannya agar semua bisa membantu.",
      },
      {
        speaker: "Max",
        text: "I will take the blue one.",
        translation: "Aku akan mengambil yang biru.",
      },
    ],
    practicePrompt: "Saat bermain, latih: Let's share the pieces. Everyone gets a turn.",
  },
  {
    expression: "I care about you.",
    meaning: "Aku peduli padamu.",
    useCase: "Dipakai untuk menunjukkan perhatian kepada teman.",
    dialog: [
      {
        speaker: "Max",
        text: "You look sad, Leo. I care about you.",
        translation: "Kamu terlihat sedih, Leo. Aku peduli padamu.",
      },
      {
        speaker: "Leo",
        text: "Thank you. I just need a little help.",
        translation: "Terima kasih. Aku hanya butuh sedikit bantuan.",
      },
    ],
    practicePrompt: "Ajak anak mengulang dengan lembut: I care about you.",
  },
  {
    expression: "Can I help?",
    meaning: "Bolehkah aku membantu?",
    useCase: "Dipakai saat menawarkan bantuan secara singkat dan sopan.",
    dialog: [
      {
        speaker: "Sam",
        text: "Can I help you find the yellow piece?",
        translation: "Bolehkah aku membantumu mencari potongan kuning?",
      },
      {
        speaker: "Leo",
        text: "Yes, please. That would be great.",
        translation: "Ya, tolong. Itu akan sangat membantu.",
      },
    ],
    practicePrompt: "Latih respons: Can I help? Yes, please. No, thank you.",
  },
  {
    expression: "Kindness is important.",
    meaning: "Kebaikan itu penting.",
    useCase: "Dipakai untuk menyampaikan nilai utama cerita.",
    dialog: [
      {
        speaker: "Puzzle",
        text: "Kindness is important in every friendship.",
        translation: "Kebaikan itu penting dalam setiap persahabatan.",
      },
      {
        speaker: "Friends",
        text: "We will remember that every day.",
        translation: "Kami akan mengingat itu setiap hari.",
      },
    ],
    practicePrompt: "Diskusikan: Why is kindness important at school?",
  },
  {
    expression: "It makes the world brighter.",
    meaning: "Itu membuat dunia lebih cerah.",
    useCase: "Dipakai untuk menggambarkan dampak positif dari kebaikan.",
    dialog: [
      {
        speaker: "Leo",
        text: "Helping, sharing, and caring make people smile.",
        translation: "Membantu, berbagi, dan peduli membuat orang tersenyum.",
      },
      {
        speaker: "Sam",
        text: "Yes, it makes the world brighter.",
        translation: "Ya, itu membuat dunia lebih cerah.",
      },
    ],
    practicePrompt: "Ajak anak membuat kalimat: A smile makes the world brighter.",
  },
  {
    expression: "I promise to be kind.",
    meaning: "Aku berjanji untuk berbuat baik.",
    useCase: "Dipakai saat membuat komitmen setelah belajar pesan moral.",
    dialog: [
      {
        speaker: "Max",
        text: "I promise to be kind every day.",
        translation: "Aku berjanji untuk berbuat baik setiap hari.",
      },
      {
        speaker: "Sam",
        text: "Me too. Let's start with small actions.",
        translation: "Aku juga. Ayo mulai dengan tindakan kecil.",
      },
    ],
    practicePrompt: "Minta anak membuat janji sederhana: I promise to share. I promise to care.",
  },
];


export const video7: DigitalStory = {
  id: "video7",
  number: 7,
  title: "The Puzzle of Kindness",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/The-Puzzle-of-Kindness.jpg",
  videoPreviewUrl: drivePreview("1Tvtzs7KSJAQXofFupJCq_ic3sD9Aouhl"),
  videoViewUrl: driveView("1Tvtzs7KSJAQXofFupJCq_ic3sD9Aouhl"),
  pdfPreviewUrl: drivePreview("11NsmHdRsFBDvPeklmCB8iQyapcRftbyn"),
  pdfViewUrl: "https://drive.google.com/file/d/11NsmHdRsFBDvPeklmCB8iQyapcRftbyn/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan tiga sahabat, Sam, Leo, dan Max, yang tinggal di kota kecil yang nyaman dan sangat suka menyelesaikan puzzle bersama.",
  "Suatu hari Leo menemukan sebuah kotak puzzle istimewa berisi tiga potongan. Setiap potongan memiliki kata yang berbeda: kindness, sharing, dan caring.",
  "Ketika mereka menyatukan potongan-potongan itu, puzzle bercahaya dan membuat mereka memahami bahwa kebaikan seperti puzzle: setiap tindakan membantu, berbagi, dan peduli adalah bagian yang penting.",
  "Sejak hari itu, mereka mencari cara untuk berbuat baik setiap hari. Cerita ini mengajarkan bahwa tindakan kecil penuh kebaikan dapat membuat dunia terasa lebih cerah, bahagia, dan penuh persahabatan."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
