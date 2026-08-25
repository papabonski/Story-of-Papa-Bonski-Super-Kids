import type { DigitalStory } from "./types";
import { drivePreview, driveView } from "./helpers";

const exercises: DigitalStory["exercises"] = [
  {
    question: "Who is the main character of the story?",
    options: ["Timmy the turtle", "Ken the runner", "Alex the astronaut", "Kiko the koala"],
    answer: "Timmy the turtle",
  },
  {
    question: "What kind of forest did Timmy live in?",
    options: ["A lush and beautiful forest", "A snowy forest", "A dark desert", "A busy city park"],
    answer: "A lush and beautiful forest",
  },
  {
    question: "What was Timmy always doing?",
    options: ["Glowing and smiling", "Crying and hiding", "Running very fast", "Sleeping all day"],
    answer: "Glowing and smiling",
  },
  {
    question: "What made Timmy happy?",
    options: ["Small things", "Big prizes", "Loud noises", "Winning races"],
    answer: "Small things",
  },
  {
    question: "What did Timmy watch fly and sing?",
    options: ["Birds", "Bees", "Dragons", "Clouds"],
    answer: "Birds",
  },
  {
    question: "What did Timmy do when he saw birds?",
    options: ["Wished he could be like them", "Told them to stop", "Hid under a stone", "Ran away"],
    answer: "Wished he could be like them",
  },
  {
    question: "Who did Timmy meet one day?",
    options: ["An old turtle named Gramps", "A fast rabbit named Max", "A baby bird named Sam", "A runner named Ken"],
    answer: "An old turtle named Gramps",
  },
  {
    question: "What was Gramps doing?",
    options: ["Plucking cheerful daisies", "Building a bridge", "Reading a map", "Chasing birds"],
    answer: "Plucking cheerful daisies",
  },
  {
    question: "What did Timmy tell Gramps?",
    options: ["I wish I could fly like you", "I never smile", "I dislike flowers", "I want to run a race"],
    answer: "I wish I could fly like you",
  },
  {
    question: "What did Gramps ask Timmy?",
    options: ["Can you always hop?", "Can you always run?", "Can you always swim?", "Can you always sing?"],
    answer: "Can you always hop?",
  },
  {
    question: "What did Timmy realize about Gramps?",
    options: ["Gramps admired his cheerful life", "Gramps was angry", "Gramps could fly", "Gramps disliked turtles"],
    answer: "Gramps admired his cheerful life",
  },
  {
    question: "What did Timmy think about his own shell?",
    options: ["It protected him", "It made him useless", "It was a bird wing", "It was too bright"],
    answer: "It protected him",
  },
  {
    question: "What did Timmy think about his smile?",
    options: ["It made friends come closer", "It scared everyone", "It made flowers disappear", "It stopped the birds"],
    answer: "It made friends come closer",
  },
  {
    question: "From that day on, what did Timmy focus on?",
    options: ["What he had", "What he lacked", "Running faster", "Building a castle"],
    answer: "What he had",
  },
  {
    question: "What did Timmy thank the birds for?",
    options: ["Their songs", "Their shells", "Their race", "Their compass"],
    answer: "Their songs",
  },
  {
    question: "What did Timmy thank the sky for?",
    options: ["Its beauty", "Its bucket", "Its puzzle", "Its bridge"],
    answer: "Its beauty",
  },
  {
    question: "What did Timmy's grateful heart make him feel?",
    options: ["Lighter and happier", "Lonely and sad", "Afraid and quiet", "Angry and tired"],
    answer: "Lighter and happier",
  },
  {
    question: "Which word means kura-kura?",
    options: ["Turtle", "Bird", "Forest", "Daisy"],
    answer: "Turtle",
  },
  {
    question: "Which word means bersyukur?",
    options: ["Grateful", "Cheerful", "Lush", "Old"],
    answer: "Grateful",
  },
  {
    question: "What is the main lesson of the story?",
    options: ["Gratitude and self-acceptance bring happiness", "Only flying animals can be happy", "Small things do not matter", "Friends should compare themselves"],
    answer: "Gratitude and self-acceptance bring happiness",
  },
];

