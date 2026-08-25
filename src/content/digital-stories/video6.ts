import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "Where does the story take place?",
    options: ["In a sunny village by the beach", "In a snowy forest", "Inside a school bus", "On a mountain peak"],
    answer: "In a sunny village by the beach",
  },
  {
    question: "Who are the three friends in the story?",
    options: ["Nali, Tariq, and Zane", "Jack, Sam, and Lin", "Kiko, Lila, and Max", "Tim, Ben, and Leo"],
    answer: "Nali, Tariq, and Zane",
  },
  {
    question: "What toy did Nali have?",
    options: ["A colorful ball", "A red bucket", "A toy car", "A kite"],
    answer: "A colorful ball",
  },
  {
    question: "What toy did Tariq have?",
    options: ["A red bucket", "A yellow truck", "A blue compass", "A small drum"],
    answer: "A red bucket",
  },
  {
    question: "What toy did Zane have?",
    options: ["Toy cars", "A telescope", "A teddy bear", "A shell necklace"],
    answer: "Toy cars",
  },
  {
    question: "How did the children feel when they played alone?",
    options: ["Sad", "Excited", "Angry", "Sleepy"],
    answer: "Sad",
  },
  {
    question: "What did Zane suggest?",
    options: ["Let's share ours", "Let's go home", "Let's hide the toys", "Let's stop playing"],
    answer: "Let's share ours",
  },
  {
    question: "How did Nali and Tariq respond to Zane's idea?",
    options: ["They agreed", "They shouted no", "They ran away", "They hid the ball"],
    answer: "They agreed",
  },
  {
    question: "What happened after they shared their toys?",
    options: ["Everyone played together, laughing and having fun", "They all became bored", "The toys disappeared", "They stopped being friends"],
    answer: "Everyone played together, laughing and having fun",
  },
  {
    question: "What did Nali let Tariq do?",
    options: ["Kick the ball", "Drive the car", "Carry the bucket", "Draw a map"],
    answer: "Kick the ball",
  },
  {
    question: "What did Tariq let Zane do?",
    options: ["Use the bucket to build a castle", "Sleep in the sand", "Throw the bucket away", "Paint the village"],
    answer: "Use the bucket to build a castle",
  },
  {
    question: "How did the beach seem with each shared toy?",
    options: ["Brighter", "Darker", "Colder", "Quieter"],
    answer: "Brighter",
  },
  {
    question: "What did the little crab do?",
    options: ["Scuttled by and smiled", "Took the ball", "Built a wall", "Went to sleep"],
    answer: "Scuttled by and smiled",
  },
  {
    question: "What did Zane say sharing is like?",
    options: ["Magic", "A storm", "A race", "A puzzle"],
    answer: "Magic",
  },
  {
    question: "What did the children decide to do every time they went to the beach?",
    options: ["Bring their toys to share", "Bring no toys", "Play alone", "Leave before lunch"],
    answer: "Bring their toys to share",
  },
  {
    question: "What did the children discover?",
    options: ["The magic of making new friends", "A hidden cave", "A broken compass", "A rainy cloud"],
    answer: "The magic of making new friends",
  },
  {
    question: "Which word means berbagi?",
    options: ["Sharing", "Bucket", "Village", "Castle"],
    answer: "Sharing",
  },
  {
    question: "Which word means ember?",
    options: ["Bucket", "Ball", "Beach", "Friend"],
    answer: "Bucket",
  },
  {
    question: "Which word means tertawa?",
    options: ["Laughing", "Playing", "Scuttling", "Building"],
    answer: "Laughing",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Sharing can make play happier and help us make friends", "Toys should never be shared", "Playing alone is always best", "Beaches are only for buckets"],
    answer: "Sharing can make play happier and help us make friends",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["magical", "ajaib", "ˈmædʒɪkl"],
  ["sharing", "berbagi", "ˈʃerɪŋ"],
  ["sunny", "cerah", "ˈsʌni"],
  ["village", "desa", "ˈvɪlɪdʒ"],
  ["beach", "pantai", "biːtʃ"],
  ["friends", "teman-teman", "frendz"],
  ["playing", "bermain", "ˈpleɪɪŋ"],
  ["toys", "mainan", "tɔɪz"],
  ["colorful", "berwarna-warni", "ˈkʌlərfl"],
  ["ball", "bola", "bɔːl"],
  ["bucket", "ember", "ˈbʌkɪt"],
  ["toy cars", "mobil-mobil mainan", "tɔɪ kɑːrz"],
  ["sand", "pasir", "sænd"],
  ["alone", "sendirian", "əˈloʊn"],
  ["sad", "sedih", "sæd"],
  ["looked around", "melihat sekeliling", "lʊkt əˈraʊnd"],
  ["share", "berbagi", "ʃer"],
  ["agreed", "setuju", "əˈɡriːd"],
  ["together", "bersama-sama", "təˈɡeðər"],
  ["laughing", "tertawa", "ˈlæfɪŋ"],
  ["brighter", "lebih cerah", "ˈbraɪtər"],
  ["little crab", "kepiting kecil", "ˈlɪtl kræb"],
  ["scuttled", "berjalan cepat menyamping", "ˈskʌtld"],
  ["smiled", "tersenyum", "smaɪld"],
  ["castle", "istana", "ˈkæsl"],
  ["magic", "sihir / keajaiban", "ˈmædʒɪk"],
  ["decided", "memutuskan", "dɪˈsaɪdɪd"],
  ["discovered", "menemukan", "dɪˈskʌvərd"],
  ["happiest", "paling bahagia", "ˈhæpiəst"],
  ["laughter", "tawa", "ˈlæftər"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Can I play with you?",
    meaning: "Bolehkah aku bermain denganmu?",
    useCase: "Dipakai saat anak ingin bergabung bermain dengan teman.",
    dialog: [
      {
        speaker: "Zane",
        text: "Can I play with you, Nali?",
        translation: "Bolehkah aku bermain denganmu, Nali?",
      },
      {
        speaker: "Nali",
        text: "Yes, you can. Let's play together.",
        translation: "Ya, boleh. Ayo bermain bersama.",
      },
    ],
    practicePrompt: "Latih saat bermain: Can I play with you? Yes, you can.",
  },
  {
    expression: "Let's share our toys.",
    meaning: "Ayo berbagi mainan kita.",
    useCase: "Dipakai untuk mengajak teman berbagi saat bermain.",
    dialog: [
      {
        speaker: "Zane",
        text: "Let's share our toys so everyone can have fun.",
        translation: "Ayo berbagi mainan kita agar semua bisa bersenang-senang.",
      },
      {
        speaker: "Tariq",
        text: "Good idea. I can share my red bucket.",
        translation: "Ide bagus. Aku bisa berbagi ember merahku.",
      },
    ],
    practicePrompt: "Ajak anak menyebut mainan: Let's share our ball. Let's share our blocks.",
  },
  {
    expression: "May I have a turn?",
    meaning: "Bolehkah aku mendapat giliran?",
    useCase: "Dipakai untuk meminta giliran dengan sopan.",
    dialog: [
      {
        speaker: "Tariq",
        text: "May I have a turn with the colorful ball?",
        translation: "Bolehkah aku mendapat giliran memakai bola warna-warni?",
      },
      {
        speaker: "Nali",
        text: "Sure. You can have a turn after me.",
        translation: "Tentu. Kamu boleh mendapat giliran setelah aku.",
      },
    ],
    practicePrompt: "Latih pola: May I have a turn? Sure, after me.",
  },
  {
    expression: "You can use mine.",
    meaning: "Kamu boleh memakai punyaku.",
    useCase: "Dipakai saat menawarkan barang atau mainan kepada teman.",
    dialog: [
      {
        speaker: "Tariq",
        text: "You can use mine to build a sandcastle.",
        translation: "Kamu boleh memakai punyaku untuk membuat istana pasir.",
      },
      {
        speaker: "Zane",
        text: "Thank you. I will be careful.",
        translation: "Terima kasih. Aku akan hati-hati.",
      },
    ],
    practicePrompt: "Gunakan dengan benda lain: You can use my pencil. You can use my book.",
  },
  {
    expression: "That looks fun!",
    meaning: "Itu terlihat menyenangkan!",
    useCase: "Dipakai saat anak tertarik dengan permainan teman.",
    dialog: [
      {
        speaker: "Zane",
        text: "That looks fun! What are you building?",
        translation: "Itu terlihat menyenangkan! Apa yang sedang kamu bangun?",
      },
      {
        speaker: "Tariq",
        text: "A big sandcastle by the sea.",
        translation: "Istana pasir besar di tepi laut.",
      },
    ],
    practicePrompt: "Latih memberi komentar positif: That looks fun! That looks cool!",
  },
  {
    expression: "Thank you for sharing.",
    meaning: "Terima kasih sudah berbagi.",
    useCase: "Dipakai untuk menghargai teman yang mau berbagi.",
    dialog: [
      {
        speaker: "Nali",
        text: "Thank you for sharing your toy car.",
        translation: "Terima kasih sudah berbagi mobil mainanmu.",
      },
      {
        speaker: "Zane",
        text: "You are welcome. Sharing makes me happy.",
        translation: "Sama-sama. Berbagi membuatku bahagia.",
      },
    ],
    practicePrompt: "Latih respons lengkap: Thank you for sharing. You are welcome.",
  },
  {
    expression: "It's more fun together.",
    meaning: "Lebih seru kalau bersama-sama.",
    useCase: "Dipakai untuk menunjukkan bahwa bermain bersama lebih menyenangkan.",
    dialog: [
      {
        speaker: "Nali",
        text: "The beach feels brighter now.",
        translation: "Pantai terasa lebih cerah sekarang.",
      },
      {
        speaker: "Tariq",
        text: "It's more fun together.",
        translation: "Lebih seru kalau bersama-sama.",
      },
    ],
    practicePrompt: "Ajak anak menyebut aktivitas: Reading is more fun together.",
  },
  {
    expression: "Let's take turns.",
    meaning: "Ayo bergiliran.",
    useCase: "Dipakai untuk mengatur permainan agar semua anak mendapat kesempatan.",
    dialog: [
      {
        speaker: "Zane",
        text: "Let's take turns kicking the ball.",
        translation: "Ayo bergiliran menendang bola.",
      },
      {
        speaker: "Nali",
        text: "Okay. You go first, then Tariq, then me.",
        translation: "Baik. Kamu dulu, lalu Tariq, lalu aku.",
      },
    ],
    practicePrompt: "Role-play giliran: first, next, then me.",
  },
  {
    expression: "Sharing feels like magic.",
    meaning: "Berbagi terasa seperti keajaiban.",
    useCase: "Dipakai untuk menyimpulkan rasa bahagia setelah berbagi.",
    dialog: [
      {
        speaker: "Zane",
        text: "Everyone is smiling now. Sharing feels like magic.",
        translation: "Semua orang tersenyum sekarang. Berbagi terasa seperti keajaiban.",
      },
      {
        speaker: "Nali",
        text: "Yes, it brings laughter to our game.",
        translation: "Ya, berbagi membawa tawa ke permainan kita.",
      },
    ],
    practicePrompt: "Minta anak menyebutkan satu benda yang bisa ia bagikan hari ini.",
  },
  {
    expression: "Everyone is welcome.",
    meaning: "Semua orang diterima.",
    useCase: "Dipakai untuk membuat teman merasa boleh ikut bermain.",
    dialog: [
      {
        speaker: "Little Crab",
        text: "Can I join your game?",
        translation: "Bolehkah aku ikut permainan kalian?",
      },
      {
        speaker: "Friends",
        text: "Of course. Everyone is welcome.",
        translation: "Tentu saja. Semua orang diterima.",
      },
    ],
    practicePrompt: "Gunakan saat bermain kelompok: Everyone is welcome.",
  },
];


