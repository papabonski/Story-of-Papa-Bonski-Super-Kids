import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "Where did Ken live?",
    options: ["In Kenya", "In Japan", "In Canada", "In Brazil"],
    answer: "In Kenya",
  },
  {
    question: "What did Ken love doing?",
    options: ["Running", "Painting", "Cooking", "Sailing"],
    answer: "Running",
  },
  {
    question: "What was Ken's dream?",
    options: ["To be the best runner in the world", "To become an astronaut", "To build a castle", "To find a magic puzzle"],
    answer: "To be the best runner in the world",
  },
  {
    question: "How often did Ken try hard?",
    options: ["Every day", "Once a year", "Only on Sundays", "Never"],
    answer: "Every day",
  },
  {
    question: "Where did Ken run around in his village?",
    options: ["In the fields and on the roads", "Inside a library", "Under the sea", "On a snowy hill"],
    answer: "In the fields and on the roads",
  },
  {
    question: "What could people see on Ken's face?",
    options: ["Hope", "Anger", "Fear", "Sleepiness"],
    answer: "Hope",
  },
  {
    question: "What could people see in Ken's heart?",
    options: ["Joy", "Greed", "Loneliness", "Confusion"],
    answer: "Joy",
  },
  {
    question: "How did Ken go to school and back?",
    options: ["By running", "By boat", "By train", "By airplane"],
    answer: "By running",
  },
  {
    question: "What did Ken's friends cheer for him?",
    options: ["Ken! Ken!", "Alex! Alex!", "Run away!", "Stop now!"],
    answer: "Ken! Ken!",
  },
  {
    question: "What did Ken do at school?",
    options: ["Listened in class and learned many things", "Slept all day", "Ignored the teacher", "Played only with toys"],
    answer: "Listened in class and learned many things",
  },
  {
    question: "What did Ken like?",
    options: ["Learning and running", "Hiding and shouting", "Sleeping and waiting", "Arguing and racing cars"],
    answer: "Learning and running",
  },
  {
    question: "What did Ken do after school?",
    options: ["Trained more", "Went fishing", "Watched TV all day", "Stopped practicing"],
    answer: "Trained more",
  },
  {
    question: "How did Ken feel after training?",
    options: ["Stronger each day", "Weaker each day", "Less hopeful", "Very angry"],
    answer: "Stronger each day",
  },
  {
    question: "What did Ken's dream say about running?",
    options: ["Run like the wind and never be afraid", "Never run again", "Running is not important", "Only run at night"],
    answer: "Run like the wind and never be afraid",
  },
  {
    question: "What happened one day in Ken's village?",
    options: ["There was a big race", "There was a space lesson", "There was a beach party", "There was a puzzle contest"],
    answer: "There was a big race",
  },
  {
    question: "What happened during the race?",
    options: ["Ken ran faster than he ever had before", "Ken stopped at the start", "Ken forgot how to run", "Ken went home"],
    answer: "Ken ran faster than he ever had before",
  },
  {
    question: "What did Ken cross first?",
    options: ["The finish line", "A river", "A bridge", "A classroom door"],
    answer: "The finish line",
  },
  {
    question: "What did everyone do after Ken won?",
    options: ["Clapped and cheered", "Went silent", "Became sad", "Hid the medal"],
    answer: "Clapped and cheered",
  },
  {
    question: "Which word means pelari?",
    options: ["Runner", "Village", "Field", "Class"],
    answer: "Runner",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Hard work and joy can make dreams come true", "Dreams happen without practice", "School is not useful", "Races are only about luck"],
    answer: "Hard work and joy can make dreams come true",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Kenya", "Kenya", "ˈkenjə"],
  ["village", "desa", "ˈvɪlɪdʒ"],
  ["running", "berlari", "ˈrʌnɪŋ"],
  ["dream", "mimpi / cita-cita", "driːm"],
  ["runner", "pelari", "ˈrʌnər"],
  ["world", "dunia", "wɜːrld"],
  ["tried", "berusaha", "traɪd"],
  ["hard", "keras / sungguh-sungguh", "hɑːrd"],
  ["happy", "bahagia", "ˈhæpi"],
  ["fields", "ladang", "fiːldz"],
  ["roads", "jalan-jalan", "roʊdz"],
  ["hope", "harapan", "hoʊp"],
  ["heart", "hati", "hɑːrt"],
  ["school", "sekolah", "skuːl"],
  ["cheered", "bersorak", "tʃɪrd"],
  ["class", "kelas", "klæs"],
  ["listened", "mendengarkan", "ˈlɪsnd"],
  ["learning", "belajar", "ˈlɜːrnɪŋ"],
  ["trained", "berlatih", "treɪnd"],
  ["stronger", "lebih kuat", "ˈstrɔːŋɡər"],
  ["wind", "angin", "wɪnd"],
  ["afraid", "takut", "əˈfreɪd"],
  ["race", "perlombaan", "reɪs"],
  ["faster", "lebih cepat", "ˈfæstər"],
  ["finish line", "garis akhir", "ˈfɪnɪʃ laɪn"],
  ["clapped", "bertepuk tangan", "klæpt"],
  ["medal", "medali", "ˈmedl"],
  ["chasing", "mengejar", "ˈtʃeɪsɪŋ"],
  ["steps", "langkah-langkah", "steps"],
  ["come true", "menjadi kenyataan", "kʌm truː"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I love running.",
    meaning: "Aku suka berlari.",
    useCase: "Dipakai saat anak ingin menyatakan aktivitas yang ia sukai.",
    dialog: [
      {
        speaker: "Ken",
        text: "I love running through my village.",
        translation: "Aku suka berlari melewati desaku.",
      },
      {
        speaker: "Friend",
        text: "You always run with a big smile.",
        translation: "Kamu selalu berlari dengan senyum besar.",
      },
    ],
    practicePrompt: "Latih hobi lain: I love reading. I love drawing. I love swimming.",
  },
  {
    expression: "I want to be the best.",
    meaning: "Aku ingin menjadi yang terbaik.",
    useCase: "Dipakai untuk menyampaikan target atau cita-cita.",
    dialog: [
      {
        speaker: "Ken",
        text: "I want to be the best runner in the world.",
        translation: "Aku ingin menjadi pelari terbaik di dunia.",
      },
      {
        speaker: "Coach",
        text: "Then train with joy and discipline.",
        translation: "Kalau begitu berlatihlah dengan gembira dan disiplin.",
      },
    ],
    practicePrompt: "Ajak anak membuat target: I want to be good at...",
  },
  {
    expression: "Keep going!",
    meaning: "Teruskan!",
    useCase: "Dipakai untuk menyemangati teman agar tidak berhenti.",
    dialog: [
      {
        speaker: "Friends",
        text: "Keep going, Ken! You can do it!",
        translation: "Teruskan, Ken! Kamu bisa!",
      },
      {
        speaker: "Ken",
        text: "Thank you! Your cheers give me energy.",
        translation: "Terima kasih! Sorakan kalian memberiku energi.",
      },
    ],
    practicePrompt: "Role-play lomba kecil: satu anak berlari, teman berkata 'Keep going!'",
  },
  {
    expression: "Run like the wind.",
    meaning: "Berlari seperti angin.",
    useCase: "Dipakai sebagai ungkapan semangat untuk berlari cepat.",
    dialog: [
      {
        speaker: "Coach",
        text: "Run like the wind, but keep your steps steady.",
        translation: "Berlari seperti angin, tetapi jaga langkahmu tetap stabil.",
      },
      {
        speaker: "Ken",
        text: "I will run fast and stay focused.",
        translation: "Aku akan berlari cepat dan tetap fokus.",
      },
    ],
    practicePrompt: "Latih sebagai chant: Run like the wind! Stay focused!",
  },
  {
    expression: "I am getting stronger.",
    meaning: "Aku menjadi lebih kuat.",
    useCase: "Dipakai untuk menyatakan perkembangan setelah latihan.",
    dialog: [
      {
        speaker: "Ken",
        text: "I train every day, and I am getting stronger.",
        translation: "Aku berlatih setiap hari, dan aku menjadi lebih kuat.",
      },
      {
        speaker: "Teacher",
        text: "Your hard work is helping you grow.",
        translation: "Kerja kerasmu membantumu bertumbuh.",
      },
    ],
    practicePrompt: "Gunakan setelah latihan: I am getting better. I am getting stronger.",
  },
  {
    expression: "Do not be afraid.",
    meaning: "Jangan takut.",
    useCase: "Dipakai untuk memberi keberanian sebelum mencoba tantangan.",
    dialog: [
      {
        speaker: "Ken",
        text: "The big race makes me nervous.",
        translation: "Lomba besar ini membuatku gugup.",
      },
      {
        speaker: "Friend",
        text: "Do not be afraid. Just do your best.",
        translation: "Jangan takut. Lakukan yang terbaik.",
      },
    ],
    practicePrompt: "Latih kalimat lengkap: Do not be afraid. Just try your best.",
  },
  {
    expression: "I will do my best.",
    meaning: "Aku akan melakukan yang terbaik.",
    useCase: "Dipakai sebelum lomba, ujian, atau kegiatan penting.",
    dialog: [
      {
        speaker: "Coach",
        text: "Are you ready for the race?",
        translation: "Apakah kamu siap untuk lomba?",
      },
      {
        speaker: "Ken",
        text: "Yes. I will do my best.",
        translation: "Ya. Aku akan melakukan yang terbaik.",
      },
    ],
    practicePrompt: "Gunakan sebelum belajar: I will do my best today.",
  },
  {
    expression: "You crossed the finish line!",
    meaning: "Kamu melewati garis akhir!",
    useCase: "Dipakai saat merayakan seseorang yang menyelesaikan lomba atau tugas.",
    dialog: [
      {
        speaker: "Crowd",
        text: "You crossed the finish line first!",
        translation: "Kamu melewati garis akhir pertama!",
      },
      {
        speaker: "Ken",
        text: "I did it! Thank you for cheering.",
        translation: "Aku berhasil! Terima kasih sudah menyemangati.",
      },
    ],
    practicePrompt: "Latih setelah menyelesaikan aktivitas: You crossed the finish line!",
  },
  {
    expression: "Hard work pays off.",
    meaning: "Kerja keras membuahkan hasil.",
    useCase: "Dipakai untuk menyimpulkan hasil dari latihan dan ketekunan.",
    dialog: [
      {
        speaker: "Teacher",
        text: "You practiced every day. Hard work pays off.",
        translation: "Kamu berlatih setiap hari. Kerja keras membuahkan hasil.",
      },
      {
        speaker: "Ken",
        text: "Now I know that practice matters.",
        translation: "Sekarang aku tahu bahwa latihan itu penting.",
      },
    ],
    practicePrompt: "Diskusikan contoh: Hard work pays off in reading, sports, and school.",
  },
  {
    expression: "Chase your dream.",
    meaning: "Kejarlah impianmu.",
    useCase: "Dipakai sebagai ungkapan motivasi untuk terus berusaha.",
    dialog: [
      {
        speaker: "Coach",
        text: "Chase your dream with every step.",
        translation: "Kejarlah impianmu dengan setiap langkah.",
      },
      {
        speaker: "Ken",
        text: "I will keep running and learning.",
        translation: "Aku akan terus berlari dan belajar.",
      },
    ],
    practicePrompt: "Jadikan closing chant: Chase your dream. Keep going.",
  },
];


