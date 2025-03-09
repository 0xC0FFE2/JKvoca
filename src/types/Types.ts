export interface Word {
  id: number;
  english: string;
  korean: string;
  example: string;
  pronunciation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface VocabInfo {
  vocabId: string;
  vocabName: string;
  vocabCategory: string;
  vocabDescription: string;
  vocabLevel: string;
  vocabCount : number;
}

export type StudyMode = "englishToKorean" | "koreanToEnglish";

export type FlashcardMode = "flashcard" | "review";
