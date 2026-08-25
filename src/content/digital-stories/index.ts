import type { DigitalStory } from "./types";
import { video1 } from "./video1";
import { video2 } from "./video2";
import { video3 } from "./video3";
import { video4 } from "./video4";
import { video5 } from "./video5";
import { video6 } from "./video6";
import { video7 } from "./video7";
import { video8 } from "./video8";
import { video9 } from "./video9";
import { video10 } from "./video10";
import { video11 } from "./video11";
import { video12 } from "./video12";
import { video13 } from "./video13";
import { video14 } from "./video14";
import { video15 } from "./video15";
import { video16 } from "./video16";
import { video17 } from "./video17";
import { video18 } from "./video18";
import { video19 } from "./video19";
import { video20 } from "./video20";
import { placeholderStories } from "./placeholders";

export type {
  DigitalStory,
  DigitalStoryExercise,
  DigitalStoryExpression,
  DigitalStoryExpressionLine,
  DigitalStoryWord,
} from "./types";

export const digitalStories: DigitalStory[] = [
  video1,
  video2,
  video3,
  video4,
  video5,
  video6,
  video7,
  video8,
  video9,
  video10,
  video11,
  video12,
  video13,
  video14,
  video15,
  video16,
  video17,
  video18,
  video19,
  video20,
  ...placeholderStories,
];

export function findDigitalStory(id: string): DigitalStory | undefined {
  return digitalStories.find((story) => story.id === id);
}

/**
 * Every vocabulary word across all stories, lowercased.
 *
 * The pronunciation endpoint synthesizes only words in this set, so it cannot
 * be driven as a free text-to-speech proxy against the owner's Gemini quota.
 */
export const vocabularyWordSet: ReadonlySet<string> = new Set(
  digitalStories.flatMap((story) => story.vocabulary.map((item) => item.word.toLowerCase()))
);

/** A story counts as ready once its video is watchable in-page. */
export function isStoryReady(story: DigitalStory): boolean {
  return Boolean(story.videoPreviewUrl);
}

/**
 * Previous/next story in catalog order - used for the detail page pager so a
 * child can keep moving without going back to the list.
 */
export function getStoryNeighbours(id: string): {
  previous?: DigitalStory;
  next?: DigitalStory;
} {
  const index = digitalStories.findIndex((story) => story.id === id);
  if (index === -1) return {};
  return {
    previous: index > 0 ? digitalStories[index - 1] : undefined,
    next: index < digitalStories.length - 1 ? digitalStories[index + 1] : undefined,
  };
}
