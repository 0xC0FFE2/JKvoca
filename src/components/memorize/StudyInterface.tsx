import React, { useEffect } from "react";
import { Word, StudyMode } from "../../types/Types";
import { getKoreanInitial, speakWord } from "../../utils/tts";
import { CharacterInputs } from "./CharacterInputs";
import {
  X,
  Volume2,
  RefreshCw,
  ArrowRight,
  Check,
  Eye,
  Sparkle,
} from "lucide-react";

interface StudyInterfaceProps {
  vocabId: string;
  words: Word[];
  studyMode: StudyMode;
  toggleStudyMode: () => void;
  setShowModeSelection: React.Dispatch<React.SetStateAction<boolean>>;
  exitMemorizeMode: () => void;
  studyHook: {
    currentWord: Word | null;
    currentWordIndex: number;
    userInputs: string[];
    setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
    isCorrect: boolean | null;
    setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>;
    showAnswer: boolean;
    setShowAnswer: React.Dispatch<React.SetStateAction<boolean>>;
    moveToNextWord: () => void;
    progressPercent: number;
    markWordAsCompleted: (wordId: number) => void;
    checkAnswer: () => void;
    studyCompleted: boolean;
    incorrectWords: number[];
    setIncorrectWords?: React.Dispatch<React.SetStateAction<number[]>>;
    totalWords: number;
    setStudyCompleted?: () => void;
  };
  isExamMode?: boolean;
}

