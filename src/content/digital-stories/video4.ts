import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "Who is the main character in the story?",
    options: ["Kiko the Koala", "Tim the Captain", "Milo the Mouse", "Luna the Bird"],
    answer: "Kiko the Koala",
  },
  {
    question: "Where did Kiko live?",
    options: ["In a leafy forest", "In a snowy mountain", "On a city bus", "Beside the ocean"],
    answer: "In a leafy forest",
  },
  {
    question: "What did Kiko love doing?",
    options: ["Climbing trees and munching eucalyptus leaves", "Building cars", "Swimming in the sea", "Painting walls"],
    answer: "Climbing trees and munching eucalyptus leaves",
  },
  {
    question: "What was more important to Kiko than anything?",
    options: ["Spreading kindness", "Finding treasure", "Winning races", "Sleeping alone"],
    answer: "Spreading kindness",
  },
  {
    question: "What was Kiko doing one sunny day?",
    options: ["Lounging in a eucalyptus tree", "Flying a kite", "Digging a cave", "Cooking soup"],
    answer: "Lounging in a eucalyptus tree",
  },
  {
    question: "What did Kiko hear from the branches?",
    options: ["A chirping sound", "A loud drum", "A car horn", "A waterfall"],
    answer: "A chirping sound",
  },
  {
    question: "Who was in distress?",
    options: ["A lost baby bird", "A sleepy fish", "A giant snake", "A red ant queen"],
    answer: "A lost baby bird",
  },
  {
    question: "Why was the baby bird scared?",
    options: ["It had fallen from its nest", "It lost its shoes", "It saw the ocean", "It forgot a song"],
    answer: "It had fallen from its nest",
  },
  {
    question: "How did Kiko help the baby bird?",
    options: ["He placed it back in its nest", "He gave it a toy boat", "He hid it under leaves", "He sent it away"],
    answer: "He placed it back in its nest",
  },
  {
    question: "Who did Kiko meet next in the forest?",
    options: ["Ants carrying food", "A dragon sleeping", "Children with bikes", "A lonely tree"],
    answer: "Ants carrying food",
  },
  {
    question: "What problem did the ants have?",
    options: ["Their food was too heavy to carry", "They were lost at sea", "They could not sing", "Their nest was too cold"],
    answer: "Their food was too heavy to carry",
  },
  {
    question: "How did Kiko help the ants?",
    options: ["He carried the food with his strong little arms", "He ate all the food", "He ignored them", "He scared them away"],
    answer: "He carried the food with his strong little arms",
  },
  {
    question: "Who was frightened by the thunderstorm?",
    options: ["A timid bunny", "A brave lion", "A little fish", "A blue butterfly"],
    answer: "A timid bunny",
  },
  {
    question: "What did Kiko give the bunny?",
    options: ["A warm hug and reassuring words", "A heavy rock", "A noisy bell", "A cold drink"],
    answer: "A warm hug and reassuring words",
  },
  {
    question: "Where did Kiko shelter the bunny?",
    options: ["In his tree", "In a boat", "Under a table", "Inside a school"],
    answer: "In his tree",
  },
  {
    question: "What spread throughout the forest?",
    options: ["Word of Kiko's kindness", "A scary rumor", "A cloud of dust", "A treasure map"],
    answer: "Word of Kiko's kindness",
  },
  {
    question: "How did animals feel after hearing about Kiko?",
    options: ["They felt hopeful and comforting presence", "They felt angry", "They forgot kindness", "They stopped helping"],
    answer: "They felt hopeful and comforting presence",
  },
  {
    question: "Which word means kebaikan?",
    options: ["Kindness", "Thunderstorm", "Branch", "Food"],
    answer: "Kindness",
  },
  {
    question: "Which word means sarang?",
    options: ["Nest", "Quest", "Leaf", "Koala"],
    answer: "Nest",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Even small acts of kindness can create happiness", "Never help anyone", "Only big animals matter", "Kindness should be hidden"],
    answer: "Even small acts of kindness can create happiness",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["kindness", "kebaikan", "ˈkaɪndnəs"],
  ["quest", "misi / pencarian", "kwest"],
  ["koala", "koala", "koʊˈɑːlə"],
  ["leafy", "rimbun / berdaun", "ˈliːfi"],
  ["forest", "hutan", "ˈfɔːrɪst"],
  ["climbing", "memanjat", "ˈklaɪmɪŋ"],
  ["eucalyptus", "eukaliptus", "ˌjuːkəˈlɪptəs"],
  ["munching", "mengunyah", "ˈmʌntʃɪŋ"],
  ["offered", "menawarkan / memberi", "ˈɔːfərd"],
  ["spreading", "menyebarkan", "ˈspredɪŋ"],
  ["wherever", "di mana pun", "werˈevər"],
  ["lounging", "bersantai", "ˈlaʊndʒɪŋ"],
  ["scorching", "terik / sangat panas", "ˈskɔːrtʃɪŋ"],
  ["branches", "cabang-cabang", "ˈbræntʃɪz"],
  ["chirping", "kicauan", "ˈtʃɜːrpɪŋ"],
  ["distress", "kesusahan", "dɪˈstres"],
  ["baby bird", "anak burung", "ˈbeɪbi bɜːrd"],
  ["fallen", "jatuh", "ˈfɔːlən"],
  ["nest", "sarang", "nest"],
  ["scout", "mencari / mengintai", "skaʊt"],
  ["gently", "dengan lembut", "ˈdʒentli"],
  ["soothing", "menenangkan", "ˈsuːðɪŋ"],
  ["guidance", "bimbingan", "ˈɡaɪdns"],
  ["hurried", "bergegas", "ˈhɜːrid"],
  ["ants", "semut-semut", "ænts"],
  ["struggling", "berjuang / kesulitan", "ˈstrʌɡlɪŋ"],
  ["thunderstorm", "badai petir", "ˈθʌndərstɔːrm"],
  ["timid", "pemalu / penakut", "ˈtɪmɪd"],
  ["reassuring", "meyakinkan / menenangkan", "ˌriːəˈʃʊrɪŋ"],
  ["friendship", "persahabatan", "ˈfrendʃɪp"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Are you okay?",
    meaning: "Apakah kamu baik-baik saja?",
    useCase: "Dipakai saat melihat teman tampak sedih, takut, atau membutuhkan bantuan.",
    dialog: [
      {
        speaker: "Kiko",
        text: "Are you okay, little bird?",
        translation: "Apakah kamu baik-baik saja, burung kecil?",
      },
      {
        speaker: "Baby Bird",
        text: "I fell from my nest and I feel scared.",
        translation: "Aku jatuh dari sarangku dan aku merasa takut.",
      },
    ],
    practicePrompt: "Latih dengan ekspresi peduli: Are you okay? Do you need help?",
  },
  {
    expression: "Do not worry.",
    meaning: "Jangan khawatir.",
    useCase: "Dipakai untuk menenangkan seseorang yang sedang takut atau panik.",
    dialog: [
      {
        speaker: "Kiko",
        text: "Do not worry. I will help you gently.",
        translation: "Jangan khawatir. Aku akan membantumu dengan lembut.",
      },
      {
        speaker: "Baby Bird",
        text: "Thank you, Kiko. I feel safer now.",
        translation: "Terima kasih, Kiko. Aku merasa lebih aman sekarang.",
      },
    ],
    practicePrompt: "Role-play: satu anak pura-pura takut, anak lain berkata 'Do not worry.'",
  },
  {
    expression: "Let me help you.",
    meaning: "Izinkan aku membantumu.",
    useCase: "Dipakai untuk menawarkan bantuan dengan sopan.",
    dialog: [
      {
        speaker: "Kiko",
        text: "Let me help you get back to your nest.",
        translation: "Izinkan aku membantumu kembali ke sarangmu.",
      },
      {
        speaker: "Baby Bird",
        text: "Please be careful with my tiny wings.",
        translation: "Tolong hati-hati dengan sayap kecilku.",
      },
    ],
    practicePrompt: "Latih pola: Let me help you carry this. Let me help you clean up.",
  },
  {
    expression: "That must be hard.",
    meaning: "Itu pasti sulit.",
    useCase: "Dipakai untuk menunjukkan empati saat teman mengalami kesulitan.",
    dialog: [
      {
        speaker: "Ant",
        text: "This food is too heavy for us.",
        translation: "Makanan ini terlalu berat untuk kami.",
      },
      {
        speaker: "Kiko",
        text: "That must be hard. I can carry some with you.",
        translation: "Itu pasti sulit. Aku bisa membawa sebagian bersamamu.",
      },
    ],
    practicePrompt: "Gunakan saat mendengar masalah teman: That must be hard.",
  },
  {
    expression: "We can do it together.",
    meaning: "Kita bisa melakukannya bersama.",
    useCase: "Dipakai untuk membangun semangat kerja sama.",
    dialog: [
      {
        speaker: "Kiko",
        text: "We can do it together, little ants.",
        translation: "Kita bisa melakukannya bersama, semut-semut kecil.",
      },
      {
        speaker: "Ants",
        text: "Thank you! The task feels lighter now.",
        translation: "Terima kasih! Tugasnya terasa lebih ringan sekarang.",
      },
    ],
    practicePrompt: "Ajak anak mengucapkan: We can do it together! saat membereskan mainan.",
  },
  {
    expression: "You are safe with me.",
    meaning: "Kamu aman bersamaku.",
    useCase: "Dipakai untuk menenangkan teman yang takut.",
    dialog: [
      {
        speaker: "Rabbit",
        text: "The thunder is loud. I am frightened.",
        translation: "Petirnya keras. Aku ketakutan.",
      },
      {
        speaker: "Kiko",
        text: "You are safe with me. Take a deep breath.",
        translation: "Kamu aman bersamaku. Tarik napas dalam-dalam.",
      },
    ],
    practicePrompt: "Latih intonasi lembut: You are safe with me. Take a deep breath.",
  },
  {
    expression: "Would you like a hug?",
    meaning: "Apakah kamu mau dipeluk?",
    useCase: "Dipakai untuk menawarkan pelukan dengan tetap meminta izin.",
    dialog: [
      {
        speaker: "Kiko",
        text: "Would you like a hug, little rabbit?",
        translation: "Apakah kamu mau dipeluk, kelinci kecil?",
      },
      {
        speaker: "Rabbit",
        text: "Yes, please. A warm hug would help.",
        translation: "Ya, tolong. Pelukan hangat akan membantu.",
      },
    ],
    practicePrompt: "Ajarkan consent: Would you like a hug? Anak boleh menjawab yes atau no.",
  },
  {
    expression: "You are not alone.",
    meaning: "Kamu tidak sendirian.",
    useCase: "Dipakai untuk memberi dukungan emosional.",
    dialog: [
      {
        speaker: "Rabbit",
        text: "I feel alone when the storm comes.",
        translation: "Aku merasa sendirian saat badai datang.",
      },
      {
        speaker: "Kiko",
        text: "You are not alone. I will stay with you.",
        translation: "Kamu tidak sendirian. Aku akan menemanimu.",
      },
    ],
    practicePrompt: "Minta anak mengulang kalimat dukungan: You are not alone.",
  },
  {
    expression: "Kindness can spread.",
    meaning: "Kebaikan bisa menyebar.",
    useCase: "Dipakai untuk menjelaskan bahwa tindakan baik dapat menginspirasi orang lain.",
    dialog: [
      {
        speaker: "Blue Bird",
        text: "Everyone is talking about your kindness, Kiko.",
        translation: "Semua orang membicarakan kebaikanmu, Kiko.",
      },
      {
        speaker: "Kiko",
        text: "Kindness can spread from one heart to another.",
        translation: "Kebaikan bisa menyebar dari satu hati ke hati lain.",
      },
    ],
    practicePrompt: "Diskusikan satu kebaikan kecil yang bisa menyebar di kelas atau rumah.",
  },
  {
    expression: "A little kindness goes a long way.",
    meaning: "Sedikit kebaikan bisa berdampak besar.",
    useCase: "Dipakai sebagai pesan moral setelah melakukan tindakan baik.",
    dialog: [
      {
        speaker: "Kiko",
        text: "A little kindness goes a long way.",
        translation: "Sedikit kebaikan bisa berdampak besar.",
      },
      {
        speaker: "Forest Friends",
        text: "Your kindness made the forest happier.",
        translation: "Kebaikanmu membuat hutan lebih bahagia.",
      },
    ],
    practicePrompt: "Ajak anak membuat contoh: A little kindness is saying thank you.",
  },
];