export const video6: DigitalStory = {
  id: "video6",
  number: 6,
  title: "The Magical of Sharing",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/The-Magical-of-Sharing.jpg",
  videoPreviewUrl: drivePreview("1WwbOoBTRD4pmWgnG2Wgw5WrJc0OBnMyv"),
  videoViewUrl: driveView("1WwbOoBTRD4pmWgnG2Wgw5WrJc0OBnMyv"),
  pdfPreviewUrl: drivePreview("1ps8WUpRg-_L0uE7WYeSsHCXsPYAY7dct"),
  pdfViewUrl: "https://drive.google.com/file/d/1ps8WUpRg-_L0uE7WYeSsHCXsPYAY7dct/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan tiga sahabat, Nali, Tariq, dan Zane, yang bermain di desa cerah dekat pantai. Masing-masing membawa mainan sendiri: bola warna-warni, ember merah, dan mobil-mobil mainan.",
  "Awalnya mereka bermain sendiri-sendiri dan mulai merasa sedih. Zane kemudian mengusulkan agar mereka saling berbagi mainan supaya permainan menjadi lebih menyenangkan.",
  "Nali dan Tariq setuju, lalu mereka bermain bersama sambil tertawa. Nali membiarkan Tariq menendang bola, Tariq meminjamkan ember untuk membuat istana pasir, dan semua anak menikmati permainan yang lebih ramai.",
  "Mereka menyadari bahwa berbagi terasa seperti keajaiban. Sejak hari itu, mereka selalu membawa mainan untuk dibagikan dan menemukan bahwa berbagi dapat menciptakan teman baru, tawa, dan kebahagiaan."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
