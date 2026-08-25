import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What was Alex's big dream?",
    options: ["Flying in space", "Becoming a chef", "Building a castle", "Finding a lost puppy"],
    answer: "Flying in space",
  },
  {
    question: "What did Alex dream of wearing?",
    options: ["A cool space suit", "A red raincoat", "A pirate hat", "A school uniform"],
    answer: "A cool space suit",
  },
  {
    question: "What did Alex tell Dad in the morning?",
    options: ["I want to be an astronaut", "I want to sleep all day", "I lost my book", "I dislike the stars"],
    answer: "I want to be an astronaut",
  },
  {
    question: "What did Dad call Alex?",
    options: ["Champ", "Captain", "Professor", "Little star"],
    answer: "Champ",
  },
  {
    question: "What did Dad say Alex should learn about?",
    options: ["Space and work hard", "Cooking and painting", "Cars and roads", "Rain and wind"],
    answer: "Space and work hard",
  },
  {
    question: "What book did Alex read with Dad?",
    options: ["A book about space", "A book about koalas", "A book about puzzles", "A book about beaches"],
    answer: "A book about space",
  },
  {
    question: "What did Alex and Dad talk about?",
    options: ["Stars", "Buckets", "Compasses", "Toy cars"],
    answer: "Stars",
  },
  {
    question: "What did Alex do in school?",
    options: ["Listened in class and loved learning about space", "Slept at his desk", "Ignored the teacher", "Played on the beach"],
    answer: "Listened in class and loved learning about space",
  },
  {
    question: "What did Alex imagine at night?",
    options: ["Flying among the stars", "Sailing on a river", "Finding puzzle pieces", "Climbing eucalyptus trees"],
    answer: "Flying among the stars",
  },
  {
    question: "Who visited Alex's school?",
    options: ["An astronaut", "A koala keeper", "A ship captain", "A farmer"],
    answer: "An astronaut",
  },
  {
    question: "What did the astronaut say?",
    options: ["Work hard for your dreams", "Never study science", "Dreams are useless", "Space is boring"],
    answer: "Work hard for your dreams",
  },
  {
    question: "How did Alex feel after learning and dreaming?",
    options: ["He smiled", "He became angry", "He forgot his dream", "He felt bored"],
    answer: "He smiled",
  },
  {
    question: "What did Alex think learning and dreaming could do?",
    options: ["Make his dream come true", "Make him stop trying", "Make stars disappear", "Make school shorter"],
    answer: "Make his dream come true",
  },
  {
    question: "What kept Alex curious and happy?",
    options: ["Learning and asking questions", "Hiding from class", "Playing alone", "Giving up"],
    answer: "Learning and asking questions",
  },
  {
    question: "What did Alex know about reaching the stars?",
    options: ["Dreaming and learning were the ways", "He needed no effort", "He should stop reading", "He had to forget school"],
    answer: "Dreaming and learning were the ways",
  },
  {
    question: "Which word means astronot?",
    options: ["Astronaut", "Space suit", "Dream", "Class"],
    answer: "Astronaut",
  },
  {
    question: "Which word means bintang-bintang?",
    options: ["Stars", "Books", "Questions", "Dreams"],
    answer: "Stars",
  },
  {
    question: "Which word means belajar?",
    options: ["Learning", "Wearing", "Flying", "Smiling"],
    answer: "Learning",
  },
  {
    question: "What kind of attitude does Alex show?",
    options: ["Curious and hardworking", "Lazy and mean", "Careless and angry", "Afraid of learning"],
    answer: "Curious and hardworking",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Big dreams need learning, curiosity, and hard work", "Dreams come true without effort", "Space is only for adults", "Children should not ask questions"],
    answer: "Big dreams need learning, curiosity, and hard work",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["dream", "mimpi / cita-cita", "driːm"],
  ["space", "angkasa", "speɪs"],
  ["space suit", "baju astronaut", "speɪs suːt"],
  ["astronaut", "astronot", "ˈæstrənɔːt"],
  ["excited", "bersemangat", "ɪkˈsaɪtɪd"],
  ["woke up", "bangun", "woʊk ʌp"],
  ["dad", "ayah", "dæd"],
  ["champ", "juara / anak hebat", "tʃæmp"],
  ["learn", "belajar", "lɜːrn"],
  ["work hard", "bekerja keras", "wɜːrk hɑːrd"],
  ["asked", "bertanya", "æskt"],
  ["book", "buku", "bʊk"],
  ["stars", "bintang-bintang", "stɑːrz"],
  ["school", "sekolah", "skuːl"],
  ["class", "kelas", "klæs"],
  ["listened", "mendengarkan", "ˈlɪsnd"],
  ["learning", "belajar", "ˈlɜːrnɪŋ"],
  ["night", "malam", "naɪt"],
  ["imagined", "membayangkan", "ɪˈmædʒɪnd"],
  ["flying", "terbang", "ˈflaɪɪŋ"],
  ["visited", "mengunjungi", "ˈvɪzɪtɪd"],
  ["science", "sains / ilmu pengetahuan", "ˈsaɪəns"],
  ["smiled", "tersenyum", "smaɪld"],
  ["come true", "menjadi kenyataan", "kʌm truː"],
  ["curious", "penasaran", "ˈkjʊriəs"],
  ["happy", "bahagia", "ˈhæpi"],
  ["questions", "pertanyaan", "ˈkwestʃənz"],
  ["reach", "mencapai", "riːtʃ"],
  ["dreaming", "bermimpi", "ˈdriːmɪŋ"],
  ["ways", "cara-cara", "weɪz"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I have a dream.",
    meaning: "Aku punya impian.",
    useCase: "Dipakai saat anak ingin menceritakan cita-cita atau harapan besar.",
    dialog: [
      {
        speaker: "Alex",
        text: "I have a dream. I want to go to space.",
        translation: "Aku punya impian. Aku ingin pergi ke luar angkasa.",
      },
      {
        speaker: "Dad",
        text: "That is a wonderful dream, Alex.",
        translation: "Itu impian yang luar biasa, Alex.",
      },
    ],
    practicePrompt: "Ajak anak melengkapi kalimat: I have a dream. I want to...",
  },
  {
    expression: "I want to be...",
    meaning: "Aku ingin menjadi...",
    useCase: "Dipakai untuk menyebut cita-cita atau profesi impian.",
    dialog: [
      {
        speaker: "Alex",
        text: "I want to be an astronaut one day.",
        translation: "Aku ingin menjadi astronaut suatu hari nanti.",
      },
      {
        speaker: "Dad",
        text: "Then you can learn about space and work hard.",
        translation: "Kalau begitu kamu bisa belajar tentang ruang angkasa dan bekerja keras.",
      },
    ],
    practicePrompt: "Latih profesi lain: I want to be a teacher. I want to be a doctor.",
  },
  {
    expression: "Tell me about...",
    meaning: "Ceritakan padaku tentang...",
    useCase: "Dipakai saat anak ingin meminta penjelasan atau cerita.",
    dialog: [
      {
        speaker: "Alex",
        text: "Tell me about stars and planets, Dad.",
        translation: "Ceritakan padaku tentang bintang dan planet, Ayah.",
      },
      {
        speaker: "Dad",
        text: "Stars are far away, and planets move around the sun.",
        translation: "Bintang sangat jauh, dan planet bergerak mengelilingi matahari.",
      },
    ],
    practicePrompt: "Latih bertanya: Tell me about the moon. Tell me about rockets.",
  },
  {
    expression: "Keep learning.",
    meaning: "Teruslah belajar.",
    useCase: "Dipakai untuk memberi motivasi agar anak tidak berhenti belajar.",
    dialog: [
      {
        speaker: "Dad",
        text: "Keep learning, Alex. Dreams need practice.",
        translation: "Teruslah belajar, Alex. Impian membutuhkan latihan.",
      },
      {
        speaker: "Alex",
        text: "I will read more books about space.",
        translation: "Aku akan membaca lebih banyak buku tentang luar angkasa.",
      },
    ],
    practicePrompt: "Gunakan saat belajar: Keep learning. You are getting better.",
  },
  {
    expression: "Ask good questions.",
    meaning: "Ajukan pertanyaan yang baik.",
    useCase: "Dipakai untuk mendorong rasa ingin tahu anak.",
    dialog: [
      {
        speaker: "Teacher",
        text: "Ask good questions when you learn about space.",
        translation: "Ajukan pertanyaan yang baik saat belajar tentang ruang angkasa.",
      },
      {
        speaker: "Alex",
        text: "How do rockets fly so high?",
        translation: "Bagaimana roket bisa terbang sangat tinggi?",
      },
    ],
    practicePrompt: "Minta anak membuat satu pertanyaan dimulai dengan how, why, atau what.",
  },
  {
    expression: "Work hard for your dream.",
    meaning: "Bekerja keraslah untuk impianmu.",
    useCase: "Dipakai untuk menyemangati anak mengejar cita-cita.",
    dialog: [
      {
        speaker: "Astronaut",
        text: "Work hard for your dream, Alex.",
        translation: "Bekerja keraslah untuk impianmu, Alex.",
      },
      {
        speaker: "Alex",
        text: "I will study, practice, and never stop trying.",
        translation: "Aku akan belajar, berlatih, dan tidak berhenti mencoba.",
      },
    ],
    practicePrompt: "Latih kalimat motivasi: Work hard for your dream. You can do it.",
  },
  {
    expression: "My dream can come true.",
    meaning: "Impianku bisa menjadi kenyataan.",
    useCase: "Dipakai untuk membangun keyakinan dan harapan.",
    dialog: [
      {
        speaker: "Alex",
        text: "If I keep learning, my dream can come true.",
        translation: "Jika aku terus belajar, impianku bisa menjadi kenyataan.",
      },
      {
        speaker: "Dad",
        text: "Yes, small steps can lead to big dreams.",
        translation: "Ya, langkah kecil bisa menuju impian besar.",
      },
    ],
    practicePrompt: "Ajak anak mengulang: My dream can come true.",
  },
  {
    expression: "Look at the stars.",
    meaning: "Lihatlah bintang-bintang.",
    useCase: "Dipakai saat mengajak seseorang memperhatikan langit malam.",
    dialog: [
      {
        speaker: "Alex",
        text: "Look at the stars. They shine so brightly.",
        translation: "Lihatlah bintang-bintang. Mereka bersinar sangat terang.",
      },
      {
        speaker: "Dad",
        text: "They remind us to keep dreaming.",
        translation: "Mereka mengingatkan kita untuk terus bermimpi.",
      },
    ],
    practicePrompt: "Gunakan saat melihat gambar langit: Look at the stars. What can you see?",
  },
  {
    expression: "I am curious about...",
    meaning: "Aku penasaran tentang...",
    useCase: "Dipakai untuk menunjukkan rasa ingin tahu.",
    dialog: [
      {
        speaker: "Alex",
        text: "I am curious about rockets and the moon.",
        translation: "Aku penasaran tentang roket dan bulan.",
      },
      {
        speaker: "Teacher",
        text: "Curiosity is a great start for learning.",
        translation: "Rasa ingin tahu adalah awal yang bagus untuk belajar.",
      },
    ],
    practicePrompt: "Latih pola: I am curious about animals. I am curious about science.",
  },
  {
    expression: "Reach for the stars.",
    meaning: "Raihlah bintang-bintang / kejarlah impian setinggi mungkin.",
    useCase: "Dipakai sebagai ungkapan motivasi untuk bermimpi besar.",
    dialog: [
      {
        speaker: "Astronaut",
        text: "Reach for the stars, Alex.",
        translation: "Raihlah bintang-bintang, Alex.",
      },
      {
        speaker: "Alex",
        text: "I will keep dreaming and learning.",
        translation: "Aku akan terus bermimpi dan belajar.",
      },
    ],
    practicePrompt: "Jadikan closing chant: Reach for the stars! Keep learning!",
  },
];


