import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Ollie the Wise Orangutan", "Polly the Peacock's Big Heart", "Draco's Kind Wings", "The Helpful Hive"],
    answer: "Ollie the Wise Orangutan",
  },
  {
    question: "Who is the main character?",
    options: ["Ollie", "Polly", "Draco", "Buzz"],
    answer: "Ollie",
  },
  {
    question: "What kind of animal is Ollie?",
    options: ["An orangutan", "A peacock", "A dragon", "A turtle"],
    answer: "An orangutan",
  },
  {
    question: "Where did Ollie live?",
    options: ["In the lush forests of Kalimantan", "In a snowy village", "On a beach", "In a classroom"],
    answer: "In the lush forests of Kalimantan",
  },
  {
    question: "What was Ollie known for?",
    options: ["His wisdom", "His running speed", "His loud trumpet", "His magic boat"],
    answer: "His wisdom",
  },
  {
    question: "What color was Ollie's fur?",
    options: ["Warm orange", "Bright blue", "Snow white", "Dark purple"],
    answer: "Warm orange",
  },
  {
    question: "Who did Ollie notice one day?",
    options: ["A group of playful deer", "A family of ants", "A lost dragon", "A sleepy boy"],
    answer: "A group of playful deer",
  },
  {
    question: "How were the deer feeling?",
    options: ["Sad", "Excited", "Angry", "Sleepy"],
    answer: "Sad",
  },
  {
    question: "Who had taken the deer's favorite fruits?",
    options: ["A mischievous monkey", "A tiny bee", "A baby owl", "A wise turtle"],
    answer: "A mischievous monkey",
  },
  {
    question: "What did Ollie ask the deer?",
    options: ["Can I help?", "Can I race?", "Can I hide?", "Can I sleep?"],
    answer: "Can I help?",
  },
  {
    question: "How did the animals respond?",
    options: ["They nodded", "They ran away", "They laughed at him", "They fell asleep"],
    answer: "They nodded",
  },
  {
    question: "How did Ollie move through the trees?",
    options: ["He swung from tree to tree", "He flew with wings", "He swam through a river", "He rode a bicycle"],
    answer: "He swung from tree to tree",
  },
  {
    question: "What did Ollie gather?",
    options: ["The juiciest fruits", "Colorful puzzle pieces", "Broken shells", "School books"],
    answer: "The juiciest fruits",
  },
  {
    question: "What did Ollie do with the fruits?",
    options: ["Shared them with his friends", "Hid them alone", "Threw them away", "Sold them in a shop"],
    answer: "Shared them with his friends",
  },
  {
    question: "What did the animals say to Ollie?",
    options: ["Thank you, Ollie!", "Go away, Ollie!", "You are too slow", "We do not like fruit"],
    answer: "Thank you, Ollie!",
  },
  {
    question: "How did Ollie feel after helping the deer?",
    options: ["A warm breeze of happiness", "Very angry", "Lonely and afraid", "Too tired to care"],
    answer: "A warm breeze of happiness",
  },
  {
    question: "Who did Ollie spot next?",
    options: ["A colorful butterfly", "A running boy", "A lost gnome", "A hungry turtle"],
    answer: "A colorful butterfly",
  },
  {
    question: "What was wrong with the butterfly?",
    options: ["It had a torn wing", "It lost a compass", "It could not find vegetables", "It was afraid of school"],
    answer: "It had a torn wing",
  },
  {
    question: "What did the butterfly say after being helped?",
    options: ["Thank you, wise Ollie!", "I do not need help", "Please take my fruit", "Where is the village?"],
    answer: "Thank you, wise Ollie!",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Small acts of kindness can make a big difference", "Never share with friends", "Wisdom is only for adults", "Helping others is useless"],
    answer: "Small acts of kindness can make a big difference",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Ollie", "Ollie / nama orangutan", "ˈɑːli"],
  ["wise", "bijaksana", "waɪz"],
  ["orangutan", "orangutan", "ɔːˈræŋətæn"],
  ["lush", "rimbun", "lʌʃ"],
  ["forest", "hutan", "ˈfɔːrəst"],
  ["Kalimantan", "Kalimantan", "ˌkɑːliˈmɑːntən"],
  ["known", "dikenal", "noʊn"],
  ["wisdom", "kebijaksanaan", "ˈwɪzdəm"],
  ["orange", "oranye", "ˈɔːrɪndʒ"],
  ["kindness", "kebaikan", "ˈkaɪndnəs"],
  ["noticed", "memperhatikan", "ˈnoʊtɪst"],
  ["playful", "ceria / suka bermain", "ˈpleɪfl"],
  ["deer", "rusa", "dɪr"],
  ["sad", "sedih", "sæd"],
  ["mischievous", "nakal / jahil", "ˈmɪstʃɪvəs"],
  ["monkey", "monyet", "ˈmʌŋki"],
  ["favorite", "favorit", "ˈfeɪvərɪt"],
  ["fruits", "buah-buahan", "fruːts"],
  ["twinkle", "kerlip / binar", "ˈtwɪŋkl"],
  ["nodded", "mengangguk", "ˈnɑːdɪd"],
  ["swung", "berayun", "swʌŋ"],
  ["tree", "pohon", "triː"],
  ["gathering", "mengumpulkan", "ˈɡæðərɪŋ"],
  ["juiciest", "paling berair", "ˈdʒuːsiəst"],
  ["sharing", "berbagi", "ˈʃerɪŋ"],
  ["friends", "teman-teman", "frendz"],
  ["butterfly", "kupu-kupu", "ˈbʌtərflaɪ"],
  ["torn", "robek", "tɔːrn"],
  ["wing", "sayap", "wɪŋ"],
  ["difference", "perbedaan", "ˈdɪfərəns"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Can I help?",
    meaning: "Bolehkah aku membantu?",
    useCase: "Dipakai saat menawarkan bantuan kepada seseorang yang tampak sedih atau kesulitan.",
    dialog: [
      {
        speaker: "Ollie",
        text: "Can I help?",
        translation: "Bolehkah aku membantu?",
      },
      {
        speaker: "Deer",
        text: "Yes, please. Our fruits are gone.",
        translation: "Ya, tolong. Buah-buah kami hilang.",
      },
    ],
    practicePrompt: "Latih tawaran bantuan: Can I help? Yes, please.",
  },
  {
    expression: "Our fruits are gone.",
    meaning: "Buah-buah kami hilang.",
    useCase: "Dipakai untuk menjelaskan bahwa sesuatu sudah tidak ada atau hilang.",
    dialog: [
      {
        speaker: "Deer",
        text: "Our fruits are gone.",
        translation: "Buah-buah kami hilang.",
      },
      {
        speaker: "Ollie",
        text: "I will look for more fruits.",
        translation: "Aku akan mencari lebih banyak buah.",
      },
    ],
    practicePrompt: "Ganti benda: Our books are gone. Our toys are gone.",
  },
  {
    expression: "I will share with you.",
    meaning: "Aku akan berbagi dengan kalian.",
    useCase: "Dipakai saat ingin menunjukkan sikap suka berbagi.",
    dialog: [
      {
        speaker: "Ollie",
        text: "I will share with you.",
        translation: "Aku akan berbagi dengan kalian.",
      },
      {
        speaker: "Animals",
        text: "Thank you, Ollie!",
        translation: "Terima kasih, Ollie!",
      },
    ],
    practicePrompt: "Latih kalimat baik: I will share with my friend.",
  },
  {
    expression: "Let's gather fruit together.",
    meaning: "Ayo kita mengumpulkan buah bersama.",
    useCase: "Dipakai saat mengajak teman bekerja sama.",
    dialog: [
      {
        speaker: "Ollie",
        text: "Let's gather fruit together.",
        translation: "Ayo kita mengumpulkan buah bersama.",
      },
      {
        speaker: "Deer",
        text: "That sounds helpful.",
        translation: "Itu terdengar membantu.",
      },
    ],
    practicePrompt: "Latih ajakan: Let's work together.",
  },
  {
    expression: "Thank you, Ollie!",
    meaning: "Terima kasih, Ollie!",
    useCase: "Dipakai untuk berterima kasih setelah menerima bantuan.",
    dialog: [
      {
        speaker: "Animals",
        text: "Thank you, Ollie!",
        translation: "Terima kasih, Ollie!",
      },
      {
        speaker: "Ollie",
        text: "You are welcome, friends.",
        translation: "Sama-sama, teman-teman.",
      },
    ],
    practicePrompt: "Latih respons: Thank you. You are welcome.",
  },
  {
    expression: "I feel happy when I help.",
    meaning: "Aku merasa bahagia saat membantu.",
    useCase: "Dipakai untuk menceritakan perasaan setelah melakukan kebaikan.",
    dialog: [
      {
        speaker: "Ollie",
        text: "I feel happy when I help.",
        translation: "Aku merasa bahagia saat membantu.",
      },
      {
        speaker: "Narrator",
        text: "A warm breeze of happiness followed him.",
        translation: "Angin kebahagiaan yang hangat mengikutinya.",
      },
    ],
    practicePrompt: "Ajak anak melengkapi: I feel happy when I...",
  },
  {
    expression: "Are you okay?",
    meaning: "Apakah kamu baik-baik saja?",
    useCase: "Dipakai saat ingin mengecek keadaan seseorang dengan peduli.",
    dialog: [
      {
        speaker: "Ollie",
        text: "Are you okay?",
        translation: "Apakah kamu baik-baik saja?",
      },
      {
        speaker: "Butterfly",
        text: "My wing is hurt.",
        translation: "Sayapku terluka.",
      },
    ],
    practicePrompt: "Latih pertanyaan peduli: Are you okay?",
  },
  {
    expression: "My wing is hurt.",
    meaning: "Sayapku terluka.",
    useCase: "Dipakai untuk menjelaskan bagian tubuh yang terluka.",
    dialog: [
      {
        speaker: "Butterfly",
        text: "My wing is hurt.",
        translation: "Sayapku terluka.",
      },
      {
        speaker: "Ollie",
        text: "I will be gentle.",
        translation: "Aku akan berhati-hati.",
      },
    ],
    practicePrompt: "Ganti bagian tubuh: My hand is hurt. My foot is hurt.",
  },
  {
    expression: "Small kindness can make a big difference.",
    meaning: "Kebaikan kecil bisa membuat perbedaan besar.",
    useCase: "Dipakai untuk menyimpulkan nilai utama cerita.",
    dialog: [
      {
        speaker: "Ollie",
        text: "Small kindness can make a big difference.",
        translation: "Kebaikan kecil bisa membuat perbedaan besar.",
      },
      {
        speaker: "Butterfly",
        text: "Thank you, wise Ollie!",
        translation: "Terima kasih, Ollie yang bijak!",
      },
    ],
    practicePrompt: "Ajak anak mengulang pesan moral ini bersama.",
  },
  {
    expression: "I want to bring joy.",
    meaning: "Aku ingin membawa kegembiraan.",
    useCase: "Dipakai untuk menyatakan niat membuat sekitar menjadi lebih bahagia.",
    dialog: [
      {
        speaker: "Ollie",
        text: "I want to bring joy to the forest.",
        translation: "Aku ingin membawa kegembiraan ke hutan.",
      },
      {
        speaker: "Narrator",
        text: "The jungle became happier and friendlier.",
        translation: "Hutan menjadi lebih bahagia dan lebih ramah.",
      },
    ],
    practicePrompt: "Latih kalimat tujuan: I want to bring joy.",
  },
];

