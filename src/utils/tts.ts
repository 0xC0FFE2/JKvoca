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