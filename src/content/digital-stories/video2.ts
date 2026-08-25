import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "Where did the tiny river stones live?",
    options: ["In a gentle river", "On a mountain top", "Inside a house", "In the desert"],
    answer: "In a gentle river",
  },
  {
    question: "What happened to the river one day?",
    options: ["It began to shrink", "It turned into snow", "It became a road", "It disappeared forever"],
    answer: "It began to shrink",
  },
  {
    question: "Why were the woodland creatures worried?",
    options: ["They could not find enough water", "They lost their toys", "They were too sleepy", "They wanted to fly"],
    answer: "They could not find enough water",
  },
  {
    question: "Who decided to help the animals?",
    options: ["The wise river stones", "A group of clouds", "A lonely tree", "A little boat"],
    answer: "The wise river stones",
  },
  {
    question: "What did the stones create by rolling and tumbling?",
    options: ["Small dams", "Tall towers", "A big castle", "A deep cave"],
    answer: "Small dams",
  },
  {
    question: "What did the small dams help collect?",
    options: ["The little water left", "Golden leaves", "Shiny stars", "Forest sounds"],
    answer: "The little water left",
  },
  {
    question: "Who used the pools made by the stones?",
    options: ["The thirsty animals", "Only the stones", "Robots", "No one"],
    answer: "The thirsty animals",
  },
  {
    question: "How did the animals feel after the stones helped?",
    options: ["Thankful", "Angry", "Bored", "Jealous"],
    answer: "Thankful",
  },
  {
    question: "What did the birds say to the stones?",
    options: ["Thank you, dear stones", "Go away", "The river is too loud", "We do not need water"],
    answer: "Thank you, dear stones",
  },
  {
    question: "What did the fish say about the stones?",
    options: ["You saved us from thirst", "You are too heavy", "You cannot help", "You should hide"],
    answer: "You saved us from thirst",
  },
  {
    question: "What happened when rain finally came back?",
    options: ["The river flowed strongly again", "The forest became dry forever", "The stones ran away", "The animals left the forest"],
    answer: "The river flowed strongly again",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Working together helps others", "Small things are useless", "Never help friends", "Water is not important"],
    answer: "Working together helps others",
  },
  {
    question: "Which word means sungai?",
    options: ["River", "Stone", "Forest", "Bird"],
    answer: "River",
  },
  {
    question: "Which word means batu?",
    options: ["Stone", "Fish", "Rain", "Sun"],
    answer: "Stone",
  },
  {
    question: "Which word means haus?",
    options: ["Thirsty", "Tiny", "Gentle", "Wise"],
    answer: "Thirsty",
  },
  {
    question: "Which word means bersyukur or berterima kasih?",
    options: ["Thankful", "Worried", "Dry", "Tiny"],
    answer: "Thankful",
  },
  {
    question: "What does teamwork mean in the story?",
    options: ["Working side by side", "Doing everything alone", "Ignoring friends", "Making the river dry"],
    answer: "Working side by side",
  },
  {
    question: "Why were the stones important?",
    options: ["They helped save water", "They made the sun hotter", "They scared the animals", "They stopped the rain"],
    answer: "They helped save water",
  },
  {
    question: "What kind of story is The Helpful River Stones?",
    options: ["A gentle fairy tale with a life lesson", "A scary monster story", "A story about cars", "A math lesson only"],
    answer: "A gentle fairy tale with a life lesson",
  },
  {
    question: "What should children learn from the stones?",
    options: ["Even small helpers can make a big difference", "Only big heroes matter", "Do not care about others", "Keep water only for yourself"],
    answer: "Even small helpers can make a big difference",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["enchanting", "memikat / menawan", "ɪnˈtʃæntɪŋ"],
  ["fairy tale", "dongeng", "ˈferi teɪl"],
  ["magical", "ajaib", "ˈmædʒɪkl"],
  ["fantasy", "fantasi", "ˈfæntəsi"],
  ["valuable", "berharga", "ˈvæljuəbl"],
  ["lesson", "pelajaran", "ˈlesn"],
  ["gentle", "lembut", "ˈdʒentl"],
  ["river", "sungai", "ˈrɪvər"],
  ["flowed", "mengalir", "floʊd"],
  ["forest", "hutan", "ˈfɔːrɪst"],
  ["tiny", "sangat kecil", "ˈtaɪni"],
  ["stone", "batu", "stoʊn"],
  ["sparkled", "berkilau", "ˈspɑːrkld"],
  ["peaceful", "damai", "ˈpiːsfl"],
  ["shrink", "menyusut", "ʃrɪŋk"],
  ["woodland", "hutan kecil", "ˈwʊdlənd"],
  ["creature", "makhluk", "ˈkriːtʃər"],
  ["worried", "khawatir", "ˈwɜːrid"],
  ["fish", "ikan", "fɪʃ"],
  ["bird", "burung", "bɜːrd"],
  ["trouble", "masalah", "ˈtrʌbl"],
  ["wise", "bijaksana", "waɪz"],
  ["gathered", "berkumpul", "ˈɡæðərd"],
  ["tumbled", "berguling-guling", "ˈtʌmbld"],
  ["dam", "bendungan kecil", "dæm"],
  ["thirsty", "haus", "ˈθɜːrsti"],
  ["survive", "bertahan hidup", "sərˈvaɪv"],
  ["thankful", "berterima kasih", "ˈθæŋkfl"],
  ["teamwork", "kerja sama", "ˈtiːmwɜːrk"],
  ["important", "penting", "ɪmˈpɔːrtnt"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "What can we do?",
    meaning: "Apa yang bisa kita lakukan?",
    useCase: "Dipakai saat anak melihat masalah dan ingin mencari solusi bersama.",
    dialog: [
      {
        speaker: "Small Stone",
        text: "The river is getting smaller. What can we do?",
        translation: "Sungainya semakin kecil. Apa yang bisa kita lakukan?",
      },
      {
        speaker: "Wise Stone",
        text: "We can work together and save the water.",
        translation: "Kita bisa bekerja sama dan menyimpan airnya.",
      },
    ],
    practicePrompt: "Latih saat diskusi kelas: What can we do to help our friends?",
  },
  {
    expression: "Let's help them.",
    meaning: "Ayo bantu mereka.",
    useCase: "Dipakai untuk mengajak orang lain membantu dengan tindakan baik.",
    dialog: [
      {
        speaker: "Little Stone",
        text: "The fish and birds look worried.",
        translation: "Ikan dan burung terlihat khawatir.",
      },
      {
        speaker: "River Stone",
        text: "Let's help them before the water is gone.",
        translation: "Ayo bantu mereka sebelum airnya habis.",
      },
    ],
    practicePrompt: "Ganti 'them' dengan orang lain: Let's help Mom. Let's help our teacher.",
  },
  {
    expression: "I am worried about...",
    meaning: "Aku khawatir tentang...",
    useCase: "Dipakai untuk menyampaikan rasa khawatir dengan jelas.",
    dialog: [
      {
        speaker: "Bird",
        text: "I am worried about the dry river.",
        translation: "Aku khawatir tentang sungai yang kering.",
      },
      {
        speaker: "Stone",
        text: "We hear you. We will try to help.",
        translation: "Kami mendengarmu. Kami akan mencoba membantu.",
      },
    ],
    practicePrompt: "Latih pola: I am worried about + noun. Contoh: I am worried about my test.",
  },
  {
    expression: "We need water.",
    meaning: "Kami membutuhkan air.",
    useCase: "Dipakai untuk menyampaikan kebutuhan penting secara sederhana.",
    dialog: [
      {
        speaker: "Fish",
        text: "We need water to swim and live.",
        translation: "Kami membutuhkan air untuk berenang dan hidup.",
      },
      {
        speaker: "Stone",
        text: "We will make small pools for you.",
        translation: "Kami akan membuat kolam-kolam kecil untukmu.",
      },
    ],
    practicePrompt: "Buat kalimat kebutuhan lain: We need food. We need rest. We need help.",
  },
  {
    expression: "Side by side",
    meaning: "Berdampingan / bersama-sama.",
    useCase: "Dipakai untuk menggambarkan kerja sama yang dilakukan bersama.",
    dialog: [
      {
        speaker: "Wise Stone",
        text: "Roll side by side, little stones.",
        translation: "Bergulinglah berdampingan, batu-batu kecil.",
      },
      {
        speaker: "Small Stones",
        text: "Together, we can make a dam.",
        translation: "Bersama-sama, kita bisa membuat bendungan kecil.",
      },
    ],
    practicePrompt: "Role-play gerakan: anak berdiri side by side lalu mengucapkan 'We work side by side.'",
  },
  {
    expression: "That is a good idea.",
    meaning: "Itu ide yang bagus.",
    useCase: "Dipakai untuk menghargai ide teman.",
    dialog: [
      {
        speaker: "Round Stone",
        text: "Maybe we can hold the water here.",
        translation: "Mungkin kita bisa menahan air di sini.",
      },
      {
        speaker: "Flat Stone",
        text: "That is a good idea. Let's try it.",
        translation: "Itu ide yang bagus. Ayo kita coba.",
      },
    ],
    practicePrompt: "Gunakan setelah teman memberi saran: That is a good idea!",
  },
  {
    expression: "Thank you for helping us.",
    meaning: "Terima kasih sudah membantu kami.",
    useCase: "Dipakai saat menerima bantuan dan ingin mengucapkan terima kasih.",
    dialog: [
      {
        speaker: "Bird",
        text: "Thank you for helping us, dear stones.",
        translation: "Terima kasih sudah membantu kami, batu-batu baik.",
      },
      {
        speaker: "Stone",
        text: "You are welcome. We are happy to help.",
        translation: "Sama-sama. Kami senang bisa membantu.",
      },
    ],
    practicePrompt: "Latih respons sopan: Thank you for helping us. You are welcome.",
  },
  {
    expression: "You saved us from...",
    meaning: "Kamu menyelamatkan kami dari...",
    useCase: "Dipakai untuk menjelaskan bantuan besar yang diterima.",
    dialog: [
      {
        speaker: "Fish",
        text: "You saved us from thirst.",
        translation: "Kalian menyelamatkan kami dari kehausan.",
      },
      {
        speaker: "Stone",
        text: "We only did our small part.",
        translation: "Kami hanya melakukan bagian kecil kami.",
      },
    ],
    practicePrompt: "Ganti kata terakhir: You saved us from danger. You saved us from trouble.",
  },
  {
    expression: "Every little thing helps.",
    meaning: "Setiap hal kecil bisa membantu.",
    useCase: "Dipakai untuk mengajarkan bahwa bantuan kecil tetap berarti.",
    dialog: [
      {
        speaker: "Tiny Stone",
        text: "I am small. Can I really help?",
        translation: "Aku kecil. Apakah aku benar-benar bisa membantu?",
      },
      {
        speaker: "Wise Stone",
        text: "Yes. Every little thing helps.",
        translation: "Ya. Setiap hal kecil bisa membantu.",
      },
    ],
    practicePrompt: "Minta anak menyebutkan satu bantuan kecil yang bisa ia lakukan hari ini.",
  },
  {
    expression: "Together, we made a difference.",
    meaning: "Bersama-sama, kita membuat perubahan.",
    useCase: "Dipakai untuk menutup cerita tentang kerja sama dan dampak baik.",
    dialog: [
      {
        speaker: "River Stone",
        text: "The animals have enough water now.",
        translation: "Hewan-hewan punya cukup air sekarang.",
      },
      {
        speaker: "Small Stones",
        text: "Together, we made a difference.",
        translation: "Bersama-sama, kita membuat perubahan.",
      },
    ],
    practicePrompt: "Ajak anak mengulang: Together, we made a difference. Lalu ceritakan contoh kerja sama.",
  },
];


