import React from 'react';
import { StudyMode } from '../../types/Types';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: StudyMode) => void;
}

const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">학습 모드를 선택해주세요</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onSelectMode('englishToKorean')}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">영어 → 한국어</h2>
          <p className="text-gray-600 text-center">
            영어 단어를 보고 한국어 의미를 학습하는 모드입니다.
          </p>
        </button>
        
        <button
          onClick={() => onSelectMode('koreanToEnglish')}
          className="flex flex-col items-center p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">한국어 → 영어</h2>
          <p className="text-gray-600 text-center">
            한국어 의미를 보고 영어 단어를 떠올리는 모드입니다.
          </p>
        </button>
      </div>
    </div>
  );
};

export default ModeSelectionScreen;