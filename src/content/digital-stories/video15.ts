import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Polly the Peacock's Big Heart", "Draco's Kind Wings", "Iggy's Helpful Heart", "The Helpful Hive"],
    answer: "Polly the Peacock's Big Heart",
  },
  {
    question: "Who is the main character?",
    options: ["Polly", "Draco", "Buzz", "Maya"],
    answer: "Polly",
  },
  {
    question: "What kind of bird is Polly?",
    options: ["A peacock", "A sparrow", "An owl", "A duck"],
    answer: "A peacock",
  },
  {
    question: "Where did Polly live?",
    options: ["In a colorful garden", "In a snowy cave", "In a classroom", "On a racing track"],
    answer: "In a colorful garden",
  },
  {
    question: "What did Polly have?",
    options: ["Beautiful feathers", "A magic compass", "A red cape", "A broken shell"],
    answer: "Beautiful feathers",
  },
  {
    question: "What did Polly see one day?",
    options: ["A butterfly with a torn wing", "A lost dragon", "A sleepy turtle", "A boy with a medal"],
    answer: "A butterfly with a torn wing",
  },
  {
    question: "What did Polly ask the butterfly?",
    options: ["Can I help?", "Can I race?", "Can I hide?", "Can I sleep?"],
    answer: "Can I help?",
  },
  {
    question: "What was wrong with the butterfly?",
    options: ["Its wing hurt and it could not fly", "It lost a toy car", "It wanted to swim", "It could not read"],
    answer: "Its wing hurt and it could not fly",
  },
  {
    question: "Where did Polly carry the butterfly?",
    options: ["To a soft bed of leaves", "To a deep river", "To a school bus", "To a mountain cave"],
    answer: "To a soft bed of leaves",
  },
  {
    question: "What did Polly offer as shelter?",
    options: ["Her feathers", "Her shoes", "Her kite", "Her puzzle"],
    answer: "Her feathers",
  },
  {
    question: "How did the butterfly thank Polly?",
    options: ["It whispered, 'Thank you, Polly!'", "It shouted angrily", "It ran away", "It ignored her"],
    answer: "It whispered, 'Thank you, Polly!'",
  },
  {
    question: "How did Polly feel after helping?",
    options: ["Happy inside", "Angry inside", "Afraid inside", "Sleepy inside"],
    answer: "Happy inside",
  },
  {
    question: "Who did Polly see next?",
    options: ["A squirrel with tangled fur", "A bee in a hive", "A koala on a beach", "A dragon in the sky"],
    answer: "A squirrel with tangled fur",
  },
  {
    question: "Did Polly ignore the squirrel?",
    options: ["No, she kindly helped", "Yes, she walked away", "Yes, she laughed", "No, she asked the squirrel to fly"],
    answer: "No, she kindly helped",
  },
  {
    question: "What did Polly make cozy?",
    options: ["The squirrel's nest", "A classroom", "A river stone", "A spaceship"],
    answer: "The squirrel's nest",
  },
  {
    question: "Who did Polly later find?",
    options: ["A baby owl", "A running boy", "A lost gnome", "A turtle grandpa"],
    answer: "A baby owl",
  },
  {
    question: "How did Polly help the baby owl?",
    options: ["She used her bright feathers to guide it", "She taught it to run", "She gave it a compass", "She hid it under a rock"],
    answer: "She used her bright feathers to guide it",
  },
  {
    question: "What did Polly learn about beauty?",
    options: ["True beauty comes from a generous heart", "Beauty is only colorful feathers", "Beauty means being proud", "Beauty is not useful"],
    answer: "True beauty comes from a generous heart",
  },
  {
    question: "What happened to the garden because of Polly?",
    options: ["It became kinder for everyone", "It became empty", "It became colder", "It disappeared"],
    answer: "It became kinder for everyone",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Kindness makes our heart beautiful", "Never help small animals", "Only feathers matter", "Helping is not important"],
    answer: "Kindness makes our heart beautiful",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Polly", "Polly / nama merak", "ˈpɑːli"],
  ["peacock", "burung merak", "ˈpiːkɑːk"],
  ["big", "besar", "bɪɡ"],
  ["heart", "hati", "hɑːrt"],
  ["colorful", "penuh warna", "ˈkʌlərfl"],
  ["garden", "taman", "ˈɡɑːrdn"],
  ["beautiful", "indah", "ˈbjuːtɪfl"],
  ["feathers", "bulu-bulu", "ˈfeðərz"],
  ["shimmered", "berkilauan", "ˈʃɪmərd"],
  ["sun", "matahari", "sʌn"],
  ["spotted", "melihat", "ˈspɑːtɪd"],
  ["butterfly", "kupu-kupu", "ˈbʌtərflaɪ"],
  ["torn", "robek", "tɔːrn"],
  ["wing", "sayap", "wɪŋ"],
  ["fluttering", "mengepak-ngepak", "ˈflʌtərɪŋ"],
  ["helplessly", "tanpa daya", "ˈhelpləsli"],
  ["asked", "bertanya", "æskt"],
  ["hurts", "sakit", "hɜːrts"],
  ["gently", "dengan lembut", "ˈdʒentli"],
  ["carried", "membawa", "ˈkærid"],
  ["safe", "aman", "seɪf"],
  ["leaves", "daun-daun", "liːvz"],
  ["shelter", "tempat berlindung", "ˈʃeltər"],
  ["whispered", "berbisik", "ˈwɪspərd"],
  ["happy", "bahagia", "ˈhæpi"],
  ["squirrel", "tupai", "ˈskwɜːrəl"],
  ["tangled", "kusut", "ˈtæŋɡld"],
  ["cozy", "nyaman", "ˈkoʊzi"],
  ["generous", "murah hati", "ˈdʒenərəs"],
  ["kindness", "kebaikan", "ˈkaɪndnəs"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Can I help?",
    meaning: "Bolehkah aku membantu?",
    useCase: "Dipakai saat melihat teman atau makhluk lain sedang kesulitan.",
    dialog: [
      {
        speaker: "Polly",
        text: "Can I help?",
        translation: "Bolehkah aku membantu?",
      },
      {
        speaker: "Butterfly",
        text: "Yes, please. My wing hurts.",
        translation: "Ya, tolong. Sayapku sakit.",
      },
    ],
    practicePrompt: "Latih tawaran bantuan: Can I help? Yes, please.",
  },
  {
    expression: "My wing hurts.",
    meaning: "Sayapku sakit.",
    useCase: "Dipakai untuk menjelaskan bagian tubuh yang sakit.",
    dialog: [
      {
        speaker: "Butterfly",
        text: "My wing hurts, and I can't fly.",
        translation: "Sayapku sakit, dan aku tidak bisa terbang.",
      },
      {
        speaker: "Polly",
        text: "I will help you rest.",
        translation: "Aku akan membantumu beristirahat.",
      },
    ],
    practicePrompt: "Ganti bagian tubuh: My hand hurts. My foot hurts.",
  },
  {
    expression: "I can't fly.",
    meaning: "Aku tidak bisa terbang.",
    useCase: "Dipakai untuk menyampaikan sesuatu yang belum bisa dilakukan.",
    dialog: [
      {
        speaker: "Butterfly",
        text: "I can't fly.",
        translation: "Aku tidak bisa terbang.",
      },
      {
        speaker: "Polly",
        text: "Do not worry. You can rest here.",
        translation: "Jangan khawatir. Kamu bisa beristirahat di sini.",
      },
    ],
    practicePrompt: "Latih pola kemampuan: I can jump. I can't fly.",
  },
  {
    expression: "You can rest here.",
    meaning: "Kamu bisa beristirahat di sini.",
    useCase: "Dipakai untuk memberi rasa aman kepada seseorang.",
    dialog: [
      {
        speaker: "Polly",
        text: "You can rest here on the soft leaves.",
        translation: "Kamu bisa beristirahat di sini di atas daun-daun yang lembut.",
      },
      {
        speaker: "Butterfly",
        text: "Thank you, Polly.",
        translation: "Terima kasih, Polly.",
      },
    ],
    practicePrompt: "Latih kalimat ramah: You can sit here. You can rest here.",
  },
  {
    expression: "Thank you, Polly!",
    meaning: "Terima kasih, Polly!",
    useCase: "Dipakai untuk berterima kasih setelah menerima pertolongan.",
    dialog: [
      {
        speaker: "Butterfly",
        text: "Thank you, Polly!",
        translation: "Terima kasih, Polly!",
      },
      {
        speaker: "Polly",
        text: "You are welcome.",
        translation: "Sama-sama.",
      },
    ],
    practicePrompt: "Latih respons: Thank you. You are welcome.",
  },
  {
    expression: "I want to help more.",
    meaning: "Aku ingin membantu lebih banyak.",
    useCase: "Dipakai untuk menyatakan keinginan melakukan lebih banyak kebaikan.",
    dialog: [
      {
        speaker: "Polly",
        text: "I feel happy inside. I want to help more.",
        translation: "Aku merasa bahagia di dalam hati. Aku ingin membantu lebih banyak.",
      },
      {
        speaker: "Narrator",
        text: "Polly kept looking around the garden.",
        translation: "Polly terus melihat sekeliling taman.",
      },
    ],
    practicePrompt: "Ajak anak membuat kalimat: I want to help my family.",
  },
  {
    expression: "It isn't my problem, but I can help.",
    meaning: "Itu bukan masalahku, tetapi aku bisa membantu.",
    useCase: "Dipakai untuk belajar peduli meskipun masalah itu bukan milik kita.",
    dialog: [
      {
        speaker: "Polly",
        text: "It isn't my problem, but I can help.",
        translation: "Itu bukan masalahku, tetapi aku bisa membantu.",
      },
      {
        speaker: "Squirrel",
        text: "That is very kind.",
        translation: "Itu sangat baik.",
      },
    ],
    practicePrompt: "Diskusikan makna peduli: I can help.",
  },
  {
    expression: "Let's make your nest cozy.",
    meaning: "Ayo buat sarangmu nyaman.",
    useCase: "Dipakai saat mengajak seseorang memperbaiki atau merapikan tempatnya.",
    dialog: [
      {
        speaker: "Polly",
        text: "Let's make your nest cozy.",
        translation: "Ayo buat sarangmu nyaman.",
      },
      {
        speaker: "Squirrel",
        text: "Thank you, Polly.",
        translation: "Terima kasih, Polly.",
      },
    ],
    practicePrompt: "Latih ajakan: Let's make it clean. Let's make it cozy.",
  },
  {
    expression: "True beauty comes from the heart.",
    meaning: "Kecantikan sejati berasal dari hati.",
    useCase: "Dipakai untuk menyimpulkan pesan moral cerita.",
    dialog: [
      {
        speaker: "Polly",
        text: "True beauty comes from the heart.",
        translation: "Kecantikan sejati berasal dari hati.",
      },
      {
        speaker: "Narrator",
        text: "Her kindness made the garden brighter.",
        translation: "Kebaikannya membuat taman lebih cerah.",
      },
    ],
    practicePrompt: "Ajak anak mengulang: True beauty comes from the heart.",
  },
  {
    expression: "A generous heart helps everyone.",
    meaning: "Hati yang murah hati membantu semua orang.",
    useCase: "Dipakai untuk menutup cerita dengan pesan tentang kemurahan hati.",
    dialog: [
      {
        speaker: "Narrator",
        text: "A generous heart helps everyone.",
        translation: "Hati yang murah hati membantu semua orang.",
      },
      {
        speaker: "Polly",
        text: "I will keep being kind.",
        translation: "Aku akan terus bersikap baik.",
      },
    ],
    practicePrompt: "Latih kalimat nilai: A generous heart helps everyone.",
  },
];

