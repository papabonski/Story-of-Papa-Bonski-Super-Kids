import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "Who were the three friends in the story?",
    options: ["Jack, Sam, and Lin", "Kiko, Tim, and Luna", "Milo, Nina, and Ben", "Tom, Sara, and Leo"],
    answer: "Jack, Sam, and Lin",
  },
  {
    question: "Where did the friends explore one day?",
    options: ["The rainforest", "A snowy hill", "A city museum", "A sandy beach"],
    answer: "The rainforest",
  },
  {
    question: "What happened while they were exploring?",
    options: ["They wandered too far and got lost", "They found a train", "They went home early", "They built a house"],
    answer: "They wandered too far and got lost",
  },
  {
    question: "Who found an old compass?",
    options: ["Jack", "Sam", "Lin", "Their teacher"],
    answer: "Jack",
  },
  {
    question: "What did the compass look like?",
    options: ["Rusty and old", "Bright blue", "Made of glass", "Very tiny"],
    answer: "Rusty and old",
  },
  {
    question: "What did Sam ask about the compass?",
    options: ["How do we use it?", "Can we eat it?", "Is it a phone?", "Can it fly?"],
    answer: "How do we use it?",
  },
  {
    question: "What direction did Lin remember they should follow?",
    options: ["North", "South", "East", "West"],
    answer: "North",
  },
  {
    question: "What did Jack do with the compass?",
    options: ["Held it steadily and watched the needle", "Threw it away", "Put it in the river", "Used it as a toy wheel"],
    answer: "Held it steadily and watched the needle",
  },
  {
    question: "What did the friends do after finding north?",
    options: ["They followed the needle's direction", "They ran in circles", "They climbed a roof", "They slept until night"],
    answer: "They followed the needle's direction",
  },
  {
    question: "What did they reach after following the compass?",
    options: ["A river", "A castle", "A train station", "A desert"],
    answer: "A river",
  },
  {
    question: "How did the compass help at the river?",
    options: ["It showed where to cross safely", "It became a bridge", "It called a boat", "It stopped the water"],
    answer: "It showed where to cross safely",
  },
  {
    question: "What did the friends build from fallen branches?",
    options: ["A sturdy log bridge", "A tall tower", "A wooden chair", "A small shop"],
    answer: "A sturdy log bridge",
  },
  {
    question: "What did they see after crossing the river?",
    options: ["A familiar treehouse", "A giant mountain", "A golden door", "A dark cave"],
    answer: "A familiar treehouse",
  },
  {
    question: "When did they reach home?",
    options: ["Just before sunset", "At midnight", "Early morning", "After a week"],
    answer: "Just before sunset",
  },
  {
    question: "Who said, 'Using the compass helped us find our way back'?",
    options: ["Jack", "Sam", "Lin", "Dad"],
    answer: "Jack",
  },
  {
    question: "What did Sam say they learned?",
    options: ["Teamwork made it easier", "Running is always best", "Maps are useless", "Rainforests are empty"],
    answer: "Teamwork made it easier",
  },
  {
    question: "What did Lin say was important?",
    options: ["Knowing how to use a compass", "Forgetting directions", "Never asking for help", "Walking alone"],
    answer: "Knowing how to use a compass",
  },
  {
    question: "Which word means kompas?",
    options: ["Compass", "Needle", "River", "Branch"],
    answer: "Compass",
  },
  {
    question: "Which word means tersesat?",
    options: ["Lost", "Safe", "Helpful", "Familiar"],
    answer: "Lost",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Navigation, teamwork, and practical knowledge can help us", "Friends should never explore", "Compasses only work at home", "Getting lost is always fun"],
    answer: "Navigation, teamwork, and practical knowledge can help us",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["helpful", "membantu / berguna", "ˈhelpfl"],
  ["compass", "kompas", "ˈkʌmpəs"],
  ["rainforest", "hutan hujan", "ˈreɪnfɔːrɪst"],
  ["friends", "teman-teman", "frendz"],
  ["exploring", "menjelajah", "ɪkˈsplɔːrɪŋ"],
  ["wandering", "berkelana / berjalan tanpa arah", "ˈwɑːndərɪŋ"],
  ["lost", "tersesat", "lɔːst"],
  ["rusty", "berkarat", "ˈrʌsti"],
  ["direction", "arah", "dəˈrekʃn"],
  ["remembered", "mengingat", "rɪˈmembərd"],
  ["north", "utara", "nɔːrθ"],
  ["needle", "jarum kompas", "ˈniːdl"],
  ["steadily", "dengan mantap", "ˈstedəli"],
  ["watched", "memperhatikan", "wɑːtʃt"],
  ["followed", "mengikuti", "ˈfɑːloʊd"],
  ["path", "jalan", "pæθ"],
  ["river", "sungai", "ˈrɪvər"],
  ["safe", "aman", "seɪf"],
  ["crossing", "penyeberangan", "ˈkrɔːsɪŋ"],
  ["sturdy", "kokoh", "ˈstɜːrdi"],
  ["log bridge", "jembatan kayu", "lɔːɡ brɪdʒ"],
  ["familiar", "akrab / dikenal", "fəˈmɪliər"],
  ["treehouse", "rumah pohon", "ˈtriːhaʊs"],
  ["sunset", "matahari terbenam", "ˈsʌnset"],
  ["teamwork", "kerja sama", "ˈtiːmwɜːrk"],
  ["easier", "lebih mudah", "ˈiːziər"],
  ["important", "penting", "ɪmˈpɔːrtnt"],
  ["navigation", "navigasi", "ˌnævɪˈɡeɪʃn"],
  ["practical", "praktis", "ˈpræktɪkl"],
  ["knowledge", "pengetahuan", "ˈnɑːlɪdʒ"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I think we are lost.",
    meaning: "Sepertinya kita tersesat.",
    useCase: "Dipakai saat menyadari bahwa arah atau jalan sudah tidak dikenal.",
    dialog: [
      {
        speaker: "Sam",
        text: "I think we are lost in the rainforest.",
        translation: "Sepertinya kita tersesat di hutan hujan.",
      },
      {
        speaker: "Jack",
        text: "Let's stay calm and look around.",
        translation: "Ayo tetap tenang dan lihat sekitar.",
      },
    ],
    practicePrompt: "Latih kalimat aman: I think we are lost. Let's ask for help.",
  },
  {
    expression: "Let's stay calm.",
    meaning: "Ayo tetap tenang.",
    useCase: "Dipakai untuk menenangkan diri dan teman saat menghadapi masalah.",
    dialog: [
      {
        speaker: "Lin",
        text: "Let's stay calm. Panicking will not help.",
        translation: "Ayo tetap tenang. Panik tidak akan membantu.",
      },
      {
        speaker: "Sam",
        text: "Okay. We can think clearly together.",
        translation: "Baik. Kita bisa berpikir jernih bersama.",
      },
    ],
    practicePrompt: "Ajak anak tarik napas lalu ucapkan: Let's stay calm.",
  },
  {
    expression: "How do we use it?",
    meaning: "Bagaimana cara kita menggunakannya?",
    useCase: "Dipakai saat anak ingin bertanya cara memakai benda atau alat.",
    dialog: [
      {
        speaker: "Sam",
        text: "This compass looks old. How do we use it?",
        translation: "Kompas ini terlihat tua. Bagaimana cara kita menggunakannya?",
      },
      {
        speaker: "Lin",
        text: "The needle points north. Watch it carefully.",
        translation: "Jarumnya menunjuk utara. Perhatikan baik-baik.",
      },
    ],
    practicePrompt: "Latih dengan benda lain: How do we use this map? How do we use this tool?",
  },
  {
    expression: "It points north.",
    meaning: "Itu menunjuk ke utara.",
    useCase: "Dipakai saat menjelaskan arah kompas.",
    dialog: [
      {
        speaker: "Lin",
        text: "Look at the needle. It points north.",
        translation: "Lihat jarumnya. Itu menunjuk ke utara.",
      },
      {
        speaker: "Jack",
        text: "Then north will help us choose a path.",
        translation: "Kalau begitu utara akan membantu kita memilih jalan.",
      },
    ],
    practicePrompt: "Ajak anak menunjuk arah: It points north. It points east.",
  },
  {
    expression: "Follow the needle.",
    meaning: "Ikuti jarumnya.",
    useCase: "Dipakai untuk memberi instruksi sederhana saat menggunakan kompas.",
    dialog: [
      {
        speaker: "Jack",
        text: "Follow the needle and walk slowly.",
        translation: "Ikuti jarumnya dan berjalanlah pelan-pelan.",
      },
      {
        speaker: "Sam",
        text: "I will watch the path ahead.",
        translation: "Aku akan memperhatikan jalan di depan.",
      },
    ],
    practicePrompt: "Latih instruksi pendek: Follow the line. Follow the path. Follow the leader.",
  },
  {
    expression: "Which way should we go?",
    meaning: "Ke arah mana kita harus pergi?",
    useCase: "Dipakai saat bertanya pilihan arah.",
    dialog: [
      {
        speaker: "Sam",
        text: "Which way should we go, left or right?",
        translation: "Ke arah mana kita harus pergi, kiri atau kanan?",
      },
      {
        speaker: "Lin",
        text: "The compass says we should go north.",
        translation: "Kompas menunjukkan kita harus pergi ke utara.",
      },
    ],
    practicePrompt: "Role-play memberi arah: Which way should we go? Go left. Go right.",
  },
  {
    expression: "Is it safe to cross?",
    meaning: "Apakah aman untuk menyeberang?",
    useCase: "Dipakai saat mengecek keamanan sebelum melewati jalan, sungai, atau jembatan.",
    dialog: [
      {
        speaker: "Jack",
        text: "The river is wide. Is it safe to cross?",
        translation: "Sungainya lebar. Apakah aman untuk menyeberang?",
      },
      {
        speaker: "Lin",
        text: "Not here. Let's find a safer crossing.",
        translation: "Tidak di sini. Ayo cari penyeberangan yang lebih aman.",
      },
    ],
    practicePrompt: "Gunakan saat belajar keselamatan: Is it safe to cross the street?",
  },
  {
    expression: "We can build a bridge.",
    meaning: "Kita bisa membuat jembatan.",
    useCase: "Dipakai saat menawarkan solusi praktis bersama.",
    dialog: [
      {
        speaker: "Sam",
        text: "There are sturdy logs here. We can build a bridge.",
        translation: "Ada batang kayu kokoh di sini. Kita bisa membuat jembatan.",
      },
      {
        speaker: "Jack",
        text: "Great idea. Let's work together.",
        translation: "Ide bagus. Ayo bekerja sama.",
      },
    ],
    practicePrompt: "Latih pola solusi: We can build... We can make... We can fix...",
  },
  {
    expression: "I see something familiar.",
    meaning: "Aku melihat sesuatu yang aku kenal.",
    useCase: "Dipakai saat menemukan tanda atau tempat yang membantu mengenali jalan.",
    dialog: [
      {
        speaker: "Lin",
        text: "I see something familiar. It is the old treehouse!",
        translation: "Aku melihat sesuatu yang aku kenal. Itu rumah pohon lama!",
      },
      {
        speaker: "Sam",
        text: "That means we are close to home.",
        translation: "Itu berarti kita sudah dekat dengan rumah.",
      },
    ],
    practicePrompt: "Ajak anak menyebut benda sekitar: I see something familiar.",
  },
  {
    expression: "Teamwork helped us.",
    meaning: "Kerja sama membantu kita.",
    useCase: "Dipakai untuk menyimpulkan hasil kerja sama setelah masalah selesai.",
    dialog: [
      {
        speaker: "Jack",
        text: "We found our way back before sunset.",
        translation: "Kita menemukan jalan pulang sebelum matahari terbenam.",
      },
      {
        speaker: "Lin",
        text: "Teamwork helped us, and the compass did too.",
        translation: "Kerja sama membantu kita, dan kompas juga.",
      },
    ],
    practicePrompt: "Diskusikan: When did teamwork help you today?",
  },
];


