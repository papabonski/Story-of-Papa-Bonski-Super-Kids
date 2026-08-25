export type DigitalStoryExercise = {
  question: string;
  options: string[];
  answer: string;
};

export type DigitalStoryWord = {
  word: string;
  meaning: string;
  /** IPA transcription (General American), shown between slashes in the UI. */
  phonetic: string;
};

export type DigitalStoryExpressionLine = {
  speaker: string;
  text: string;
  translation: string;
};

export type DigitalStoryExpression = {
  expression: string;
  meaning: string;
  useCase: string;
  dialog: DigitalStoryExpressionLine[];
  practicePrompt: string;
};

export type DigitalStory = {
  id: string;
  number: number;
  title: string;
  language: "English";
  level: string;
  thumbnail: string;
  videoPreviewUrl?: string;
  videoViewUrl?: string;
  pdfPreviewUrl?: string;
  pdfViewUrl?: string;
  summary: string[];
  vocabulary: DigitalStoryWord[];
  expressionDialogs: DigitalStoryExpression[];
  exercises: DigitalStoryExercise[];
};
