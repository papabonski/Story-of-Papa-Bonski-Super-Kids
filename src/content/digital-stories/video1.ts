import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the main character in the story?",
    options: ["A little bird", "A little tree", "A little river", "A little cloud"],
    answer: "A little tree",
  },
  {
    question: "What does the little tree want to do?",
    options: ["Sleep all day", "Go on a journey", "Hide from the sun", "Become a rock"],
    answer: "Go on a journey",
  },
  {
    question: "What helps the tree grow?",
    options: ["Rain and sunlight", "Sand and smoke", "Noise and dust", "Ice and fire"],
    answer: "Rain and sunlight",
  },
  {
    question: "How does the little tree feel at the beginning?",
    options: ["Curious", "Angry", "Lazy", "Mean"],
    answer: "Curious",
  },
  {
    question: "What lesson does the tree learn?",
    options: ["Growth takes time", "Never share", "Run away from friends", "Be afraid of change"],
    answer: "Growth takes time",
  },
  {
    question: "Which word means perjalanan?",
    options: ["Journey", "Branch", "Root", "Leaf"],
    answer: "Journey",
  },
  {
    question: "Which part of a tree grows under the ground?",
    options: ["Root", "Leaf", "Cloud", "Flower"],
    answer: "Root",
  },
  {
    question: "What should we do when things are hard?",
    options: ["Give up", "Keep trying", "Blame others", "Stop learning"],
    answer: "Keep trying",
  },
  {
    question: "What does the little tree see during its journey?",
    options: ["Nature around it", "A big city only", "A spaceship", "A classroom"],
    answer: "Nature around it",
  },
  {
    question: "Which word means berani?",
    options: ["Brave", "Tiny", "Quiet", "Dry"],
    answer: "Brave",
  },
  {
    question: "Why are friends important in the story?",
    options: ["They give support", "They make trouble only", "They stop growth", "They hide the sun"],
    answer: "They give support",
  },
  {
    question: "What does sunshine give to the tree?",
    options: ["Warmth and energy", "Darkness", "Snow", "Noise"],
    answer: "Warmth and energy",
  },
  {
    question: "What does the story teach about change?",
    options: ["Change can help us grow", "Change is always bad", "Change should be ignored", "Change makes trees disappear"],
    answer: "Change can help us grow",
  },
  {
    question: "Which word means daun?",
    options: ["Leaf", "Seed", "Hill", "Wind"],
    answer: "Leaf",
  },
  {
    question: "What is a good title for the story?",
    options: ["The Little Tree's Journey", "The Angry Mountain", "The Lost Pencil", "The Fast Car"],
    answer: "The Little Tree's Journey",
  },
  {
    question: "What value is shown by the little tree?",
    options: ["Patience", "Greed", "Rudeness", "Fear"],
    answer: "Patience",
  },
  {
    question: "What does the tree become stronger through?",
    options: ["Challenges", "Complaining", "Ignoring others", "Staying the same"],
    answer: "Challenges",
  },
  {
    question: "Which word means tumbuh?",
    options: ["Grow", "Break", "Forget", "Throw"],
    answer: "Grow",
  },
  {
    question: "What should readers remember from the story?",
    options: ["Small steps matter", "Never ask for help", "Only big trees matter", "Learning is useless"],
    answer: "Small steps matter",
  },
  {
    question: "How is the story best described?",
    options: ["Gentle and inspiring", "Scary and violent", "Sad with no lesson", "Only about numbers"],
    answer: "Gentle and inspiring",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["journey", "perjalanan", "ˈdʒɜːrni"],
  ["little", "kecil", "ˈlɪtl"],
  ["tree", "pohon", "triː"],
  ["seed", "biji", "siːd"],
  ["root", "akar", "ruːt"],
  ["branch", "cabang", "bræntʃ"],
  ["leaf", "daun", "liːf"],
  ["forest", "hutan", "ˈfɔːrɪst"],
  ["sunlight", "sinar matahari", "ˈsʌnlaɪt"],
  ["rain", "hujan", "reɪn"],
  ["wind", "angin", "wɪnd"],
  ["soil", "tanah", "sɔɪl"],
  ["grow", "tumbuh", "ɡroʊ"],
  ["strong", "kuat", "strɔːŋ"],
  ["brave", "berani", "breɪv"],
  ["curious", "penasaran", "ˈkjʊriəs"],
  ["patient", "sabar", "ˈpeɪʃnt"],
  ["kind", "baik hati", "kaɪnd"],
  ["friend", "teman", "frend"],
  ["help", "membantu", "help"],
  ["learn", "belajar", "lɜːrn"],
  ["change", "perubahan", "tʃeɪndʒ"],
  ["hope", "harapan", "hoʊp"],
  ["dream", "impian", "driːm"],
  ["path", "jalan", "pæθ"],
  ["hill", "bukit", "hɪl"],
  ["river", "sungai", "ˈrɪvər"],
  ["sky", "langit", "skaɪ"],
  ["beautiful", "indah", "ˈbjuːtɪfl"],
  ["home", "rumah", "hoʊm"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I wonder...",
    meaning: "Aku penasaran...",
    useCase: "Dipakai saat anak ingin tahu tentang sesuatu.",
    dialog: [
      {
        speaker: "Little Tree",
        text: "I wonder what is beyond the garden.",
        translation: "Aku penasaran apa yang ada di luar taman.",
      },
      {
        speaker: "Sunbeam",
        text: "There is a big world waiting for you.",
        translation: "Ada dunia besar yang menunggumu.",
      },
    ],
    practicePrompt: "Ganti 'the garden' dengan tempat lain, misalnya 'the forest' atau 'my home'.",
  },
  {
    expression: "Can you help me?",
    meaning: "Bisakah kamu membantuku?",
    useCase: "Dipakai saat meminta bantuan dengan sopan.",
    dialog: [
      {
        speaker: "Little Tree",
        text: "Can you help me grow strong?",
        translation: "Bisakah kamu membantuku tumbuh kuat?",
      },
      {
        speaker: "Rain",
        text: "Of course. I will give you water.",
        translation: "Tentu saja. Aku akan memberimu air.",
      },
    ],
    practicePrompt: "Latih pola: Can you help me + verb? Contoh: Can you help me learn?",
  },
  {
    expression: "I feel...",
    meaning: "Aku merasa...",
    useCase: "Dipakai untuk menyampaikan perasaan.",
    dialog: [
      {
        speaker: "Little Tree",
        text: "I feel small, but I want to be brave.",
        translation: "Aku merasa kecil, tetapi aku ingin berani.",
      },
      {
        speaker: "Old Tree",
        text: "Small trees can become strong trees.",
        translation: "Pohon kecil bisa menjadi pohon yang kuat.",
      },
    ],
    practicePrompt: "Coba ucapkan tiga perasaan: I feel happy, I feel nervous, I feel brave.",
  },
  {
    expression: "One step at a time.",
    meaning: "Satu langkah demi satu langkah.",
    useCase: "Dipakai untuk memberi semangat saat proses terasa sulit.",
    dialog: [
      {
        speaker: "Wind",
        text: "Grow slowly, little tree. One step at a time.",
        translation: "Tumbuhlah perlahan, pohon kecil. Satu langkah demi satu langkah.",
      },
      {
        speaker: "Little Tree",
        text: "I will try my best today.",
        translation: "Aku akan berusaha sebaik mungkin hari ini.",
      },
    ],
    practicePrompt: "Gunakan saat memberi semangat teman: One step at a time. You can do it.",
  },
  {
    expression: "Do not give up.",
    meaning: "Jangan menyerah.",
    useCase: "Dipakai saat menyemangati seseorang yang sedang menghadapi tantangan.",
    dialog: [
      {
        speaker: "Cloud",
        text: "The storm is strong, but do not give up.",
        translation: "Badainya kuat, tetapi jangan menyerah.",
      },
      {
        speaker: "Little Tree",
        text: "I will hold my roots tight.",
        translation: "Aku akan menahan akarku dengan kuat.",
      },
    ],
    practicePrompt: "Role-play: satu anak menjadi teman yang sedih, anak lain berkata 'Do not give up.'",
  },
  {
    expression: "Thank you for...",
    meaning: "Terima kasih karena...",
    useCase: "Dipakai untuk mengucapkan terima kasih dengan alasan yang jelas.",
    dialog: [
      {
        speaker: "Little Tree",
        text: "Thank you for giving me sunlight.",
        translation: "Terima kasih karena memberiku sinar matahari.",
      },
      {
        speaker: "Sun",
        text: "You are welcome, little tree.",
        translation: "Sama-sama, pohon kecil.",
      },
    ],
    practicePrompt: "Buat kalimat: Thank you for helping me. Thank you for listening.",
  },
  {
    expression: "Change can help us grow.",
    meaning: "Perubahan bisa membantu kita bertumbuh.",
    useCase: "Dipakai saat membicarakan perubahan yang awalnya terasa sulit.",
    dialog: [
      {
        speaker: "Little Tree",
        text: "The wind feels different today.",
        translation: "Angin terasa berbeda hari ini.",
      },
      {
        speaker: "Old Tree",
        text: "Change can help us grow.",
        translation: "Perubahan bisa membantu kita bertumbuh.",
      },
    ],
    practicePrompt: "Diskusikan perubahan kecil di rumah atau sekolah yang membuat anak belajar hal baru.",
  },
  {
    expression: "May I rest here?",
    meaning: "Bolehkah aku beristirahat di sini?",
    useCase: "Dipakai saat meminta izin dengan sopan.",
    dialog: [
      {
        speaker: "Bird",
        text: "May I rest here on your branch?",
        translation: "Bolehkah aku beristirahat di cabangmu?",
      },
      {
        speaker: "Little Tree",
        text: "Yes, you may. Please be gentle.",
        translation: "Ya, boleh. Tolong hati-hati.",
      },
    ],
    practicePrompt: "Latih pola: May I + verb? Contoh: May I sit here? May I read this?",
  },
  {
    expression: "I hope...",
    meaning: "Aku berharap...",
    useCase: "Dipakai untuk menyampaikan harapan.",
    dialog: [
      {
        speaker: "Little Tree",
        text: "I hope I can become stronger.",
        translation: "Aku berharap aku bisa menjadi lebih kuat.",
      },
      {
        speaker: "Rain",
        text: "Keep growing. I believe in you.",
        translation: "Teruslah tumbuh. Aku percaya padamu.",
      },
    ],
    practicePrompt: "Ajak anak melengkapi kalimat: I hope I can...",
  },
  {
    expression: "Every small step matters.",
    meaning: "Setiap langkah kecil itu berarti.",
    useCase: "Dipakai untuk menutup refleksi atau mengambil pelajaran dari cerita.",
    dialog: [
      {
        speaker: "Old Tree",
        text: "Look at your new leaves. Every small step matters.",
        translation: "Lihat daun-daun barumu. Setiap langkah kecil itu berarti.",
      },
      {
        speaker: "Little Tree",
        text: "Now I know that growing takes time.",
        translation: "Sekarang aku tahu bahwa bertumbuh membutuhkan waktu.",
      },
    ],
    practicePrompt: "Minta anak menyebutkan satu langkah kecil yang ia lakukan hari ini.",
  },
];

