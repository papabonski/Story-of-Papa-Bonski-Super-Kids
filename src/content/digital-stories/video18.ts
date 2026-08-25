import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Zaid's Bright Ideas", "Andy the Ant and the Cozy Nest", "Ollie the Wise Orangutan", "The Helpful Hive"],
    answer: "Zaid's Bright Ideas",
  },
  {
    question: "Who is the main character?",
    options: ["Zaid", "Andy", "Ollie", "Draco"],
    answer: "Zaid",
  },
  {
    question: "How old is Zaid?",
    options: ["Six years old", "Three years old", "Ten years old", "Twelve years old"],
    answer: "Six years old",
  },
  {
    question: "Where did Zaid live?",
    options: ["In a modern city in Arabia", "In a jungle", "In a tiny anthill", "In a faraway dragon land"],
    answer: "In a modern city in Arabia",
  },
  {
    question: "What did Zaid love thinking about?",
    options: ["Big ideas", "Running races", "Sleeping late", "Lost puzzle pieces"],
    answer: "Big ideas",
  },
  {
    question: "Who did Zaid talk to one day?",
    options: ["His father and older brother", "His teacher and friends", "A bird and a bee", "A turtle and a koala"],
    answer: "His father and older brother",
  },
  {
    question: "What did Zaid want to make?",
    options: ["Things to help people around the world", "A toy only for himself", "A secret hiding place", "A race medal"],
    answer: "Things to help people around the world",
  },
  {
    question: "How did Zaid's father and brother respond?",
    options: ["They smiled", "They became angry", "They ignored him", "They ran away"],
    answer: "They smiled",
  },
  {
    question: "What did they say to Zaid?",
    options: ["That's a wonderful idea, Zaid!", "Stop dreaming, Zaid!", "Go to sleep, Zaid!", "Do not build anything!"],
    answer: "That's a wonderful idea, Zaid!",
  },
  {
    question: "What machine did Zaid decide to make?",
    options: ["A machine that could clean water", "A machine that could fly to the moon", "A machine that could make toys", "A machine that could paint walls"],
    answer: "A machine that could clean water",
  },
  {
    question: "Why did Zaid want clean water?",
    options: ["So everyone could have clean water to drink", "So he could win a race", "So he could hide his toys", "So flowers would disappear"],
    answer: "So everyone could have clean water to drink",
  },
  {
    question: "What did Zaid use to build a tiny model?",
    options: ["Colorful blocks", "River stones", "Leaves and twigs", "Sand and shells"],
    answer: "Colorful blocks",
  },
  {
    question: "Who did Zaid show his model to?",
    options: ["His father and brother", "A group of gnomes", "A butterfly", "A running team"],
    answer: "His father and brother",
  },
  {
    question: "What did Zaid say about his model?",
    options: ["This is for the world", "This is only for me", "This is too hard", "This is a secret"],
    answer: "This is for the world",
  },
  {
    question: "What did his father and brother do?",
    options: ["They clapped", "They cried sadly", "They hid the model", "They broke the blocks"],
    answer: "They clapped",
  },
  {
    question: "What did they say after seeing the model?",
    options: ["Good job, Zaid!", "Try again tomorrow", "This is boring", "Where is the nest?"],
    answer: "Good job, Zaid!",
  },
  {
    question: "What did Zaid know about himself?",
    options: ["He was just a little boy", "He was already an old inventor", "He could never learn", "He disliked ideas"],
    answer: "He was just a little boy",
  },
  {
    question: "What did Zaid dream of doing?",
    options: ["Making the world a better place", "Keeping every idea secret", "Never helping anyone", "Moving to a forest"],
    answer: "Making the world a better place",
  },
  {
    question: "What did Zaid believe?",
    options: ["One day he could help people everywhere", "Children cannot have ideas", "Only adults can invent", "Dreaming big is wrong"],
    answer: "One day he could help people everywhere",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Bright ideas can help the world", "Never share your ideas", "Small children cannot dream big", "Clean water is not important"],
    answer: "Bright ideas can help the world",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Zaid", "Zaid / nama anak", "zeɪd"],
  ["bright", "cerah / cemerlang", "braɪt"],
  ["ideas", "ide-ide", "aɪˈdiːəz"],
  ["modern", "modern", "ˈmɑːdərn"],
  ["city", "kota", "ˈsɪti"],
  ["Arabia", "Arabia", "əˈreɪbiə"],
  ["clever", "pintar", "ˈklevər"],
  ["boy", "anak laki-laki", "bɔɪ"],
  ["thinking", "berpikir", "ˈθɪŋkɪŋ"],
  ["father", "ayah", "ˈfɑːðər"],
  ["older", "lebih tua", "ˈoʊldər"],
  ["brother", "saudara laki-laki", "ˈbrʌðər"],
  ["make", "membuat", "meɪk"],
  ["things", "benda-benda / hal-hal", "θɪŋz"],
  ["help", "membantu", "help"],
  ["people", "orang-orang", "ˈpiːpl"],
  ["world", "dunia", "wɜːrld"],
  ["wonderful", "luar biasa", "ˈwʌndərfl"],
  ["thought", "berpikir", "θɔːt"],
  ["decided", "memutuskan", "dɪˈsaɪdɪd"],
  ["machine", "mesin", "məˈʃiːn"],
  ["clean", "bersih / membersihkan", "kliːn"],
  ["water", "air", "ˈwɔːtər"],
  ["drink", "minum", "drɪŋk"],
  ["colorful", "penuh warna", "ˈkʌlərfl"],
  ["blocks", "balok-balok", "blɑːks"],
  ["tiny", "kecil", "ˈtaɪni"],
  ["model", "model / contoh kecil", "ˈmɑːdl"],
  ["clapped", "bertepuk tangan", "klæpt"],
  ["inventions", "penemuan-penemuan", "ɪnˈvenʃənz"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I want to make things to help people.",
    meaning: "Aku ingin membuat hal-hal untuk membantu orang.",
    useCase: "Dipakai saat anak ingin menyampaikan cita-cita atau tujuan baik.",
    dialog: [
      {
        speaker: "Zaid",
        text: "I want to make things to help people.",
        translation: "Aku ingin membuat hal-hal untuk membantu orang.",
      },
      {
        speaker: "Father",
        text: "That is a wonderful idea, Zaid.",
        translation: "Itu ide yang luar biasa, Zaid.",
      },
    ],
    practicePrompt: "Latih cita-cita: I want to make things to help people.",
  },
  {
    expression: "That's a wonderful idea!",
    meaning: "Itu ide yang luar biasa!",
    useCase: "Dipakai untuk memuji ide baik dari seseorang.",
    dialog: [
      {
        speaker: "Brother",
        text: "That's a wonderful idea!",
        translation: "Itu ide yang luar biasa!",
      },
      {
        speaker: "Zaid",
        text: "Thank you. I will think hard.",
        translation: "Terima kasih. Aku akan berpikir keras.",
      },
    ],
    practicePrompt: "Latih pujian: That's a wonderful idea!",
  },
  {
    expression: "I have a bright idea.",
    meaning: "Aku punya ide cemerlang.",
    useCase: "Dipakai saat anak menemukan gagasan baru.",
    dialog: [
      {
        speaker: "Zaid",
        text: "I have a bright idea.",
        translation: "Aku punya ide cemerlang.",
      },
      {
        speaker: "Father",
        text: "Tell me about it.",
        translation: "Ceritakan kepadaku.",
      },
    ],
    practicePrompt: "Ajak anak melengkapi: I have a bright idea about...",
  },
  {
    expression: "I want everyone to have clean water.",
    meaning: "Aku ingin semua orang memiliki air bersih.",
    useCase: "Dipakai untuk menyatakan harapan yang bermanfaat untuk banyak orang.",
    dialog: [
      {
        speaker: "Zaid",
        text: "I want everyone to have clean water.",
        translation: "Aku ingin semua orang memiliki air bersih.",
      },
      {
        speaker: "Brother",
        text: "That can help the world.",
        translation: "Itu bisa membantu dunia.",
      },
    ],
    practicePrompt: "Latih kalimat harapan: I want everyone to...",
  },
  {
    expression: "This is for the world.",
    meaning: "Ini untuk dunia.",
    useCase: "Dipakai saat menunjukkan karya yang dibuat untuk membantu banyak orang.",
    dialog: [
      {
        speaker: "Zaid",
        text: "This is for the world.",
        translation: "Ini untuk dunia.",
      },
      {
        speaker: "Father",
        text: "Good job, Zaid!",
        translation: "Bagus sekali, Zaid!",
      },
    ],
    practicePrompt: "Latih presentasi kecil: This is for my family. This is for the world.",
  },
  {
    expression: "Good job, Zaid!",
    meaning: "Bagus sekali, Zaid!",
    useCase: "Dipakai untuk memberi apresiasi setelah seseorang mencoba atau berhasil.",
    dialog: [
      {
        speaker: "Father",
        text: "Good job, Zaid!",
        translation: "Bagus sekali, Zaid!",
      },
      {
        speaker: "Zaid",
        text: "Thank you. I will keep learning.",
        translation: "Terima kasih. Aku akan terus belajar.",
      },
    ],
    practicePrompt: "Latih apresiasi: Good job! Keep going!",
  },
  {
    expression: "I am just a little boy, but I can dream big.",
    meaning: "Aku hanya anak kecil, tetapi aku bisa bermimpi besar.",
    useCase: "Dipakai untuk membangun percaya diri pada anak.",
    dialog: [
      {
        speaker: "Zaid",
        text: "I am just a little boy, but I can dream big.",
        translation: "Aku hanya anak kecil, tetapi aku bisa bermimpi besar.",
      },
      {
        speaker: "Brother",
        text: "Yes, your ideas matter.",
        translation: "Ya, ide-idemu berarti.",
      },
    ],
    practicePrompt: "Ajak anak mengulang: I can dream big.",
  },
  {
    expression: "I want to make the world better.",
    meaning: "Aku ingin membuat dunia menjadi lebih baik.",
    useCase: "Dipakai untuk menyampaikan tujuan positif.",
    dialog: [
      {
        speaker: "Zaid",
        text: "I want to make the world better.",
        translation: "Aku ingin membuat dunia menjadi lebih baik.",
      },
      {
        speaker: "Father",
        text: "Start with one good idea.",
        translation: "Mulailah dengan satu ide baik.",
      },
    ],
    practicePrompt: "Latih tujuan: I want to make my class better.",
  },
  {
    expression: "One day, I can help people everywhere.",
    meaning: "Suatu hari, aku bisa membantu orang di mana-mana.",
    useCase: "Dipakai untuk menyampaikan impian masa depan.",
    dialog: [
      {
        speaker: "Zaid",
        text: "One day, I can help people everywhere.",
        translation: "Suatu hari, aku bisa membantu orang di mana-mana.",
      },
      {
        speaker: "Narrator",
        text: "Zaid believed in his inventions.",
        translation: "Zaid percaya pada penemuan-penemuannya.",
      },
    ],
    practicePrompt: "Latih masa depan: One day, I can...",
  },
  {
    expression: "Keep thinking, keep learning.",
    meaning: "Terus berpikir, terus belajar.",
    useCase: "Dipakai sebagai kalimat penyemangat saat belajar dan mencoba ide baru.",
    dialog: [
      {
        speaker: "Father",
        text: "Keep thinking, keep learning.",
        translation: "Terus berpikir, terus belajar.",
      },
      {
        speaker: "Zaid",
        text: "I will keep trying.",
        translation: "Aku akan terus mencoba.",
      },
    ],
    practicePrompt: "Jadikan chant belajar: Keep thinking, keep learning.",
  },
];