export const video4: DigitalStory = {
  id: "video4",
  number: 4,
  title: "The Kindness Quest of Kiko the Koala",
  language: "English",
  level: "Beginner",
  thumbnail: "/thumbnail-video/Kindness-Quest-of-Kiko-the-Koala.jpg",
  videoPreviewUrl: drivePreview("1OLR_UKTxoS-TvU2Y33xPrVlByF1bDEfV"),
  videoViewUrl: driveView("1OLR_UKTxoS-TvU2Y33xPrVlByF1bDEfV"),
  pdfPreviewUrl: drivePreview("11dDfpaOPBcEEKxGd5W07KZGwTf6OCt8A"),
  pdfViewUrl: "https://drive.google.com/file/d/11dDfpaOPBcEEKxGd5W07KZGwTf6OCt8A/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan Kiko, seekor koala kecil yang tinggal di hutan rimbun, suka memanjat pohon, dan menikmati daun eukaliptus. Namun, hal yang paling ia sukai adalah menyebarkan kebaikan ke mana pun ia pergi.",
  "Suatu hari yang terik, Kiko mendengar kicauan panik dari dahan. Ia menemukan anak burung yang jatuh dari sarangnya, lalu dengan lembut mengembalikannya ke sarang sambil memberi kata-kata yang menenangkan.",
  "Dalam perjalanannya, Kiko juga membantu para semut yang kesulitan membawa makanan dan menenangkan kelinci kecil yang takut pada badai petir. Ia berbagi tenaga, pelukan hangat, dan cerita-cerita lucu agar teman-temannya merasa aman.",
  "Kabar tentang kebaikan Kiko menyebar ke seluruh hutan. Cerita ini mengajarkan bahwa tindakan kecil penuh kasih dapat membawa kebahagiaan besar, memperkuat persahabatan, dan membuat lingkungan terasa lebih hangat."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
