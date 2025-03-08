export interface Word {
    id: number;
    english: string;
    korean: string;
    example: string;
    pronunciation: string;
    difficulty: "easy" | "medium" | "hard";
  }
  
  export type StudyMode = "englishToKorean" | "koreanToEnglish";