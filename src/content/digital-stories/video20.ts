import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Berry the Bird's Big Nest", "Luna's Ice Adventures", "Zaid's Bright Ideas", "The Helpful Hive"],
    answer: "Berry the Bird's Big Nest",
  },
  {
    question: "Who is the main character?",
    options: ["Berry", "Luna", "Zaid", "Andy"],
    answer: "Berry",
  },
  {
    question: "What kind of animal is Berry?",
    options: ["A bird", "A bee", "An ant", "A turtle"],
    answer: "A bird",
  },
  {
    question: "Where did Berry live?",
    options: ["In a cozy tree", "In a city apartment", "In a snowy igloo", "In a river"],
    answer: "In a cozy tree",
  },
  {
    question: "What did Berry love?",
    options: ["Singing and flying", "Running and racing", "Sleeping all day", "Building machines"],
    answer: "Singing and flying",
  },
  {
    question: "What did Berry want to build?",
    options: ["A comfy nest for her family", "A water machine", "A tiny ice sculpture", "A racing track"],
    answer: "A comfy nest for her family",
  },
  {
    question: "What was the first problem with Berry's nest?",
    options: ["The twigs were too big and leaves fell down", "The nest was too cold with snow", "The water was dirty", "The flowers disappeared"],
    answer: "The twigs were too big and leaves fell down",
  },
  {
    question: "What did Berry try to build with?",
    options: ["Tiny twigs", "Colorful blocks", "Ice crystals", "River stones"],
    answer: "Tiny twigs",
  },
  {
    question: "How did Berry feel when building alone was hard?",
    options: ["Tired", "Angry at everyone", "Very proud", "Sleepy and bored"],
    answer: "Tired",
  },
  {
    question: "Who chirped to Berry?",
    options: ["Her bird friends", "Her teacher", "A group of gnomes", "A family of ants"],
    answer: "Her bird friends",
  },
  {
    question: "What did Berry's friends say?",
    options: ["Let's help, Berry!", "Go away, Berry!", "Stop building forever!", "This is for the world!"],
    answer: "Let's help, Berry!",
  },
  {
    question: "What did the friends gather together?",
    options: ["Twigs, leaves, berries, and soft feathers", "Books, bags, and pencils", "Shells, sand, and boats", "Snow, stars, and medals"],
    answer: "Twigs, leaves, berries, and soft feathers",
  },
  {
    question: "How did the nest become?",
    options: ["Warm and sturdy", "Cold and empty", "Wet and broken", "Tiny and unsafe"],
    answer: "Warm and sturdy",
  },
  {
    question: "What did Berry say when the nest was ready?",
    options: ["Thank you, friends!", "I did it all alone!", "This nest is terrible!", "I want to stop helping!"],
    answer: "Thank you, friends!",
  },
  {
    question: "Who hatched in the cozy nest?",
    options: ["Berry's chicks", "Tiny turtles", "Little bees", "Baby dragons"],
    answer: "Berry's chicks",
  },
  {
    question: "How did the little chicks feel?",
    options: ["Safe in their cozy nest", "Lost in the forest", "Afraid of every friend", "Angry at Berry"],
    answer: "Safe in their cozy nest",
  },
  {
    question: "What did Berry and her chicks do in the tree?",
    options: ["Sang songs every afternoon", "Built a machine", "Ran a race", "Hid from everyone"],
    answer: "Sang songs every afternoon",
  },
  {
    question: "What did Berry help her chicks learn?",
    options: ["To fly", "To build a robot", "To clean water", "To climb ice mountains"],
    answer: "To fly",
  },
  {
    question: "What helped Berry finish the big nest?",
    options: ["Teamwork and friendship", "Doing everything alone", "Ignoring her friends", "Giving up"],
    answer: "Teamwork and friendship",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Friends can build something wonderful together", "Never ask for help", "A nest does not need care", "Small birds cannot do big things"],
    answer: "Friends can build something wonderful together",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Berry", "Berry / nama burung", "ˈberi"],
  ["bird", "burung", "bɜːrd"],
  ["big", "besar", "bɪɡ"],
  ["nest", "sarang", "nest"],
  ["cozy", "nyaman / hangat", "ˈkoʊzi"],
  ["tree", "pohon", "triː"],
  ["red", "merah", "red"],
  ["loved", "menyukai", "lʌvd"],
  ["singing", "bernyanyi", "ˈsɪŋɪŋ"],
  ["flying", "terbang", "ˈflaɪɪŋ"],
  ["comfy", "nyaman", "ˈkʌmfi"],
  ["family", "keluarga", "ˈfæməli"],
  ["making", "membuat", "ˈmeɪkɪŋ"],
  ["twigs", "ranting-ranting kecil", "twɪɡz"],
  ["leaves", "daun-daun", "liːvz"],
  ["fall", "jatuh", "fɔːl"],
  ["hopped", "melompat-lompat", "hɑːpt"],
  ["trying", "mencoba", "ˈtraɪɪŋ"],
  ["tricky", "sulit / rumit", "ˈtrɪki"],
  ["chirped", "berkicau", "tʃɜːrpt"],
  ["friends", "teman-teman", "frendz"],
  ["gathered", "mengumpulkan", "ˈɡæðərd"],
  ["berries", "buah beri", "ˈberiz"],
  ["soft", "lembut", "sɔːft"],
  ["feathers", "bulu-bulu", "ˈfeðərz"],
  ["sturdy", "kuat / kokoh", "ˈstɜːrdi"],
  ["hatched", "menetas", "hætʃt"],
  ["chicks", "anak-anak burung", "tʃɪks"],
  ["safe", "aman", "seɪf"],
  ["teamwork", "kerja sama", "ˈtiːmwɜːrk"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I want to build a comfy nest.",
    meaning: "Aku ingin membangun sarang yang nyaman.",
    useCase: "Dipakai saat menyampaikan rencana membuat sesuatu.",
    dialog: [
      {
        speaker: "Berry",
        text: "I want to build a comfy nest.",
        translation: "Aku ingin membangun sarang yang nyaman.",
      },
      {
        speaker: "Friend",
        text: "That sounds lovely, Berry.",
        translation: "Itu terdengar indah, Berry.",
      },
    ],
    practicePrompt: "Latih rencana: I want to build a...",
  },
  {
    expression: "This is tricky.",
    meaning: "Ini sulit.",
    useCase: "Dipakai saat mengerjakan sesuatu yang terasa rumit.",
    dialog: [
      {
        speaker: "Berry",
        text: "This is tricky.",
        translation: "Ini sulit.",
      },
      {
        speaker: "Friend",
        text: "We can help you.",
        translation: "Kami bisa membantumu.",
      },
    ],
    practicePrompt: "Latih saat belajar: This is tricky, but I can try.",
  },
  {
    expression: "Can you help me?",
    meaning: "Bisakah kamu membantuku?",
    useCase: "Dipakai saat membutuhkan bantuan dengan sopan.",
    dialog: [
      {
        speaker: "Berry",
        text: "Can you help me?",
        translation: "Bisakah kamu membantuku?",
      },
      {
        speaker: "Bird Friends",
        text: "Yes! Let's help, Berry!",
        translation: "Ya! Ayo bantu, Berry!",
      },
    ],
    practicePrompt: "Latih meminta bantuan: Can you help me?",
  },
  {
    expression: "Let's help, Berry!",
    meaning: "Ayo bantu, Berry!",
    useCase: "Dipakai saat mengajak teman menolong seseorang.",
    dialog: [
      {
        speaker: "Bird Friends",
        text: "Let's help, Berry!",
        translation: "Ayo bantu, Berry!",
      },
      {
        speaker: "Berry",
        text: "Thank you, friends.",
        translation: "Terima kasih, teman-teman.",
      },
    ],
    practicePrompt: "Latih ajakan: Let's help!",
  },
  {
    expression: "We can build it together.",
    meaning: "Kita bisa membangunnya bersama.",
    useCase: "Dipakai untuk memberi semangat kerja sama.",
    dialog: [
      {
        speaker: "Friend",
        text: "We can build it together.",
        translation: "Kita bisa membangunnya bersama.",
      },
      {
        speaker: "Berry",
        text: "Yes, together is better.",
        translation: "Ya, bersama lebih baik.",
      },
    ],
    practicePrompt: "Ajak anak mengulang: We can build it together.",
  },
  {
    expression: "Please bring soft feathers.",
    meaning: "Tolong bawakan bulu-bulu lembut.",
    useCase: "Dipakai saat meminta bahan atau benda dengan sopan.",
    dialog: [
      {
        speaker: "Berry",
        text: "Please bring soft feathers.",
        translation: "Tolong bawakan bulu-bulu lembut.",
      },
      {
        speaker: "Friend",
        text: "I will bring some feathers.",
        translation: "Aku akan membawa beberapa bulu.",
      },
    ],
    practicePrompt: "Ganti benda: Please bring soft leaves.",
  },
  {
    expression: "The nest is warm and sturdy.",
    meaning: "Sarangnya hangat dan kokoh.",
    useCase: "Dipakai untuk menggambarkan hasil kerja yang selesai dengan baik.",
    dialog: [
      {
        speaker: "Berry",
        text: "The nest is warm and sturdy.",
        translation: "Sarangnya hangat dan kokoh.",
      },
      {
        speaker: "Bird Friends",
        text: "It is perfect for your chicks.",
        translation: "Ini sempurna untuk anak-anak burungmu.",
      },
    ],
    practicePrompt: "Latih deskripsi: The house is warm and sturdy.",
  },
  {
    expression: "Thank you, friends!",
    meaning: "Terima kasih, teman-teman!",
    useCase: "Dipakai untuk berterima kasih kepada beberapa teman.",
    dialog: [
      {
        speaker: "Berry",
        text: "Thank you, friends!",
        translation: "Terima kasih, teman-teman!",
      },
      {
        speaker: "Bird Friends",
        text: "You are welcome, Berry.",
        translation: "Sama-sama, Berry.",
      },
    ],
    practicePrompt: "Latih respons: Thank you, friends. You are welcome.",
  },
  {
    expression: "You are safe here.",
    meaning: "Kalian aman di sini.",
    useCase: "Dipakai untuk menenangkan seseorang di tempat yang nyaman.",
    dialog: [
      {
        speaker: "Berry",
        text: "You are safe here.",
        translation: "Kalian aman di sini.",
      },
      {
        speaker: "Chicks",
        text: "We feel warm, Mama.",
        translation: "Kami merasa hangat, Mama.",
      },
    ],
    practicePrompt: "Latih kalimat menenangkan: You are safe here.",
  },
  {
    expression: "Friends make big jobs easier.",
    meaning: "Teman membuat pekerjaan besar menjadi lebih mudah.",
    useCase: "Dipakai untuk menyimpulkan pesan moral tentang kerja sama.",
    dialog: [
      {
        speaker: "Berry",
        text: "Friends make big jobs easier.",
        translation: "Teman membuat pekerjaan besar menjadi lebih mudah.",
      },
      {
        speaker: "Narrator",
        text: "Berry and her chicks lived happily ever after.",
        translation: "Berry dan anak-anak burungnya hidup bahagia selamanya.",
      },
    ],
    practicePrompt: "Diskusikan tugas apa yang lebih mudah jika dikerjakan bersama.",
  },
];