export const video18: DigitalStory = {
  id: "video18",
  number: 18,
  title: "Zaid's Bright Ideas",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Zaid's-Bright-Ideas.jpg",
  videoPreviewUrl: drivePreview("1q8pZykD7aZEnrQJgR3uDZMXBzGE3vVI3"),
  videoViewUrl: driveView("1q8pZykD7aZEnrQJgR3uDZMXBzGE3vVI3"),
  pdfPreviewUrl: drivePreview("1DPh8HBIi5SEHmzoVk_oPOmUbXxUzgLIH"),
  pdfViewUrl: "https://drive.google.com/file/d/1DPh8HBIi5SEHmzoVk_oPOmUbXxUzgLIH/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Zaid, anak laki-laki cerdas berusia enam tahun yang tinggal di kota modern di Arabia. Zaid sangat suka memikirkan ide-ide besar.",
    "Suatu hari, Zaid berkata kepada ayah dan kakak laki-lakinya bahwa ia ingin membuat sesuatu untuk membantu orang-orang di seluruh dunia. Ayah dan kakaknya tersenyum dan mengatakan bahwa itu adalah ide yang luar biasa.",
    "Zaid berpikir keras, lalu memutuskan untuk membuat mesin yang bisa membersihkan air. Ia ingin semua orang memiliki air bersih untuk diminum.",
    "Dengan balok-balok warna-warni, Zaid membuat model kecil mesin pembersih airnya. Ia menunjukkannya kepada ayah dan kakaknya sambil berkata bahwa karya itu untuk dunia. Mereka bertepuk tangan dan memuji Zaid.",
    "Zaid tahu dirinya masih anak kecil, tetapi ia berani bermimpi besar. Ia percaya bahwa suatu hari nanti, melalui ide-ide cemerlang dan penemuannya, ia bisa membantu banyak orang dan membuat dunia menjadi lebih baik.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
