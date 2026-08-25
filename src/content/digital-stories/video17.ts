import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "What is the title of the story?",
    options: ["Andy the Ant and the Cozy Nest", "Ollie the Wise Orangutan", "Polly the Peacock's Big Heart", "Draco's Kind Wings"],
    answer: "Andy the Ant and the Cozy Nest",
  },
  {
    question: "Who is the main character?",
    options: ["Andy", "Ollie", "Polly", "Buzz"],
    answer: "Andy",
  },
  {
    question: "What kind of animal is Andy?",
    options: ["An ant", "An orangutan", "A peacock", "A dragon"],
    answer: "An ant",
  },
  {
    question: "Where did Andy live?",
    options: ["In a tiny anthill", "In a faraway castle", "In a classroom", "On a beach"],
    answer: "In a tiny anthill",
  },
  {
    question: "What did Andy love?",
    options: ["Adventures", "Sleeping all day", "Running races", "Flying high"],
    answer: "Adventures",
  },
  {
    question: "What did Andy carry on adventures?",
    options: ["Big leaves and tiny seeds", "A red compass", "A golden medal", "A broken kite"],
    answer: "Big leaves and tiny seeds",
  },
  {
    question: "Who did Andy see one sunny morning?",
    options: ["His ant family", "A lost dragon", "A baby owl", "A turtle grandpa"],
    answer: "His ant family",
  },
  {
    question: "What were the ants trying to build?",
    options: ["A cozy nest", "A river bridge", "A spaceship", "A toy shop"],
    answer: "A cozy nest",
  },
  {
    question: "What did the ants march to find?",
    options: ["Soft leaves, twigs, and tiny pebbles", "Books, pens, and bags", "Shells and sand", "Stars and planets"],
    answer: "Soft leaves, twigs, and tiny pebbles",
  },
  {
    question: "How did the ants work?",
    options: ["Happily side by side", "Alone and angry", "Slowly without helping", "Only at night"],
    answer: "Happily side by side",
  },
  {
    question: "What did Andy carry?",
    options: ["Leaves", "A boat", "A telescope", "A honey jar"],
    answer: "Leaves",
  },
  {
    question: "What did Andy's friends do with the leaves?",
    options: ["Stacked them high", "Threw them away", "Painted them blue", "Hid them in a cave"],
    answer: "Stacked them high",
  },
  {
    question: "What did other ants arrange?",
    options: ["Pebbles in a shiny circle", "Shoes in a line", "Books on a table", "Clouds in the sky"],
    answer: "Pebbles in a shiny circle",
  },
  {
    question: "What did Andy cheer?",
    options: ["Together we can build anything!", "I want to work alone!", "The nest is too small!", "Let's stop now!"],
    answer: "Together we can build anything!",
  },
  {
    question: "How did the nest feel after the ants worked?",
    options: ["Warm and cozy", "Cold and empty", "Wet and noisy", "Dark and scary"],
    answer: "Warm and cozy",
  },
  {
    question: "What happened when the cold winds blew?",
    options: ["The ants huddled together inside", "The ants ran away forever", "The nest disappeared", "Andy went swimming"],
    answer: "The ants huddled together inside",
  },
  {
    question: "How did the ants feel inside the nest?",
    options: ["Warm and happy", "Lost and worried", "Angry and hungry", "Sleepy and sad"],
    answer: "Warm and happy",
  },
  {
    question: "What did Andy learn?",
    options: ["Friends working together can build something amazing", "No one should help friends", "Small ants cannot do anything", "Cozy nests are not useful"],
    answer: "Friends working together can build something amazing",
  },
  {
    question: "What made the nest special?",
    options: ["Teamwork", "Magic alone", "A loud song", "A shiny crown"],
    answer: "Teamwork",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Together, even small helpers can do great things", "Work alone and never share", "Only big animals can build homes", "Adventures are always bad"],
    answer: "Together, even small helpers can do great things",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Andy", "Andy / nama semut", "ˈændi"],
  ["ant", "semut", "ænt"],
  ["cozy", "nyaman / hangat", "ˈkoʊzi"],
  ["nest", "sarang", "nest"],
  ["anthill", "sarang semut / bukit semut", "ˈænthɪl"],
  ["tiny", "sangat kecil", "ˈtaɪni"],
  ["adventures", "petualangan", "ədˈventʃərz"],
  ["carrying", "membawa", "ˈkæriɪŋ"],
  ["leaves", "daun-daun", "liːvz"],
  ["seeds", "biji-biji", "siːdz"],
  ["sunny", "cerah", "ˈsʌni"],
  ["morning", "pagi", "ˈmɔːrnɪŋ"],
  ["family", "keluarga", "ˈfæməli"],
  ["hurrying", "bergegas", "ˈhɜːriɪŋ"],
  ["build", "membangun", "bɪld"],
  ["marched", "berbaris / berjalan bersama", "mɑːrtʃt"],
  ["soft", "lembut", "sɔːft"],
  ["twigs", "ranting-ranting kecil", "twɪɡz"],
  ["pebbles", "kerikil-kerikil", "ˈpebəlz"],
  ["worked", "bekerja", "wɜːrkt"],
  ["happily", "dengan gembira", "ˈhæpɪli"],
  ["side", "sisi", "saɪd"],
  ["stacked", "menumpuk", "stækt"],
  ["gathered", "mengumpulkan", "ˈɡæðərd"],
  ["arranged", "menata", "əˈreɪndʒd"],
  ["circle", "lingkaran", "ˈsɜːrkl"],
  ["together", "bersama-sama", "təˈɡeðər"],
  ["warm", "hangat", "wɔːrm"],
  ["huddled", "berkumpul rapat", "ˈhʌdəld"],
  ["teamwork", "kerja sama", "ˈtiːmwɜːrk"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "Let's work together.",
    meaning: "Ayo bekerja sama.",
    useCase: "Dipakai saat mengajak teman menyelesaikan tugas bersama.",
    dialog: [
      {
        speaker: "Andy",
        text: "Let's work together.",
        translation: "Ayo bekerja sama.",
      },
      {
        speaker: "Ants",
        text: "Yes! We can build a cozy nest.",
        translation: "Ya! Kita bisa membangun sarang yang nyaman.",
      },
    ],
    practicePrompt: "Latih ajakan: Let's work together.",
  },
  {
    expression: "I can carry the leaves.",
    meaning: "Aku bisa membawa daun-daun.",
    useCase: "Dipakai untuk menawarkan peran atau tugas yang bisa dilakukan.",
    dialog: [
      {
        speaker: "Andy",
        text: "I can carry the leaves.",
        translation: "Aku bisa membawa daun-daun.",
      },
      {
        speaker: "Friend",
        text: "Great! I will stack them high.",
        translation: "Bagus! Aku akan menumpuknya tinggi.",
      },
    ],
    practicePrompt: "Ganti tugas: I can carry the bag. I can clean the table.",
  },
  {
    expression: "What can I do?",
    meaning: "Apa yang bisa aku lakukan?",
    useCase: "Dipakai saat ingin bertanya tugas apa yang bisa dibantu.",
    dialog: [
      {
        speaker: "Andy",
        text: "What can I do?",
        translation: "Apa yang bisa aku lakukan?",
      },
      {
        speaker: "Ant",
        text: "You can bring soft leaves.",
        translation: "Kamu bisa membawa daun-daun lembut.",
      },
    ],
    practicePrompt: "Latih saat kerja kelompok: What can I do?",
  },
  {
    expression: "Every job is important.",
    meaning: "Setiap tugas itu penting.",
    useCase: "Dipakai untuk menghargai semua peran dalam kerja sama.",
    dialog: [
      {
        speaker: "Andy",
        text: "Every job is important.",
        translation: "Setiap tugas itu penting.",
      },
      {
        speaker: "Ants",
        text: "We all help in different ways.",
        translation: "Kita semua membantu dengan cara yang berbeda.",
      },
    ],
    practicePrompt: "Diskusikan: tugas kecil apa yang penting di rumah?",
  },
  {
    expression: "Together we can build anything!",
    meaning: "Bersama-sama kita bisa membangun apa saja!",
    useCase: "Dipakai untuk menyemangati teman saat bekerja sama.",
    dialog: [
      {
        speaker: "Andy",
        text: "Together we can build anything!",
        translation: "Bersama-sama kita bisa membangun apa saja!",
      },
      {
        speaker: "Ants",
        text: "Let's keep going!",
        translation: "Ayo teruskan!",
      },
    ],
    practicePrompt: "Ajak anak mengulang dengan semangat.",
  },
  {
    expression: "Let's keep going.",
    meaning: "Ayo teruskan.",
    useCase: "Dipakai untuk memberi semangat agar tidak berhenti di tengah tugas.",
    dialog: [
      {
        speaker: "Ant",
        text: "Let's keep going.",
        translation: "Ayo teruskan.",
      },
      {
        speaker: "Andy",
        text: "Our nest is getting warmer.",
        translation: "Sarang kita menjadi semakin hangat.",
      },
    ],
    practicePrompt: "Latih motivasi: Let's keep going.",
  },
  {
    expression: "Our nest is warm and cozy.",
    meaning: "Sarang kita hangat dan nyaman.",
    useCase: "Dipakai untuk menggambarkan rumah atau tempat yang terasa aman.",
    dialog: [
      {
        speaker: "Andy",
        text: "Our nest is warm and cozy.",
        translation: "Sarang kita hangat dan nyaman.",
      },
      {
        speaker: "Friend",
        text: "I feel happy inside.",
        translation: "Aku merasa bahagia di dalam.",
      },
    ],
    practicePrompt: "Latih deskripsi: My room is warm and cozy.",
  },
  {
    expression: "Come inside.",
    meaning: "Masuklah ke dalam.",
    useCase: "Dipakai saat mengajak teman masuk ke tempat yang aman.",
    dialog: [
      {
        speaker: "Andy",
        text: "Come inside. The wind is cold.",
        translation: "Masuklah ke dalam. Anginnya dingin.",
      },
      {
        speaker: "Ants",
        text: "Thank you, Andy.",
        translation: "Terima kasih, Andy.",
      },
    ],
    practicePrompt: "Latih undangan sederhana: Come inside.",
  },
  {
    expression: "We are safe together.",
    meaning: "Kita aman bersama.",
    useCase: "Dipakai untuk menenangkan teman dalam situasi tidak nyaman.",
    dialog: [
      {
        speaker: "Andy",
        text: "We are safe together.",
        translation: "Kita aman bersama.",
      },
      {
        speaker: "Ants",
        text: "We feel warm and happy.",
        translation: "Kami merasa hangat dan bahagia.",
      },
    ],
    practicePrompt: "Ajak anak mengulang: We are safe together.",
  },
  {
    expression: "Small helpers can do great things.",
    meaning: "Penolong kecil bisa melakukan hal besar.",
    useCase: "Dipakai untuk menyimpulkan pesan moral cerita.",
    dialog: [
      {
        speaker: "Andy",
        text: "Small helpers can do great things.",
        translation: "Penolong kecil bisa melakukan hal besar.",
      },
      {
        speaker: "Narrator",
        text: "The ants smiled in their cozy nest.",
        translation: "Para semut tersenyum di sarang nyaman mereka.",
      },
    ],
    practicePrompt: "Diskusikan contoh bantuan kecil yang berdampak besar.",
  },
];

