import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  Check,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
} from "lucide-react";

interface Word {
  id: number;
  english: string;
  korean: string;
  example: string;
  pronunciation: string;
  difficulty: "easy" | "medium" | "hard";
}

const getVocabulary = (id: string): Word[] => {
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
  useBrowserTTS(text, language);
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
    console.error("브라우저가 음성 합성을 지원하지 않습니다");
    alert(
      "음성 합성 기능을 사용할 수 없습니다. 브라우저를 업데이트하거나 다른 브라우저를 사용해 주세요."
    );
  }
};

const getKoreanInitial = (text: string): string => {
  const result: string[] = [];
  const initialConsonants = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ",
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

type StudyMode = "englishToKorean" | "koreanToEnglish";

const MemorizePage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();

  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [currentBatch, setCurrentBatch] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>("englishToKorean");
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [showBatchSelection, setShowBatchSelection] = useState(false);
  const [selectedBatchSize, setSelectedBatchSize] = useState(5);

  const batchSize = 5;

  useEffect(() => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);

      if (!showModeSelection && !showBatchSelection) {
        const firstBatch = fetchedWords.slice(0, selectedBatchSize);
        setCurrentBatch(firstBatch);
      }
    }
  }, [vocabId, showModeSelection, showBatchSelection, selectedBatchSize]);

  const currentWord = currentBatch[currentWordIndex] || null;

  const getHint = (): string => {
    if (!currentWord) return "";

    if (studyMode === "englishToKorean") {
      const koreanChars = currentWord.korean.replace(/ /g, "");
      const initialHint = getKoreanInitial(currentWord.korean);
      return `${initialHint} (${koreanChars.length}자)`;
    } else {
      const wordLength = currentWord.english.length;
      const firstChar = currentWord.english[0];
      return `${firstChar}${"_".repeat(wordLength - 1)} (${wordLength}자)`;
    }
  };

  useEffect(() => {
    if (currentWord) {
      const targetWord =
        studyMode === "englishToKorean"
          ? currentWord.korean
          : currentWord.english;

      let newInputs = [...userInputs];

      if (newInputs.length !== targetWord.length) {
        newInputs = Array(targetWord.length)
          .fill("")
          .map((_, index) => (targetWord[index] === " " ? " " : ""));
        setUserInputs(newInputs);
      }
    }
  }, [currentWord, studyMode]);

  const handleInputChange = (index: number, value: string) => {
    if (!currentWord) return;

    const targetWord =
      studyMode === "englishToKorean"
        ? currentWord.korean
        : currentWord.english;

    const newInputs = [...userInputs];

    if (value.length <= 1) {
      newInputs[index] = value;
      setUserInputs(newInputs);
      if (
        studyMode === "koreanToEnglish" &&
        value &&
        index < userInputs.length - 1
      ) {
        let nextIndex = index + 1;

        while (nextIndex < userInputs.length && targetWord[nextIndex] === " ") {
          nextIndex++;
        }

        if (nextIndex < userInputs.length) {
          setTimeout(() => {
            const nextInput = document.getElementById(
              `char-input-${nextIndex}`
            );
            if (nextInput) {
              (nextInput as HTMLInputElement).focus();
            }
          }, 0);
        }
      }
    }
  };

  // 정답 체크
  const checkAnswer = () => {
    if (!currentWord) return;

    let isUserCorrect = false;
    const correctAnswer =
      studyMode === "englishToKorean"
        ? currentWord.korean
        : currentWord.english;

    const userAnswerCharacters = userInputs.filter(
      (char, index) => correctAnswer[index] !== " "
    );
    const correctAnswerCharacters = correctAnswer
      .split("")
      .filter((char) => char !== " ");

    if (studyMode === "englishToKorean") {
      isUserCorrect =
        userAnswerCharacters.join("") === correctAnswerCharacters.join("");
    } else {
      isUserCorrect =
        userAnswerCharacters.join("").toLowerCase() ===
        correctAnswerCharacters.join("").toLowerCase();
    }

    setIsCorrect(isUserCorrect);

    if (isUserCorrect) {
      setTimeout(() => {
        moveToNextWord();
      }, 3000);

      if (!completedWords.includes(currentWord.id)) {
        setCompletedWords([...completedWords, currentWord.id]);
      }

      speakWord(currentWord.english, "en-US");
    }
  };

  const moveToNextWord = () => {
    setUserInputs([]);
    setIsCorrect(null);
    setShowAnswer(false);

    if (currentWordIndex < currentBatch.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      showNextBatch();
    }
  };

  const handleInputKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const targetWord =
      studyMode === "englishToKorean"
        ? currentWord?.korean
        : currentWord?.english;

    if (!targetWord) return;

    if (e.key === "Backspace" && index > 0 && !userInputs[index]) {
      let prevIndex = index - 1;

      while (prevIndex > 0 && targetWord[prevIndex] === " ") {
        prevIndex--;
      }

      const prevInput = document.getElementById(`char-input-${prevIndex}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }

    if (e.key === "Enter") {
      checkAnswer();
    }
  };

  const showCorrectAnswer = () => {
    setShowAnswer(true);

    if (currentWord) {
      if (studyMode === "englishToKorean") {
        speakWord(currentWord.korean, "ko-KR");
      } else {
        speakWord(currentWord.english, "en-US");
      }
    }
  };

  const toggleStudyMode = () => {
    setStudyMode((prev) =>
      prev === "englishToKorean" ? "koreanToEnglish" : "englishToKorean"
    );
    setCurrentWordIndex(0);
    setUserInputs([]);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const showNextBatch = () => {
    const nextBatchStart = currentIndex + batchSize;
    if (nextBatchStart < words.length) {
      setCurrentIndex(nextBatchStart);
      setCurrentBatch(words.slice(nextBatchStart, nextBatchStart + batchSize));
      setCurrentWordIndex(0);
      setUserInputs([]);
      setIsCorrect(null);
      setShowAnswer(false);
    }
  };

  const showPrevBatch = () => {
    const prevBatchStart = currentIndex - batchSize;
    if (prevBatchStart >= 0) {
      setCurrentIndex(prevBatchStart);
      setCurrentBatch(words.slice(prevBatchStart, prevBatchStart + batchSize));
      setCurrentWordIndex(0);
      setUserInputs([]);
      setIsCorrect(null);
      setShowAnswer(false);
    }
  };

  const exitMemorizeMode = () => {
    navigate(`/vocabulary/${vocabId}`);
  };

  const saveProgress = () => {
    // 실제로는 API 호출 등으로 진행 상황을 저장
    alert("진행 상황이 저장되었습니다.");
  };

  // 진행률 계산
  const progressPercent =
    words.length > 0
      ? Math.round((completedWords.length / words.length) * 100)
      : 0;

  const totalBatches = Math.ceil(words.length / selectedBatchSize);
  const currentBatchNumber = Math.floor(currentIndex / selectedBatchSize) + 1;

  // 현재 단어 배치 내 진행률
  const batchProgress =
    currentBatch.length > 0
      ? Math.round((currentWordIndex / currentBatch.length) * 100)
      : 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* 모드 선택 화면 */}
        {showModeSelection ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              학습 모드 선택
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              어떤 방식으로 단어를 학습하시겠습니까?
            </p>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setStudyMode("englishToKorean");
                  setShowModeSelection(false);
                  setShowBatchSelection(true);
                }}
                className="w-full py-4 px-6 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg flex items-center justify-center"
              >
                <span className="text-lg font-medium">영어 → 한국어</span>
                <span className="ml-2 text-sm text-blue-600">
                  (영어 단어를 보고 한국어 뜻 맞추기)
                </span>
              </button>

              <button
                onClick={() => {
                  setStudyMode("koreanToEnglish");
                  setShowModeSelection(false);
                  setShowBatchSelection(true);
                }}
                className="w-full py-4 px-6 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg flex items-center justify-center"
              >
                <span className="text-lg font-medium">한국어 → 영어</span>
                <span className="ml-2 text-sm text-green-600">
                  (한국어 뜻을 보고 영어 단어 맞추기)
                </span>
              </button>
            </div>
          </div>
        ) : showBatchSelection ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              학습할 단어 수 선택
            </h2>
            <p className="text-gray-600 mb-8 text-center">
              한 번에 몇 개의 단어를 학습하시겠습니까?
            </p>

            <div className="space-y-4">
              {[5, 10, 15, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setSelectedBatchSize(size);
                    setShowBatchSelection(false);
                    // 선택된 배치 크기로 첫 배치 설정
                    setCurrentBatch(words.slice(0, size));
                  }}
                  className={`w-full py-3 px-6 ${
                    selectedBatchSize === size
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  } rounded-lg flex items-center justify-center`}
                >
                  <span className="text-lg font-medium">{size}개 단어</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setShowModeSelection(true);
                  setShowBatchSelection(false);
                }}
                className="w-full py-2 px-6 mt-4 border border-gray-300 text-gray-600 rounded-lg flex items-center justify-center"
              >
                <span>이전으로 돌아가기</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={exitMemorizeMode}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <X size={20} className="mr-1" />
                <span>종료하기</span>
              </button>

              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-800">
                  암기 모드
                </h1>
                <p className="text-sm text-gray-500">
                  배치 {currentBatchNumber} / {totalBatches}
                </p>
              </div>

              <button
                onClick={saveProgress}
                className="flex items-center text-gray-600 hover:text-blue-600"
              >
                <Save size={20} className="mr-1" />
                <span>저장하기</span>
              </button>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full mb-1">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            <div className="w-full h-1 bg-gray-100 rounded-full mb-4">
              <div
                className="h-full bg-green-400 rounded-full"
                style={{ width: `${batchProgress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                진행률: {progressPercent}% ({completedWords.length}/
                {words.length} 단어)
              </p>

              <div className="flex items-center">
                <button
                  onClick={() => {
                    setShowModeSelection(true);
                    setUserInputs([]);
                    setIsCorrect(null);
                    setShowAnswer(false);
                  }}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                >
                  <RefreshCw size={16} className="mr-1" />
                  <span>
                    {studyMode === "englishToKorean"
                      ? "영어 → 한국어"
                      : "한국어 → 영어"}
                  </span>
                </button>
              </div>
            </div>

            {currentWord && (
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {studyMode === "englishToKorean"
                      ? currentWord.english
                      : currentWord.korean}
                  </h2>

                  <div className="flex justify-center items-center space-x-2 mb-4">
                    <p className="text-gray-500 font-medium">
                      {studyMode === "englishToKorean"
                        ? currentWord.pronunciation
                        : ""}
                    </p>
                    <button
                      onClick={() =>
                        speakWord(
                          studyMode === "englishToKorean"
                            ? currentWord.english
                            : currentWord.korean,
                          studyMode === "englishToKorean" ? "en-US" : "ko-KR"
                        )
                      }
                      className="text-gray-400 hover:text-blue-500 focus:outline-none"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>

                  <p className="text-gray-500 mb-4 font-medium">{getHint()}</p>

                  {studyMode === "englishToKorean" && (
                    <p className="text-sm text-gray-600 italic mt-2 mb-6 pl-3 border-l-2 border-gray-200">
                      {currentWord.example}
                    </p>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex justify-center space-x-2 flex-wrap">
                    {currentWord &&
                      userInputs.map((charInput, index) => {
                        const targetWord =
                          studyMode === "englishToKorean"
                            ? currentWord.korean
                            : currentWord.english;

                        if (targetWord[index] === " ") {
                          return null;
                        }

                        let hint = "";
                        if (studyMode === "englishToKorean") {
                          const char = targetWord[index];
                          const code = char.charCodeAt(0);

                          if (code >= 44032 && code <= 55203) {
                            const initialConsonants = [
                              "ㄱ",
                              "ㄲ",
                              "ㄴ",
                              "ㄷ",
                              "ㄸ",
                              "ㄹ",
                              "ㅁ",
                              "ㅂ",
                              "ㅃ",
                              "ㅅ",
                              "ㅆ",
                              "ㅇ",
                              "ㅈ",
                              "ㅉ",
                              "ㅊ",
                              "ㅋ",
                              "ㅌ",
                              "ㅍ",
                              "ㅎ",
                            ];
                            const initialIndex = Math.floor(
                              (code - 44032) / 588
                            );
                            hint = initialConsonants[initialIndex];
                          }
                          else {
                            hint = char;
                          }
                        } else {
                          hint = index === 0 ? targetWord[0] : "_";
                        }

                        return (
                          <div
                            key={index}
                            className="flex flex-col items-center"
                          >
                            <div className="text-gray-400 text-sm mb-1">
                              {!showAnswer ? hint : targetWord[index]}
                            </div>
                            <input
                              id={`char-input-${index}`}
                              type="text"
                              value={charInput}
                              onChange={(e) =>
                                handleInputChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleInputKeyDown(index, e)}
                              maxLength={1}
                              className={`w-10 h-10 text-center text-lg border rounded-lg ${
                                isCorrect === null
                                  ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                  : isCorrect
                                  ? "border-green-300 bg-green-50 text-green-700"
                                  : "border-red-300 bg-red-50 text-red-700"
                              }`}
                              disabled={isCorrect === true || showAnswer}
                              autoComplete="off"
                              autoCapitalize="off"
                              autoFocus={index === 0}
                            />
                          </div>
                        );
                      })}
                  </div>

                  {isCorrect !== null && (
                    <p
                      className={`mt-2 text-center ${
                        isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCorrect
                        ? "정답입니다! 🎉"
                        : "틀렸습니다. 다시 시도하거나 정답을 확인하세요."}
                    </p>
                  )}

                  {showAnswer && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-center text-blue-700 font-medium">
                        정답:{" "}
                        {studyMode === "englishToKorean"
                          ? currentWord.korean
                          : currentWord.english}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center space-x-4">
                  {isCorrect !== true && !showAnswer && (
                    <>
                      <button
                        onClick={checkAnswer}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        확인하기
                      </button>
                      <button
                        onClick={showCorrectAnswer}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-100"
                      >
                        정답 보기
                      </button>
                    </>
                  )}

                  {(isCorrect === true || showAnswer) && (
                    <button
                      onClick={moveToNextWord}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
                    >
                      다음 단어
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* 단어 목록 영역 */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
              <h3 className="text-gray-700 font-medium mb-3">
                이 배치의 단어:
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentBatch.map((word, index) => (
                  <div
                    key={word.id}
                    className={`px-3 py-1 rounded-lg text-sm cursor-pointer ${
                      index === currentWordIndex
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : completedWords.includes(word.id)
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                    onClick={() => {
                      setIsCorrect(null);
                      setShowAnswer(false);
                    }}
                  >
                    {index + 1}.{" "}
                    {studyMode === "englishToKorean"
                      ? word.english.slice(0, 8) +
                        (word.english.length > 8 ? "..." : "")
                      : word.korean.slice(0, 8) +
                        (word.korean.length > 8 ? "..." : "")}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={showPrevBatch}
                disabled={currentIndex === 0}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentIndex === 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft size={20} className="mr-1" />
                <span>이전 배치</span>
              </button>

              <button
                onClick={showNextBatch}
                disabled={currentIndex + selectedBatchSize >= words.length}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  currentIndex + selectedBatchSize >= words.length
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span>다음 배치</span>
                <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default MemorizePage;
