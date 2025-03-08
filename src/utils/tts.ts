import { Word } from "../types/Types";

export const getVocabulary = (id: string): Word[] => {
  return Array(50)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      english: `Word ${index + 1}`,
      korean: `단어 ${index + 1}`,
      example: `This is an example sentence using Word ${index + 1}.`,
      pronunciation: `/wɜːrd ${index + 1}/`,
      difficulty:
        index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard",
    }));
};

export const speakWord = (text: string, language: string = "en-US"): void => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.includes(language.split("-")[0]));
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    console.error("브라우저가 음성 합성을 지원하지 않습니다");
    alert(
      "음성 합성 기능을 사용할 수 없습니다. 브라우저를 업데이트하거나 다른 브라우저를 사용해 주세요."
    );
  }
};

export const getKoreanInitial = (text: string): string => {
  const result: string[] = [];
  const initialConsonants = [
    "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
    "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
  ];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const code = char.charCodeAt(0);

    if (code >= 44032 && code <= 55203) {
      const initialIndex = Math.floor((code - 44032) / 588);
      result.push(initialConsonants[initialIndex]);
    } else {
      result.push(char);
    }
  }

  return result.join("");
};