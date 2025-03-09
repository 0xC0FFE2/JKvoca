export interface WordType {
  id: string;
  english: string;
  korean: string;
  example: string;
  pronunciation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  wordIndex: number;
}

export interface Vocab {
  vocabId: string;
  vocabName: string;
  vocabDescription: string;
  vocabLevel: string;
  wordCount: number;
  vocabCategory: string;
}

export interface WordPageResponse {
  content: WordType[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface NewVocabFormType {
  vocabName: string;
  vocabCategory: string;
  vocabDescription: string;
  vocabLevel: string;
}

export interface NewWordFormType {
  english: string;
  korean: string;
  example: string;
  pronunciation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface PageInfo {
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