export const video5: DigitalStory = {
  id: "video5",
  number: 5,
  title: "The Helpful Compass",
  language: "English",
  level: "Beginner",
  thumbnail: "/thumbnail-video/The-Helpful-Compass.jpg",
  videoPreviewUrl: drivePreview("1tcvtZDL6DEROEY3LtdfxlSlvrWWP7Qym"),
  videoViewUrl: driveView("1tcvtZDL6DEROEY3LtdfxlSlvrWWP7Qym"),
  pdfPreviewUrl: drivePreview("1lgVKDf45ZOuIXwRDAD4ue9coGcUwo721"),
  pdfViewUrl: "https://drive.google.com/file/d/1lgVKDf45ZOuIXwRDAD4ue9coGcUwo721/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan tiga sahabat, Jack, Sam, dan Lin, yang menjelajahi hutan hujan. Karena terlalu asyik berjalan, mereka pergi terlalu jauh dan akhirnya tersesat.",
  "Jack menemukan kompas tua yang berkarat. Awalnya mereka bingung cara memakainya, tetapi Lin mengingat bahwa jarum kompas menunjukkan arah utara, lalu mereka mengikuti arah itu dengan hati-hati.",
  "Dengan bantuan kompas, mereka menemukan jalan menuju sungai, memilih tempat menyeberang yang aman, dan bekerja sama membuat jembatan kayu kecil dari ranting serta batang pohon yang jatuh.",
  "Akhirnya mereka melihat rumah pohon yang dikenal dan kembali sebelum matahari terbenam. Cerita ini mengajarkan pentingnya navigasi, kerja sama, pengetahuan praktis, dan keberanian untuk tetap tenang saat tersesat."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