export const video8: DigitalStory = {
  id: "video8",
  number: 8,
  title: "Alex's Big Dream",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Alex's-Big-Dream.jpg",
  videoPreviewUrl: drivePreview("1v4s5CD4ctEbqmXfdHhEAf28eab6gEA84"),
  videoViewUrl: driveView("1v4s5CD4ctEbqmXfdHhEAf28eab6gEA84"),
  pdfPreviewUrl: drivePreview("18ZhL_X4EeSyzFF4EWpbaZ719mmT6qkpJ"),
  pdfViewUrl: "https://drive.google.com/file/d/18ZhL_X4EeSyzFF4EWpbaZ719mmT6qkpJ/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan Alex, seorang anak yang bermimpi besar untuk terbang ke angkasa dengan memakai baju astronaut. Ia bangun dengan semangat dan menceritakan cita-citanya kepada ayahnya.",
  "Ayah Alex mendukung impian itu dan mengingatkannya bahwa ia perlu belajar tentang ruang angkasa serta bekerja keras. Alex pun membaca buku tentang bintang bersama ayahnya.",
  "Di sekolah, Alex mendengarkan pelajaran dengan baik dan senang belajar tentang luar angkasa. Pada malam hari, ia memandang bintang dan membayangkan dirinya terbang di antara mereka.",
  "Ketika seorang astronaut datang ke sekolah, Alex semakin yakin bahwa belajar, bertanya, bermimpi, dan bekerja keras adalah jalan untuk meraih cita-cita. Cerita ini mengajarkan anak agar tetap penasaran dan tekun mengejar impian."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