export const video15: DigitalStory = {
  id: "video15",
  number: 15,
  title: "Polly the Peacock's Big Heart",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Polly-the-Peacock's-Big-Heart.jpg",
  videoPreviewUrl: drivePreview("1-05Mi_ke8JRi07TNEJ3OsPX-IFiG8WE_"),
  videoViewUrl: driveView("1-05Mi_ke8JRi07TNEJ3OsPX-IFiG8WE_"),
  pdfPreviewUrl: drivePreview("1nFyShcUUHOKrWeBR5DfbiL62ZWd0P_O5"),
  pdfViewUrl: "https://drive.google.com/file/d/1nFyShcUUHOKrWeBR5DfbiL62ZWd0P_O5/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Polly, seekor burung merak yang tinggal di taman penuh warna. Ia memiliki bulu-bulu indah yang berkilau saat terkena cahaya matahari.",
    "Suatu hari, Polly melihat seekor kupu-kupu dengan sayap robek yang mengepak tanpa daya. Polly menawarkan bantuan, lalu membawa kupu-kupu itu dengan lembut ke tempat tidur dari daun-daun halus dan melindunginya dengan bulu-bulunya.",
    "Setelah kupu-kupu berterima kasih, Polly merasa bahagia di dalam hati dan ingin membantu lebih banyak. Ia kemudian melihat seekor tupai dengan bulu yang kusut dan sarang yang kurang nyaman.",
    "Meskipun itu bukan masalahnya, Polly tetap menolong dengan baik hati. Ia membantu merapikan bulu tupai dan membuat sarangnya lebih nyaman, sehingga tupai merasa aman dan berterima kasih.",
    "Polly akhirnya belajar bahwa keindahan sejati bukan hanya tentang warna atau kebanggaan, tetapi tentang hati yang murah hati. Kebaikan Polly membuat taman menjadi tempat yang lebih ramah dan penuh kasih bagi semua.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