export const video20: DigitalStory = {
  id: "video20",
  number: 20,
  title: "Berry the Bird's Big Nest",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Berry-the-Bird's-Big-Nest.jpg",
  videoPreviewUrl: drivePreview("180mYhYnC14EKSihqWF4lJH9F5cpqN446"),
  videoViewUrl: driveView("180mYhYnC14EKSihqWF4lJH9F5cpqN446"),
  pdfPreviewUrl: drivePreview("1BZsiYg1WKUr_ik5XGsRKNl4FzgaXfyxg"),
  pdfViewUrl: "https://drive.google.com/file/d/1BZsiYg1WKUr_ik5XGsRKNl4FzgaXfyxg/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Berry, seekor burung merah kecil yang tinggal di pohon yang nyaman. Berry suka bernyanyi dan terbang, dan ia ingin membangun sarang yang nyaman untuk keluarganya.",
    "Berry mencoba membuat sarang sendiri, tetapi ranting-rantingnya terlalu besar dan daun-daunnya terus jatuh. Ia melompat-lompat mencari ranting kecil, namun membangun sarang sendirian ternyata sangat sulit.",
    "Saat Berry mulai lelah, teman-teman burungnya datang dan berkicau bahwa mereka akan membantu. Bersama-sama, mereka mengumpulkan ranting, daun, buah beri, dan bulu-bulu lembut.",
    "Sedikit demi sedikit, sarang Berry tumbuh menjadi hangat, kuat, dan nyaman. Berry berterima kasih kepada teman-temannya karena mereka membantunya membuat tempat yang aman untuk anak-anak burungnya.",
    "Ketika anak-anak burung Berry menetas, mereka merasa aman di sarang yang nyaman. Berry dan anak-anaknya bernyanyi setiap sore, lalu Berry mengajari mereka terbang. Cerita ini menunjukkan bahwa persahabatan dan kerja sama membuat pekerjaan besar terasa lebih mudah.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