export const video2: DigitalStory = {
  id: "video2",
  number: 2,
  title: "The Helpful River Stones",
  language: "English",
  level: "Beginner",
  thumbnail: "/thumbnail-video/The-Helpful-River-Stones.jpg",
  videoPreviewUrl: drivePreview("1wef67duZExX8ijba8soNRxEMJfhTxNXX"),
  videoViewUrl: driveView("1wef67duZExX8ijba8soNRxEMJfhTxNXX"),
  pdfPreviewUrl: drivePreview("1fLyAoyOO0T7OauKzICBUcnxciOTiXxzb"),
  pdfViewUrl: "https://drive.google.com/file/d/1fLyAoyOO0T7OauKzICBUcnxciOTiXxzb/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan sekelompok batu sungai kecil yang hidup damai di sungai lembut di tengah hutan. Mereka berkilau di bawah matahari dan menikmati rumah sungai yang tenang.",
  "Suatu hari, matahari bersinar terlalu terik dan sungai mulai menyusut. Hewan-hewan hutan menjadi khawatir karena ikan tidak punya cukup air untuk berenang dan burung tidak mudah menemukan air untuk minum.",
  "Melihat hewan-hewan dalam kesulitan, batu-batu sungai yang bijaksana memutuskan untuk membantu. Mereka berguling dan bekerja sama membuat bendungan kecil agar sisa air terkumpul menjadi kolam-kolam kecil untuk para hewan.",
  "Berkat kerja sama batu-batu itu, hewan-hewan dapat bertahan sampai hujan datang kembali. Cerita ini mengajarkan bahwa bantuan kecil pun bisa sangat berarti, terutama ketika dilakukan bersama-sama."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
