import { Word, VocabInfo } from "../types/Types";
import instance from "../utils/publicApi";

export interface WordPageResponse {
  content: Word[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const fetchWords = async (
  vocabId: string,
  page: number = 0,
  size: number = 24
): Promise<WordPageResponse> => {
  try {
    const response = await instance.get(`/v1/words/vocab/list/${vocabId}`, {
      params: {
        page,
        size,
      },
    });

    if (response.data && response.data.content) {
      const words = response.data.content.map((item: any) => ({
        id: item.id || 0,
        english: item.english || "",
        korean: item.korean || "",
        example: item.example || "",
        pronunciation: item.pronunciation || "",
        difficulty: item.difficulty?.toUpperCase() || "MEDIUM",
      }));

      return {
        content: words,
        totalElements: response.data.totalElements || 0,
        totalPages: response.data.totalPages || 0,
        size: response.data.size || 0,
        number: response.data.number || 0,
        first: response.data.first || false,
        last: response.data.last || false,
      };
    } else {
      console.error(
        "API가 예상하는 페이지네이션 형식이 아닙니다:",
        response.data
      );
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0,
        first: true,
        last: true,
      };
    }
  } catch (error) {
    console.error("단어 목록을 불러오는 중 오류가 발생했습니다:", error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size: 0,
      number: 0,
      first: true,
      last: true,
    };
  }
};

export const fetchVocabInfo = async (vocabId: string): Promise<VocabInfo> => {
  try {
    const response = await instance.get(`/v1/vocab/info/${vocabId}`);

    const data = response.data;

    return {
      vocabId: data.vocabId || "",
      vocabName: data.vocabName || "단어장",
      vocabCategory: data.vocabCategory || "기타",
      vocabDescription:
        data.vocabDescription || "단어장 정보를 불러올 수 없습니다.",
      vocabLevel: data.vocabLevel || "미정",
      vocabCount: data.wordCount || 0,
    };
  } catch (error) {
    console.error("단어장 정보를 불러오는 중 오류가 발생했습니다:", error);

    return {
      vocabId: "",
      vocabName: "단어장",
      vocabCategory: "기타",
      vocabDescription: "단어장 정보를 불러올 수 없습니다.",
      vocabLevel: "미정",
      vocabCount: 0,
    };
  }
};

export const fetchAllWords = async (vocabId: string): Promise<Word[]> => {
  try {
    const response = await instance.get(`/v1/words/vocab/list/all/${vocabId}`);

    console.log("모든 단어 목록 API 원본 응답:", response.data);

    if (Array.isArray(response.data)) {
      return response.data.map((item: any) => ({
        id: item.id || "",
        english: item.english || "",
        korean: item.korean || "",
        example: item.example || "",
        pronunciation: item.pronunciation || "",
        difficulty: item.difficulty?.toUpperCase() || "MEDIUM",
        wordIndex: item.wordIndex || 0,
      }));
    } else {
      console.error("API가 예상하는 배열 형식이 아닙니다:", response.data);
      return [];
    }
  } catch (error) {
    console.error("모든 단어 목록을 불러오는 중 오류가 발생했습니다:", error);
    return [];
  }
};

export const fetchAndShuffleWords = async (
  vocabId: string
): Promise<Word[]> => {
  try {
    const words = await fetchAllWords(vocabId);
    return shuffleArray(words);
  } catch (error) {
    console.error("단어 목록을 불러오는 중 오류:", error);
    return [];
  }
};

const shuffleArray = (array: Word[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
