export const speakWord = (text: string, language: string = "en-US"): void => {
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${language}&q=${encodeURIComponent(
    text
  )}`;

  const audio = new Audio(url);
  audio.play().catch((error) => {
    console.error("fucked", error);
    useBrowserTTS(text, language);
  });
};

const useBrowserTTS = (text: string, language: string = "en-US"): void => {
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
    console.error("brower is fucked");
    alert(
      "음성 합성 기능을 사용할 수 없습니다. 브라우저를 업데이트하거나 다른 브라우저를 사용해 주세요."
    );
  }
};