export const video17: DigitalStory = {
  id: "video17",
  number: 17,
  title: "Andy the Ant and the Cozy Nest",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Andy-the-Ant-and-the-Cozy-Nest.jpg",
  videoPreviewUrl: drivePreview("1DFE9g5-63LjpK-Mxvd9mQutRafNf9TTy"),
  videoViewUrl: driveView("1DFE9g5-63LjpK-Mxvd9mQutRafNf9TTy"),
  pdfPreviewUrl: drivePreview("1A99f5FHGPyhYBO9vD1ggO_7nT-y-FN4p"),
  pdfViewUrl: "https://drive.google.com/file/d/1A99f5FHGPyhYBO9vD1ggO_7nT-y-FN4p/view?usp=sharing",
  summary: [
    "Cerita ini mengisahkan Andy, seekor semut kecil yang tinggal di sarang semut mungil. Berbeda dari semut lain, Andy sangat suka berpetualang sambil membawa daun besar dan biji-biji kecil.",
    "Suatu pagi yang cerah, Andy melihat keluarga semutnya sedang sibuk membangun sarang yang nyaman. Mereka berbaris mencari daun lembut, ranting kecil, dan kerikil mungil, lalu bekerja bahagia berdampingan.",
    "Andy membawa daun-daun, teman-temannya menumpuk daun itu tinggi, dan semut lain menata kerikil menjadi lingkaran yang rapi. Andy menyemangati mereka bahwa bersama-sama mereka bisa membangun apa saja.",
    "Para semut bekerja sampai sarang mereka menjadi hangat dan nyaman. Ketika angin dingin bertiup, mereka berkumpul di dalam sarang, merasa aman, hangat, dan bahagia.",
    "Andy belajar bahwa saat teman-teman bekerja sama, bahkan semut paling kecil pun dapat membangun sesuatu yang luar biasa. Sarang nyaman itu menjadi bukti bahwa kerja sama membuat tugas besar terasa mungkin.",
  ],
  vocabulary,
  expressionDialogs,
  exercises,
};