export const StudyInterface: React.FC<StudyInterfaceProps> = ({
  vocabId,
  words,
  studyMode,
  toggleStudyMode,
  setShowModeSelection,
  exitMemorizeMode,
  studyHook,
  isExamMode = false,
}) => {
  const {
    currentWord,
    currentWordIndex,
    userInputs,
    setUserInputs,
    isCorrect,
    setIsCorrect,
    showAnswer,
    setShowAnswer,
    moveToNextWord,
    progressPercent,
    markWordAsCompleted,
    checkAnswer,
    studyCompleted,
    incorrectWords,
    setIncorrectWords,
    totalWords,
    setStudyCompleted,
  } = studyHook;

  useEffect(() => {
    console.log("StudyInterface 렌더링");
    console.log("현재 단어 인덱스:", currentWordIndex);
    console.log("총 단어 수:", totalWords);
    console.log("학습 완료 상태:", studyCompleted);
  }, [currentWordIndex, totalWords, studyCompleted]);

  useEffect(() => {
    if (
      currentWordIndex === totalWords - 1 &&
      isCorrect === true &&
      !studyCompleted
    ) {
      console.log("마지막 단어가 정답이므로 3초 후 학습 완료로 전환됩니다.");
    }
  }, [currentWordIndex, totalWords, isCorrect, studyCompleted]);

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

  useEffect(() => {
    if (isCorrect && currentWord) {
      speakWord(
        studyMode === "englishToKorean"
          ? currentWord.english
          : currentWord.korean,
        studyMode === "englishToKorean" ? "en-US" : "ko-KR"
      );
    }
  }, [isCorrect, currentWord, studyMode]);

  const showCorrectAnswer = () => {
    if (currentWord && setIncorrectWords) {
      console.log("정답 보기 클릭 - 틀린 단어로 카운트:", currentWord.id);
      setIncorrectWords((prev) => {
        if (!prev.includes(currentWord.id)) {
          return [...prev, currentWord.id];
        }
        return prev;
      });
    }

    setIsCorrect(false);
    setShowAnswer(true);

    if (currentWord) {
      speakWord(
        studyMode === "englishToKorean"
          ? currentWord.korean
          : currentWord.english,
        studyMode === "englishToKorean" ? "ko-KR" : "en-US"
      );
    }
  };

  const handleMoveToNext = () => {
    console.log("다음 단어로 이동 버튼 클릭");
    if (currentWordIndex === totalWords - 1) {
      console.log("마지막 단어에서 다음으로 이동 - 학습 완료로 설정");
      moveToNextWord();
    } else {
      moveToNextWord();
    }
  };

  if (studyCompleted) {
    console.log("학습 완료 UI 표시됨");
    const correctWords = totalWords - incorrectWords.length;
    const correctPercent = Math.round((correctWords / totalWords) * 100);

    return (
      <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Sparkle size={32} className="text-blue-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">학습 완료!</h2>
        <p className="text-gray-500 mb-6">
          총 {totalWords}개의 단어 학습을 마쳤습니다.
        </p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {correctPercent}%
          </div>
          <p className="text-blue-600 font-medium">정답률</p>
        </div>

        <div className="flex justify-between mb-8">
          <div className="flex-1 bg-green-50 rounded-xl p-4 mr-3">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {correctWords}
            </div>
            <p className="text-green-600 text-sm">맞은 단어</p>
          </div>
          <div className="flex-1 bg-red-50 rounded-xl p-4 ml-3">
            <div className="text-3xl font-bold text-red-500 mb-1">
              {incorrectWords.length}
            </div>
            <p className="text-red-500 text-sm">틀린 단어</p>
          </div>
        </div>

        <button
          onClick={exitMemorizeMode}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
        >
          학습 종료하기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={exitMemorizeMode}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={18} className="mr-1" />
          <span>종료</span>
        </button>

        <div className="text-center">
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
            {isExamMode ? "시험 모드" : "암기 모드"}
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RefreshCw size={16} className="mr-1" />
          <span className="text-sm">
            {studyMode === "englishToKorean" ? "초기화" : "초기화"}
          </span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>진행 상황</span>
          <span>
            {currentWordIndex + 1}/{totalWords} 단어
          </span>
        </div>

        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {currentWord && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              {studyMode === "englishToKorean"
                ? currentWord.english
                : currentWord.korean}
            </h2>

            <div className="flex justify-center items-center mb-2">
              <p className="text-gray-500 font-medium mr-2">
                {studyMode === "englishToKorean"
                  ? currentWord.pronunciation || ""
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
                className="text-blue-500 hover:text-blue-600 focus:outline-none transition-colors"
              >
                <Volume2 size={18} />
              </button>
            </div>

            <p className="text-gray-500 mb-1 text-sm font-medium">
              {getHint()}
            </p>

            {studyMode === "englishToKorean" && currentWord.example && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm italic text-gray-600">
                {currentWord.example}
              </div>
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
              <div
                className={`mt-4 p-3 rounded-xl flex items-center ${
                  isCorrect
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                <div className="mr-2">
                  {isCorrect ? <Check size={18} /> : <X size={18} />}
                </div>
                <p className="font-medium">
                  {isCorrect
                    ? "정답입니다! 🎉"
                    : "틀렸습니다. 다시 시도하거나 정답을 확인하세요."}
                </p>
              </div>
            )}

            {showAnswer && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">정답</p>
                  <p className="text-blue-700 font-bold text-xl">
                    {studyMode === "englishToKorean"
                      ? currentWord.korean
                      : currentWord.english}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            {/* 정답이 아니고 답이 표시되지 않은 경우에만 "확인하기"와 "정답 보기" 버튼 표시 */}
            {isCorrect !== true && !showAnswer && (
              <>
                <button
                  onClick={checkAnswer}
                  className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl flex items-center justify-center transition-colors"
                >
                  <Check size={18} className="mr-2" />
                  확인하기
                </button>
                <button
                  onClick={showCorrectAnswer}
                  className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl flex items-center justify-center transition-colors"
                >
                  <Eye size={18} className="mr-2" />
                  정답 보기
                </button>
              </>
            )}

            {/* 오답이고 정답이 표시된 상태일 때 "다음으로" 버튼 표시 */}
            {isCorrect === false && showAnswer && currentWordIndex < totalWords - 1 && (
              <button
                onClick={handleMoveToNext}
                className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl flex items-center justify-center transition-colors"
              >
                <ArrowRight size={18} className="mr-2" />
                다음으로
              </button>
            )}

            {/* 마지막 단어이고 정답이 표시된 상태일 때 "학습 완료" 버튼 표시 */}
            {(isCorrect === true || (isCorrect === false && showAnswer)) &&
              currentWordIndex === totalWords - 1 && (
                <button
                  onClick={handleMoveToNext}
                  className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl flex items-center justify-center transition-colors"
                >
                  학습 완료
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};