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
  EyeOff,
  BookOpen,
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
  isExamMode?: boolean;
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
  const [cardFlipped, setCardFlipped] = useState(false);

  const handleSpeakWord = () => {
    speakWord(currentWord.english);
  };

  const toggleAnswer = () => {
    setCardFlipped(true);
    setTimeout(() => {
      setShowAnswer(true);
      setCardFlipped(false);
    }, 300);
  };

  const hideAnswer = () => {
    setCardFlipped(true);
    setTimeout(() => {
      setShowAnswer(false);
      setCardFlipped(false);
    }, 300);
  };

  const handleNextWord = () => {
    setCardFlipped(true);
    setTimeout(() => {
      setShowAnswer(false);
      setCardFlipped(false);
      onNext();
    }, 300);
  };

  const handlePrevWord = () => {
    setCardFlipped(true);
    setTimeout(() => {
      setShowAnswer(false);
      setCardFlipped(false);
      onPrev();
    }, 300);
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
    <div className="max-w-xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onExit}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={18} className="mr-1" />
          <span className="text-sm">종료</span>
        </button>

        <div className="bg-blue-50 px-3 py-1 rounded-full">
          <span className="text-blue-600 text-sm font-medium">
            {isExamMode ? "플래시카드" : "플래시카드"}
          </span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <RotateCcw size={18} className="mr-1" />
          <span className="text-sm">다시</span>
        </button>
      </div>

      {/* 진행 상태 표시 */}
      <div className="mb-6">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-1">
          <span>진행 상황</span>
          <span className="font-medium">{currentIndex + 1} / {totalWords}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 단어 카드 */}
      <div 
        className={`relative w-full bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transition-all duration-300 transform ${
          cardFlipped ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
        style={{ minHeight: '280px' }}
      >
        {/* 카드 아이콘 */}
        <div className="absolute top-3 left-3 bg-blue-50 rounded-full p-2">
          <BookOpen size={16} className="text-blue-500" />
        </div>

        {/* 영어 단어 (항상 표시) */}
        <div className="pt-10 px-8 pb-6 border-b border-gray-100">
          <div className="flex items-center justify-center">
            <h2 className="text-4xl font-bold text-gray-800 text-center tracking-tight">
              {currentWord.english}
            </h2>
            <button
              className="ml-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
              onClick={handleSpeakWord}
            >
              <Volume2 size={20} />
            </button>
          </div>
          {currentWord.pronunciation && (
            <p className="text-gray-500 mt-2 text-center">
              {currentWord.pronunciation}
            </p>
          )}
        </div>

        {/* 한국어 뜻 (토글) */}
        {!showAnswer ? (
          <div className="p-8 bg-gray-50 flex items-center justify-center" style={{ minHeight: '150px' }}>
            <button
              onClick={toggleAnswer}
              className="flex items-center px-5 py-3 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl transition-colors"
            >
              <Eye size={18} className="mr-2" />
              <span className="font-medium">뜻 보기</span>
            </button>
          </div>
        ) : (
          <div className="p-8 bg-gray-50 flex flex-col items-center justify-center" style={{ minHeight: '150px' }}>
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
              {currentWord.korean}
            </h3>

            {currentWord.example && (
              <p className="text-gray-600 text-center text-sm italic">
                {currentWord.example}
              </p>
            )}

            <button
              onClick={hideAnswer}
              className="mt-4 flex items-center px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <EyeOff size={16} className="mr-1" />
              <span className="text-sm">가리기</span>
            </button>
          </div>
        )}
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePrevWord}
          disabled={currentIndex === 0}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
            currentIndex === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleKnown}
            className="flex items-center px-5 py-3 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl transition-colors"
          >
            <Check size={18} className="mr-2" />
            <span className="font-medium">알고 있어요</span>
          </button>

          <button
            onClick={handleUnknown}
            className="flex items-center px-5 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors"
          >
            <SkipForward size={18} className="mr-2" />
            <span className="font-medium">모르겠어요</span>
          </button>
        </div>

        <button
          onClick={handleNextWord}
          disabled={currentIndex === totalWords - 1}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
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