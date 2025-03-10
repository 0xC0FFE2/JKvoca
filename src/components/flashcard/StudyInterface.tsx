import React, { useState } from "react";
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  Check,
  SkipForward,
  Eye,
} from "lucide-react";
import { Word } from "../../types/Types";
import { speakWord } from "../../utils/tts";

interface StudyInterfaceProps {
  currentWord: Word;
  progressPercent: number;
  currentIndex: number;
  totalWords: number;
  onPrev: () => void;
  onNext: () => void;
  onKnown: () => void;
  onUnknown: () => void;
  onReset: () => void;
  onExit: () => void;
  isExamMode?: boolean; // 시험 모드 여부 (선택적 프로퍼티)
}

const StudyInterface: React.FC<StudyInterfaceProps> = ({
  currentWord,
  progressPercent,
  currentIndex,
  totalWords,
  onPrev,
  onNext,
  onKnown,
  onUnknown,
  onReset,
  onExit,
  isExamMode = false,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleSpeakWord = () => {
    speakWord(currentWord.english);
  };

  const toggleAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextWord = () => {
    setShowAnswer(false);
    onNext();
  };

  const handlePrevWord = () => {
    setShowAnswer(false);
    onPrev();
  };

  const handleKnown = () => {
    setShowAnswer(false);
    onKnown();
  };

  const handleUnknown = () => {
    setShowAnswer(false);
    onUnknown();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onExit}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <X size={20} className="mr-1" />
          <span>종료하기</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-800">
            {isExamMode ? "시험 모드" : "플래시카드 모드"}
          </h1>
          <p className="text-sm text-gray-500">
            {currentIndex + 1} / {totalWords} 카드
          </p>
        </div>

        <button
          onClick={onReset}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <RotateCcw size={20} className="mr-1" />
          <span>다시하기</span>
        </button>
      </div>

      {/* 진행바 */}
      <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* 단어 카드 */}
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* 영어 단어 (항상 표시) */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex items-center justify-center">
            <h2 className="text-4xl font-bold text-gray-800 text-center">
              {currentWord.english}
            </h2>
            <button
              className="ml-3 text-gray-400 hover:text-blue-500 focus:outline-none"
              onClick={handleSpeakWord}
            >
              <Volume2 size={24} />
            </button>
          </div>
          <p className="text-gray-500 mt-2 text-center">
            {currentWord.pronunciation}
          </p>
        </div>

        {/* 한국어 뜻 (토글) */}
        {!showAnswer ? (
          <div className="p-8 bg-gray-50 flex items-center justify-center">
            <button
              onClick={toggleAnswer}
              className="flex items-center px-6 py-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
            >
              <Eye size={20} className="mr-2" />
              <span>뜻 보기</span>
            </button>
          </div>
        ) : (
          <div className="p-8 bg-gray-50">
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
              {currentWord.korean}
            </h3>

            <p className="text-gray-600 text-center italic">
              {currentWord.example}
            </p>
          </div>
        )}
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevWord}
          disabled={currentIndex === 0}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            currentIndex === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex space-x-4">
          <button
            onClick={handleKnown}
            className="flex items-center px-6 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
          >
            <Check size={20} className="mr-2" />
            <span>알고 있어요</span>
          </button>

          <button
            onClick={handleUnknown}
            className="flex items-center px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <SkipForward size={20} className="mr-2" />
            <span>모르겠어요</span>
          </button>
        </div>

        <button
          onClick={handleNextWord}
          disabled={currentIndex === totalWords - 1}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            currentIndex === totalWords - 1
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default StudyInterface;