const vocabulary: DigitalStory["vocabulary"] = [
  ["Timmy", "Timmy", "ˈtɪmi"],
  ["happy", "bahagia", "ˈhæpi"],
  ["turtle", "kura-kura", "ˈtɜːrtl"],
  ["forest", "hutan", "ˈfɔːrɪst"],
  ["lush", "rimbun / subur", "lʌʃ"],
  ["beautiful", "indah", "ˈbjuːtɪfl"],
  ["glowing", "bersinar", "ˈɡloʊɪŋ"],
  ["smiling", "tersenyum", "ˈsmaɪlɪŋ"],
  ["small things", "hal-hal kecil", "smɔːl θɪŋz"],
  ["birds", "burung-burung", "bɜːrdz"],
  ["watched", "memperhatikan", "wɑːtʃt"],
  ["fly", "terbang", "flaɪ"],
  ["sing", "bernyanyi", "sɪŋ"],
  ["old turtle", "kura-kura tua", "oʊld ˈtɜːrtl"],
  ["Gramps", "Kakek Gramps", "ɡræmps"],
  ["plucking", "memetik", "ˈplʌkɪŋ"],
  ["cheerful", "ceria", "ˈtʃɪrfl"],
  ["daisies", "bunga aster", "ˈdeɪziz"],
  ["magical", "ajaib", "ˈmædʒɪkl"],
  ["hop", "melompat kecil", "hɑːp"],
  ["admired", "mengagumi", "ədˈmaɪərd"],
  ["protected", "melindungi", "prəˈtektɪd"],
  ["shell", "tempurung", "ʃel"],
  ["friends", "teman-teman", "frendz"],
  ["focused", "berfokus", "ˈfoʊkəst"],
  ["thanked", "berterima kasih", "θæŋkt"],
  ["songs", "lagu-lagu", "sɔːŋz"],
  ["beauty", "keindahan", "ˈbjuːti"],
  ["grateful", "bersyukur", "ˈɡreɪtfl"],
  ["happiness", "kebahagiaan", "ˈhæpinəs"],
].map(([word, meaning, phonetic]) => ({ word, meaning, phonetic }));

const expressionDialogs: DigitalStory["expressionDialogs"] = [
  {
    expression: "I wish I could...",
    meaning: "Aku berharap aku bisa...",
    useCase: "Dipakai saat anak ingin menyampaikan keinginan yang belum bisa dilakukan.",
    dialog: [
      {
        speaker: "Timmy",
        text: "I wish I could fly like the birds.",
        translation: "Aku berharap aku bisa terbang seperti burung-burung.",
      },
      {
        speaker: "Gramps",
        text: "It is okay to admire others, Timmy.",
        translation: "Tidak apa-apa mengagumi orang lain, Timmy.",
      },
    ],
    practicePrompt: "Latih kalimat: I wish I could sing. I wish I could jump higher.",
  },
  {
    expression: "I admire you.",
    meaning: "Aku mengagumimu.",
    useCase: "Dipakai untuk menyampaikan rasa kagum dengan sopan.",
    dialog: [
      {
        speaker: "Timmy",
        text: "I admire you because you can sing beautifully.",
        translation: "Aku mengagumimu karena kamu bisa bernyanyi dengan indah.",
      },
      {
        speaker: "Bird",
        text: "Thank you, Timmy. I admire your cheerful smile.",
        translation: "Terima kasih, Timmy. Aku mengagumi senyummu yang ceria.",
      },
    ],
    practicePrompt: "Ajak anak memuji teman: I admire your kindness. I admire your courage.",
  },
  {
    expression: "You are special too.",
    meaning: "Kamu juga istimewa.",
    useCase: "Dipakai untuk menenangkan teman yang merasa kurang percaya diri.",
    dialog: [
      {
        speaker: "Timmy",
        text: "The birds are so special. I am just a turtle.",
        translation: "Burung-burung sangat istimewa. Aku hanya seekor kura-kura.",
      },
      {
        speaker: "Gramps",
        text: "You are special too, Timmy.",
        translation: "Kamu juga istimewa, Timmy.",
      },
    ],
    practicePrompt: "Latih afirmasi: I am special too. My friend is special too.",
  },
  {
    expression: "Look at what you have.",
    meaning: "Lihatlah apa yang kamu miliki.",
    useCase: "Dipakai untuk mengajak anak fokus pada kelebihan dan nikmat yang dimiliki.",
    dialog: [
      {
        speaker: "Gramps",
        text: "Look at what you have, not only what you lack.",
        translation: "Lihatlah apa yang kamu miliki, bukan hanya apa yang tidak kamu punya.",
      },
      {
        speaker: "Timmy",
        text: "I have a strong shell and a happy smile.",
        translation: "Aku punya tempurung kuat dan senyum bahagia.",
      },
    ],
    practicePrompt: "Minta anak menyebutkan tiga hal baik yang ia miliki.",
  },
  {
    expression: "My shell protects me.",
    meaning: "Tempurungku melindungiku.",
    useCase: "Dipakai saat membicarakan fungsi atau manfaat sesuatu yang dimiliki.",
    dialog: [
      {
        speaker: "Timmy",
        text: "My shell protects me when I feel unsafe.",
        translation: "Tempurungku melindungiku saat aku merasa tidak aman.",
      },
      {
        speaker: "Gramps",
        text: "That is a wonderful gift.",
        translation: "Itu hadiah yang luar biasa.",
      },
    ],
    practicePrompt: "Latih pola: My family protects me. My home protects me.",
  },
  {
    expression: "I am grateful for...",
    meaning: "Aku bersyukur atas...",
    useCase: "Dipakai untuk menyatakan rasa syukur secara jelas.",
    dialog: [
      {
        speaker: "Timmy",
        text: "I am grateful for my shell, my friends, and the sky.",
        translation: "Aku bersyukur atas tempurungku, teman-temanku, dan langit.",
      },
      {
        speaker: "Bird",
        text: "That makes your heart shine.",
        translation: "Itu membuat hatimu bersinar.",
      },
    ],
    practicePrompt: "Ajak anak melengkapi: I am grateful for my...",
  },
  {
    expression: "Small things can make me happy.",
    meaning: "Hal-hal kecil bisa membuatku bahagia.",
    useCase: "Dipakai untuk mengajarkan kebahagiaan dari hal sederhana.",
    dialog: [
      {
        speaker: "Timmy",
        text: "Small things can make me happy, like flowers and songs.",
        translation: "Hal-hal kecil bisa membuatku bahagia, seperti bunga dan lagu.",
      },
      {
        speaker: "Gramps",
        text: "Yes, happiness can grow from simple things.",
        translation: "Ya, kebahagiaan bisa tumbuh dari hal-hal sederhana.",
      },
    ],
    practicePrompt: "Minta anak menyebutkan satu hal kecil yang membuatnya tersenyum hari ini.",
  },
  {
    expression: "Thank you for your song.",
    meaning: "Terima kasih atas lagumu.",
    useCase: "Dipakai untuk mengucapkan terima kasih atas sesuatu yang indah dari orang lain.",
    dialog: [
      {
        speaker: "Timmy",
        text: "Thank you for your song, little bird.",
        translation: "Terima kasih atas lagumu, burung kecil.",
      },
      {
        speaker: "Bird",
        text: "You are welcome. Thank you for listening.",
        translation: "Sama-sama. Terima kasih sudah mendengarkan.",
      },
    ],
    practicePrompt: "Latih: Thank you for your help. Thank you for your smile.",
  },
  {
    expression: "I like being me.",
    meaning: "Aku suka menjadi diriku sendiri.",
    useCase: "Dipakai sebagai afirmasi untuk menerima diri sendiri.",
    dialog: [
      {
        speaker: "Timmy",
        text: "I may not fly, but I like being me.",
        translation: "Aku mungkin tidak bisa terbang, tetapi aku suka menjadi diriku sendiri.",
      },
      {
        speaker: "Gramps",
        text: "That is the sound of a grateful heart.",
        translation: "Itulah suara hati yang bersyukur.",
      },
    ],
    practicePrompt: "Ajak anak mengulang dengan percaya diri: I like being me.",
  },
  {
    expression: "Happiness starts in my heart.",
    meaning: "Kebahagiaan dimulai dari hatiku.",
    useCase: "Dipakai untuk menyimpulkan pesan cerita tentang syukur dan penerimaan diri.",
    dialog: [
      {
        speaker: "Timmy",
        text: "Happiness starts in my heart.",
        translation: "Kebahagiaan dimulai dari hatiku.",
      },
      {
        speaker: "Forest Friends",
        text: "Your happy heart makes the forest brighter.",
        translation: "Hatimu yang bahagia membuat hutan lebih cerah.",
      },
    ],
    practicePrompt: "Jadikan closing chant: Happiness starts in my heart. I am grateful today.",
  },
];


