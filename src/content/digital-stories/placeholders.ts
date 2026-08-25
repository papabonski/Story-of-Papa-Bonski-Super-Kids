import type { DigitalStory } from "./types";

type PlaceholderInput = {
  number: number;
  title: string;
};

const placeholderItems: PlaceholderInput[] = [
  { number: 21, title: "Budi's Farming Dreams" },
  { number: 22, title: "Adi's Call to Prayer" },
  { number: 23, title: "Grandpa's Magical Storytime" },
  { number: 24, title: "Kody the Kind Komodo's Adventure" },
  { number: 25, title: "Billy and the Cenderawasih's Journey" },
  { number: 26, title: "Hanwa's Fruitful Garden" },
  { number: 27, title: "Percy the Peacock's Happy Day" },
  { number: 28, title: "Ellie the Elephant's Adventure" },
  { number: 29, title: "Zuly's Handy Creations" },
  { number: 30, title: "Zu's Toothache Lesson" },
  { number: 31, title: "Terry the Turtle's Ocean Adventure" },
  { number: 32, title: "Lee and the Baby Panda's Bond" },
  { number: 33, title: "Zoe, the Helpful Little Prince" },
  { number: 34, title: "Little Explorer Under the Sea" },
  { number: 35, title: "Robo Friends of Tomorrow" },
  { number: 36, title: "Boys of Tomorrow's Dreams" },
  { number: 37, title: "Leo the Brave Firefighter" },
  { number: 38, title: "The Snow Heroes" },
  { number: 39, title: "Sammy's Superhero Dream" },
  { number: 40, title: "Tunde's Stormy Evening" },
  { number: 41, title: "Drake and the Little Knight" },
  { number: 42, title: "Hanwa's Bakery Dream" },
  { number: 43, title: "The Lost Phoenix" },
  { number: 44, title: "The Humble Dragon" },
  { number: 45, title: "The Brave Little Bird" },
  { number: 46, title: "Liang and His Books" },
  { number: 47, title: "The Friendly Forest Friends" },
  { number: 48, title: "Underwater Friends" },
  { number: 49, title: "My New Friend" },
  { number: 50, title: "Dreaming of the Stars" },
];

function createPlaceholderStory({ number, title }: PlaceholderInput): DigitalStory {
  return {
    id: `video${number}`,
    number,
    title,
    language: "English",
    level: "Beginner",
    thumbnail: "/thumbnail-video/coming-soon.svg",
    summary: [
      `${title} sudah masuk dalam katalog Cerita Anak Digital (English). Materi lengkapnya akan muncul di halaman ini setelah video, PDF, ringkasan, vocabulary, expression dialog, dan latihan soal ditambahkan.`,
      "Status ini membantu katalog tetap rapi sampai semua asset Google Drive dan thumbnail final tersedia.",
    ],
    vocabulary: [],
    expressionDialogs: [],
    exercises: [],
  };
}

export const placeholderStories: DigitalStory[] = placeholderItems.map(createPlaceholderStory);
