import React from "react";
import { Word, StudyMode } from "../../types/Types";
import { getKoreanInitial, speakWord } from "../../utils/tts";
import { CharacterInputs } from "./CharacterInputs";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  Save,
  RefreshCw,
} from "lucide-react";

interface StudyInterfaceProps {
  vocabId: string;
  words: Word[];
  studyMode: StudyMode;
  toggleStudyMode: () => void;
  setShowModeSelection: React.Dispatch<React.SetStateAction<boolean>>;
  exitMemorizeMode: () => void;
  saveProgress: () => void;
  studyHook: {
    currentWord: Word | null;
    userInputs: string[];
    setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
    isCorrect: boolean | null;
    setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>;
    showAnswer: boolean;
    setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>;
    moveToNextWord: () => void;
    showNextBatch: () => void;
    showPrevBatch: () => void;
    markWordAsCompleted: (wordId: number) => void;
    progressPercent: number;
    batchProgress: number;
    totalBatches: number;
    currentBatchNumber: number;
    setCurrentWordIndex: React.Dispatch<React.SetStateAction<number>>;
    currentBatch: Word[];
    currentWordIndex: number;
    completedWords: number[];
    currentIndex: number;
  };
}

export const StudyInterface: React.FC<StudyInterfaceProps> = ({
  vocabId,
  words,
  studyMode,
  toggleStudyMode,
  setShowModeSelection,
  exitMemorizeMode,
  saveProgress,
  studyHook,
}) => {
  const {
    currentWord,
    userInputs,
    setUserInputs,
    isCorrect,
    setIsCorrect,
    showAnswer,
    setShowAnswer,
    moveToNextWord,
    showNextBatch,
    showPrevBatch,
    markWordAsCompleted,
    progressPercent,
    batchProgress,
    totalBatches,
    currentBatchNumber,
    setCurrentWordIndex,
    currentBatch,
    currentWordIndex,
    completedWords,
    currentIndex,
  } = studyHook;

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

  const handleInputKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!currentWord) return;

    const targetWord =
      studyMode === "englishToKorean"
        ? currentWord.korean
        : currentWord.english;

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

      markWordAsCompleted(currentWord.id);
      speakWord(currentWord.english, "en-US");
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

  return (
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
          <h1 className="text-xl font-semibold text-gray-800">암기 모드</h1>
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
          진행률: {progressPercent}% ({completedWords.length}/{words.length}{" "}
          단어)
        </p>

        <div className="flex items-center">
          <button
            onClick={toggleStudyMode}
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
            <CharacterInputs
              word={currentWord}
              studyMode={studyMode}
              userInputs={userInputs}
              setUserInputs={setUserInputs}
              isCorrect={isCorrect}
              showAnswer={showAnswer}
              handleInputKeyDown={handleInputKeyDown}
            />

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

            {(showAnswer) && (
              <button
                onClick={moveToNextWord}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
              >
                다음
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
        <h3 className="text-gray-700 font-medium mb-3">이 배치의 단어:</h3>
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
                setCurrentWordIndex(index);
                setIsCorrect(null);
                setShowAnswer(false);
                setUserInputs([]);
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
          disabled={currentIndex + currentBatch.length >= words.length}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentIndex + currentBatch.length >= words.length
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <span>다음 배치</span>
          <ChevronRight size={20} className="ml-1" />
        </button>
      </div>
    </>
  );
};
