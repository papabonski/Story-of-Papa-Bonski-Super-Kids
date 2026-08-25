import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Luna's Ice Adventures", "Zaid's Bright Ideas", "Andy the Ant and the Cozy Nest", "The Helpful Hive"],
    answer: "Luna's Ice Adventures",
  },
  {
    question: "Who is the main character?",
    options: ["Luna", "Zaid", "Andy", "Polly"],
    answer: "Luna",
  },
  {
    question: "Where did Luna live?",
    options: ["In the freezing North Pole", "In a modern city", "In a jungle", "In a tiny anthill"],
    answer: "In the freezing North Pole",
  },
  {
    question: "How old was Luna?",
    options: ["Five years old", "Six years old", "Ten years old", "Three years old"],
    answer: "Five years old",
  },
  {
    question: "What did Luna love doing?",
    options: ["Learning about big ideas", "Building nests", "Running races", "Collecting peacock feathers"],
    answer: "Learning about big ideas",
  },
  {
    question: "What did Luna tell her family?",
    options: ["She wanted to find things that make people happy everywhere", "She wanted to sleep all winter", "She wanted to hide her ideas", "She wanted to stop exploring"],
    answer: "She wanted to find things that make people happy everywhere",
  },
  {
    question: "How did Luna's family respond?",
    options: ["They smiled", "They became angry", "They ignored her", "They told her to stop"],
    answer: "They smiled",
  },
  {
    question: "What did Luna's family say?",
    options: ["That's a wonderful idea, Luna!", "That is impossible, Luna!", "Go back to bed, Luna!", "Do not go outside!"],
    answer: "That's a wonderful idea, Luna!",
  },
  {
    question: "What did Luna put on before her adventure?",
    options: ["Her warm coat and mittens", "Her school uniform", "Her swimming suit", "Her running shoes only"],
    answer: "Her warm coat and mittens",
  },
  {
    question: "What did Luna admire outside?",
    options: ["The icy landscape", "A busy market", "A desert road", "A green jungle"],
    answer: "The icy landscape",
  },
  {
    question: "What was Luna searching for?",
    options: ["Special things that could bring happiness", "A hidden race medal", "A lost kite", "A new classroom"],
    answer: "Special things that could bring happiness",
  },
  {
    question: "What did Luna find with her shovel?",
    options: ["Sparkling ice crystals", "Colorful blocks", "Warm leaves", "River stones"],
    answer: "Sparkling ice crystals",
  },
  {
    question: "What did Luna make with the ice crystals?",
    options: ["Tiny ice sculptures", "A toy car", "A cozy nest", "A paper kite"],
    answer: "Tiny ice sculptures",
  },
  {
    question: "What did Luna imagine?",
    options: ["Bringing smiles to people around the world", "Never sharing her discoveries", "Moving away from her family", "Making everyone cold"],
    answer: "Bringing smiles to people around the world",
  },
  {
    question: "What did Luna share her discoveries with?",
    options: ["Her family", "Only herself", "A group of ants", "A lost dragon"],
    answer: "Her family",
  },
  {
    question: "How did Luna's family feel?",
    options: ["Happy", "Sad", "Angry", "Afraid"],
    answer: "Happy",
  },
  {
    question: "What did Luna believe could bring people joy?",
    options: ["Even small icy treasures", "Only expensive machines", "Keeping ideas secret", "Running very fast"],
    answer: "Even small icy treasures",
  },
  {
    question: "How did Luna continue her adventure?",
    options: ["With a heart full of joy", "With fear and anger", "Without any hope", "By staying indoors forever"],
    answer: "With a heart full of joy",
  },
  {
    question: "What could Luna's discoveries make?",
    options: ["The whole world happy", "Everyone lost", "The snow disappear", "Her family worried"],
    answer: "The whole world happy",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Small discoveries can bring joy to others", "Never dream big", "Snow is always scary", "Children cannot share ideas"],
    answer: "Small discoveries can bring joy to others",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Luna", "Luna / nama anak", "ˈluːnə"],
  ["ice", "es", "aɪs"],
  ["adventures", "petualangan", "ədˈventʃərz"],
  ["freezing", "sangat dingin", "ˈfriːzɪŋ"],
  ["North Pole", "Kutub Utara", "nɔːrθ poʊl"],
  ["curious", "ingin tahu", "ˈkjʊriəs"],
  ["girl", "anak perempuan", "ɡɜːrl"],
  ["learning", "belajar", "ˈlɜːrnɪŋ"],
  ["ideas", "ide-ide", "aɪˈdiːəz"],
  ["family", "keluarga", "ˈfæməli"],
  ["happy", "bahagia", "ˈhæpi"],
  ["everywhere", "di mana-mana", "ˈevriwer"],
  ["wonderful", "luar biasa", "ˈwʌndərfl"],
  ["coat", "mantel", "koʊt"],
  ["mittens", "sarung tangan", "ˈmɪtənz"],
  ["adventure", "petualangan", "ədˈventʃər"],
  ["admired", "mengagumi", "ədˈmaɪərd"],
  ["icy", "berlapis es", "ˈaɪsi"],
  ["landscape", "pemandangan", "ˈlændskeɪp"],
  ["searching", "mencari", "ˈsɜːrtʃɪŋ"],
  ["special", "istimewa", "ˈspeʃl"],
  ["bring", "membawa", "brɪŋ"],
  ["happiness", "kebahagiaan", "ˈhæpinəs"],
  ["shovel", "sekop", "ˈʃʌvl"],
  ["sparkling", "berkilauan", "ˈspɑːrklɪŋ"],
  ["crystals", "kristal-kristal", "ˈkrɪstəlz"],
  ["sculptures", "patung-patung", "ˈskʌlptʃərz"],
  ["smiles", "senyuman", "smaɪlz"],
  ["discoveries", "penemuan-penemuan", "dɪˈskʌvəriz"],
  ["joy", "kegembiraan", "dʒɔɪ"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I want to find things that make people happy.",
    meaning: "Aku ingin menemukan hal-hal yang membuat orang bahagia.",
    useCase: "Dipakai saat anak ingin menyampaikan tujuan baik dari petualangan atau belajar.",
    dialog: [
      {
        speaker: "Luna",
        text: "I want to find things that make people happy.",
        translation: "Aku ingin menemukan hal-hal yang membuat orang bahagia.",
      },
      {
        speaker: "Family",
        text: "That's a wonderful idea, Luna!",
        translation: "Itu ide yang luar biasa, Luna!",
      },
    ],
    practicePrompt: "Latih kalimat tujuan: I want to find things that make people happy.",
  },
  {
    expression: "That's a wonderful idea!",
    meaning: "Itu ide yang luar biasa!",
    useCase: "Dipakai untuk memuji ide baik seseorang.",
    dialog: [
      {
        speaker: "Family",
        text: "That's a wonderful idea!",
        translation: "Itu ide yang luar biasa!",
      },
      {
        speaker: "Luna",
        text: "Thank you. I will explore carefully.",
        translation: "Terima kasih. Aku akan menjelajah dengan hati-hati.",
      },
    ],
    practicePrompt: "Latih apresiasi: That's a wonderful idea!",
  },
  {
    expression: "I am ready for an adventure.",
    meaning: "Aku siap untuk petualangan.",
    useCase: "Dipakai saat bersiap memulai kegiatan atau tantangan baru.",
    dialog: [
      {
        speaker: "Luna",
        text: "I am ready for an adventure.",
        translation: "Aku siap untuk petualangan.",
      },
      {
        speaker: "Narrator",
        text: "She put on her warm coat and mittens.",
        translation: "Ia memakai mantel hangat dan sarung tangannya.",
      },
    ],
    practicePrompt: "Latih kesiapan: I am ready for school. I am ready for an adventure.",
  },
  {
    expression: "I am searching for something special.",
    meaning: "Aku sedang mencari sesuatu yang istimewa.",
    useCase: "Dipakai untuk menjelaskan pencarian atau tujuan eksplorasi.",
    dialog: [
      {
        speaker: "Luna",
        text: "I am searching for something special.",
        translation: "Aku sedang mencari sesuatu yang istimewa.",
      },
      {
        speaker: "Narrator",
        text: "She admired the icy landscape.",
        translation: "Ia mengagumi pemandangan es.",
      },
    ],
    practicePrompt: "Ganti objek: I am searching for my book.",
  },
  {
    expression: "Look at these sparkling crystals!",
    meaning: "Lihat kristal-kristal berkilau ini!",
    useCase: "Dipakai saat menunjukkan sesuatu yang menarik kepada orang lain.",
    dialog: [
      {
        speaker: "Luna",
        text: "Look at these sparkling crystals!",
        translation: "Lihat kristal-kristal berkilau ini!",
      },
      {
        speaker: "Family",
        text: "They are beautiful!",
        translation: "Itu indah!",
      },
    ],
    practicePrompt: "Latih menunjukkan benda: Look at this snowflake!",
  },
  {
    expression: "This can bring smiles.",
    meaning: "Ini bisa membawa senyuman.",
    useCase: "Dipakai untuk menjelaskan manfaat kecil yang membuat orang bahagia.",
    dialog: [
      {
        speaker: "Luna",
        text: "This can bring smiles to people.",
        translation: "Ini bisa membawa senyuman kepada orang-orang.",
      },
      {
        speaker: "Family",
        text: "Your discovery is lovely.",
        translation: "Penemuanmu indah.",
      },
    ],
    practicePrompt: "Latih manfaat: This can bring smiles.",
  },
  {
    expression: "I want to share my discoveries.",
    meaning: "Aku ingin membagikan penemuanku.",
    useCase: "Dipakai saat anak ingin berbagi hasil belajar atau eksplorasi.",
    dialog: [
      {
        speaker: "Luna",
        text: "I want to share my discoveries.",
        translation: "Aku ingin membagikan penemuanku.",
      },
      {
        speaker: "Family",
        text: "Please show us, Luna.",
        translation: "Tolong tunjukkan kepada kami, Luna.",
      },
    ],
    practicePrompt: "Latih berbagi: I want to share my story.",
  },
  {
    expression: "I'm so proud of you.",
    meaning: "Aku sangat bangga padamu.",
    useCase: "Dipakai orang tua atau keluarga untuk memberi dukungan.",
    dialog: [
      {
        speaker: "Father",
        text: "I'm so proud of you, Luna.",
        translation: "Aku sangat bangga padamu, Luna.",
      },
      {
        speaker: "Luna",
        text: "Thank you. I feel happy.",
        translation: "Terima kasih. Aku merasa bahagia.",
      },
    ],
    practicePrompt: "Latih kalimat dukungan: I'm so proud of you.",
  },
  {
    expression: "Even small treasures can bring joy.",
    meaning: "Bahkan harta kecil bisa membawa kegembiraan.",
    useCase: "Dipakai untuk menyampaikan pesan bahwa hal sederhana juga berarti.",
    dialog: [
      {
        speaker: "Luna",
        text: "Even small treasures can bring joy.",
        translation: "Bahkan harta kecil bisa membawa kegembiraan.",
      },
      {
        speaker: "Narrator",
        text: "She believed her icy treasures could make people smile.",
        translation: "Ia percaya harta es kecilnya bisa membuat orang tersenyum.",
      },
    ],
    practicePrompt: "Ajak anak memberi contoh small treasures di rumah.",
  },
  {
    expression: "I will continue my adventure.",
    meaning: "Aku akan melanjutkan petualanganku.",
    useCase: "Dipakai saat ingin terus mencoba dan belajar.",
    dialog: [
      {
        speaker: "Luna",
        text: "I will continue my adventure.",
        translation: "Aku akan melanjutkan petualanganku.",
      },
      {
        speaker: "Family",
        text: "Go carefully, little explorer.",
        translation: "Pergilah dengan hati-hati, penjelajah kecil.",
      },
    ],
    practicePrompt: "Latih kalimat semangat: I will continue.",
  },
];