export const video16: DigitalStory = {
  id: "video16",
  number: 16,
  title: "Ollie the Wise Orangutan",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Ollie-the-Wise-Orangutan.jpg",
  videoPreviewUrl: drivePreview("1YuHMTn-RbeakJlZtBVU-Q28i28eqceI6"),
  videoViewUrl: driveView("1YuHMTn-RbeakJlZtBVU-Q28i28eqceI6"),
  pdfPreviewUrl: drivePreview("1Ybv-mUw9vy7Wy_aOWr60zBQVbM0BcVKq"),
  pdfViewUrl: "https://drive.google.com/file/d/1Ybv-mUw9vy7Wy_aOWr60zBQVbM0BcVKq/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Ollie, seekor orangutan bijaksana yang tinggal di hutan rimbun Kalimantan. Ia dikenal karena kebijaksanaannya, bulu oranye yang hangat, dan hati yang penuh kebaikan.",
    "Suatu hari, Ollie melihat sekelompok rusa kecil yang sedih karena seekor monyet jahil mengambil buah favorit mereka. Ollie bertanya apakah ia bisa membantu, dan para hewan mengangguk penuh harap.",
    "Ollie berayun dari pohon ke pohon untuk mengumpulkan buah-buah paling segar dan membagikannya kepada teman-temannya. Para hewan berterima kasih karena Ollie membuat mereka kembali tersenyum.",
    "Setelah itu, Ollie merasakan kebahagiaan karena telah membantu. Ia kemudian melihat seekor kupu-kupu dengan sayap robek dan menolongnya dengan hati-hati sampai kupu-kupu itu bisa kembali merasa aman.",
    "Ollie menyadari bahwa tindakan kecil penuh kebaikan dapat membuat perbedaan besar. Sejak hari itu, ia menggunakan kebijaksanaan dan kreativitasnya untuk membawa kegembiraan ke hutan, membuat jungle menjadi tempat yang lebih bahagia dan ramah.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