export const video1: DigitalStory = {
  id: "video1",
  number: 1,
  title: "The Little Tree's Journey",
  language: "English",
  level: "Beginner",
  thumbnail: "/thumbnail-video/the-little-trees-journey.jpg",
  videoPreviewUrl: drivePreview("1wntVf_BPGL5ASchH8XR4_n7UccqQyFeL"),
  videoViewUrl: driveView("1wntVf_BPGL5ASchH8XR4_n7UccqQyFeL"),
  pdfPreviewUrl: drivePreview("1nqVV9mSn82gND3ldamNIZNydsLKYEy0o"),
  pdfViewUrl: "https://drive.google.com/file/d/1nqVV9mSn82gND3ldamNIZNydsLKYEy0o/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan sebuah pohon kecil yang ingin memahami dunia di sekitarnya. Ia belajar bahwa tumbuh besar tidak terjadi dalam satu hari, tetapi melalui hujan, matahari, angin, dan waktu.",
  "Dalam perjalanannya, pohon kecil bertemu perubahan dan tantangan. Setiap pengalaman membuatnya lebih kuat, lebih sabar, dan lebih percaya bahwa langkah kecil tetap berarti.",
  "Pesan utama cerita ini adalah keberanian untuk bertumbuh, kesabaran menghadapi proses, dan rasa syukur terhadap bantuan dari alam serta teman-teman di sekitar kita."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