export const video19: DigitalStory = {
  id: "video19",
  number: 19,
  title: "Luna's Ice Adventures",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Luna's-Ice-Adventures.jpg",
  videoPreviewUrl: drivePreview("1iQ4qCpt4Nke9BjTUI481JGT3icmv069z"),
  videoViewUrl: driveView("1iQ4qCpt4Nke9BjTUI481JGT3icmv069z"),
  pdfPreviewUrl: drivePreview("1minejJKo2tcqPXZ3e5V8c7YQUEFA86WN"),
  pdfViewUrl: "https://drive.google.com/file/d/1minejJKo2tcqPXZ3e5V8c7YQUEFA86WN/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Luna, anak perempuan penuh rasa ingin tahu berusia lima tahun yang tinggal di Kutub Utara yang sangat dingin. Luna suka belajar tentang ide-ide besar dan bermimpi besar.",
    "Suatu hari, Luna berkata kepada keluarganya bahwa ia ingin menemukan hal-hal yang dapat membuat orang-orang di mana pun merasa bahagia. Keluarganya tersenyum dan menyebut ide itu sangat indah.",
    "Luna memakai mantel hangat dan sarung tangan, lalu pergi menjelajah. Ia mengagumi pemandangan es dan mencari sesuatu istimewa yang dapat membawa kebahagiaan bagi semua orang.",
    "Dengan sekop kecilnya, Luna menemukan kristal es berkilau dan membuat patung-patung es kecil. Ia membayangkan penemuannya dapat membawa senyuman kepada orang-orang di seluruh dunia.",
    "Saat Luna membagikan penemuannya kepada keluarga, mereka merasa senang dan bangga. Luna percaya bahwa bahkan harta kecil dari es dapat membawa kegembiraan, lalu ia melanjutkan petualangannya dengan hati penuh sukacita.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