export const video10: DigitalStory = {
  id: "video10",
  number: 10,
  title: "Timmy the Happy Turtle",
  language: "English",
  level: "Elementary",
  thumbnail: "/thumbnail-video/Timmy-the-Happy-Turtle.jpg",
  videoPreviewUrl: drivePreview("1N4Mu2pbrsOAdydJPnfaGb3Y3MTmGSL_c"),
  videoViewUrl: driveView("1N4Mu2pbrsOAdydJPnfaGb3Y3MTmGSL_c"),
  pdfPreviewUrl: drivePreview("1_CfFWLMW-Bexh27sRpkrnkeSL4iPq5Kj"),
  pdfViewUrl: "https://drive.google.com/file/d/1_CfFWLMW-Bexh27sRpkrnkeSL4iPq5Kj/view?usp=sharing",
  summary: [
  "Cerita ini mengisahkan Timmy, seekor kura-kura kecil yang tinggal di hutan rimbun dan indah. Timmy selalu tersenyum dan merasa bahagia karena hal-hal kecil di sekitarnya.",
  "Timmy melihat burung-burung terbang dan bernyanyi, lalu sempat berharap bisa menjadi seperti mereka. Suatu hari ia bertemu Gramps, kura-kura tua yang ceria, yang justru mengagumi kemampuan Timmy untuk melompat kecil dan menikmati hidup.",
  "Timmy menyadari bahwa tempurungnya melindunginya dan senyumnya membuat teman-teman mendekat. Ia mulai fokus pada apa yang ia miliki, bukan pada hal yang tidak ia punya.",
  "Sejak itu Timmy berterima kasih pada burung atas lagu-lagunya dan pada langit atas keindahannya. Cerita ini mengajarkan rasa syukur, menerima diri sendiri, dan menemukan kebahagiaan dalam hal-hal sederhana."
],
  vocabulary,
  expressionDialogs,
  exercises,
};