export const video9: DigitalStory = {
  id: "video9",
  number: 9,
  title: "Ken's Running Dream",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Ken's-Running-Dream.jpg",
  videoPreviewUrl: drivePreview("1vPsczoqZ8SF71VJPhSwA0xUkMU8i_71i"),
  videoViewUrl: driveView("1vPsczoqZ8SF71VJPhSwA0xUkMU8i_71i"),
  pdfPreviewUrl: drivePreview("1uefyyZa7cXtgVCHZqjqhfGd2CHVLxqMR"),
  pdfViewUrl: "https://drive.google.com/file/d/1uefyyZa7cXtgVCHZqjqhfGd2CHVLxqMR/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan Ken, seorang anak laki-laki kecil dari Kenya yang sangat suka berlari. Ia memiliki impian besar untuk menjadi pelari terbaik di dunia dan berlatih dengan bahagia setiap hari.",
  "Ken berlari mengelilingi desanya, melewati ladang dan jalanan, dengan harapan di wajahnya dan kegembiraan di hatinya. Ia juga berlari ke sekolah dan pulang, sementara teman-temannya menyemangatinya.",
  "Di sekolah, Ken tetap mendengarkan pelajaran dan belajar banyak hal. Setelah sekolah ia terus berlatih, merasa semakin kuat, dan percaya bahwa ia bisa berlari seperti angin tanpa rasa takut.",
  "Saat lomba besar di desa, Ken berlari lebih cepat dari sebelumnya dan melewati garis akhir pertama. Cerita ini mengajarkan bahwa kerja keras, semangat belajar, kegembiraan, dan ketekunan dapat membuat impian menjadi nyata."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
