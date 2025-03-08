import React from 'react';
import { Volume2, ChevronLeft, ChevronRight, X, RotateCcw, Check, SkipForward } from 'lucide-react';
import { Word, StudyMode } from '../../types/Types';
import { speakWord } from '../../utils/tts';

interface StudyInterfaceProps {
  currentWord: Word;
  progressPercent: number;
  currentIndex: number;
  totalWords: number;
  studyMode: StudyMode;
  onPrev: () => void;
  onNext: () => void;
  onKnown: () => void;
  onUnknown: () => void;
  onReset: () => void;
  onExit: () => void;
}

const StudyInterface: React.FC<StudyInterfaceProps> = ({
  currentWord,
  progressPercent,
  currentIndex,
  totalWords,
  studyMode,
  onPrev,
  onNext,
  onKnown,
  onUnknown,
  onReset,
  onExit
}) => {
  const handleSpeakWord = () => {
    speakWord(currentWord.english);
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
            {studyMode === 'koreanToEnglish' ? "한국어 → 영어 모드" : "영어 → 한국어 모드"}
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
      
      {/* 단어 카드 (뒤집기 없이) */}
      <div className="w-full bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* 상단: 영어 단어 */}
        <div className="p-6 border-b border-gray-200">
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
          <p className="text-gray-500 mt-2 text-center">{currentWord.pronunciation}</p>
        </div>
        
        {/* 하단: 한국어 뜻 */}
        <div className="p-6 bg-gray-50">
          <h3 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {currentWord.korean}
          </h3>
          
          <p className="text-gray-600 text-center italic">
            {currentWord.example}
          </p>
        </div>
      </div>
      
      {/* 컨트롤 버튼 */}
      <div className="flex justify-between items-center">
        <button 
          onClick={onPrev}
          disabled={currentIndex === 0}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex space-x-4">
          <button 
            onClick={onKnown}
            className="flex items-center px-6 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
          >
            <Check size={20} className="mr-2" />
            <span>알고 있어요</span>
          </button>
          
          <button 
            onClick={onUnknown}
            className="flex items-center px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
          >
            <SkipForward size={20} className="mr-2" />
            <span>모르겠어요</span>
          </button>
        </div>
        
        <button 
          onClick={onNext}
          disabled={currentIndex === totalWords - 1 && studyMode === 'koreanToEnglish'}
          className={`flex items-center justify-center w-12 h-12 rounded-full ${
            currentIndex === totalWords - 1 && studyMode === 'koreanToEnglish' 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default StudyInterface;