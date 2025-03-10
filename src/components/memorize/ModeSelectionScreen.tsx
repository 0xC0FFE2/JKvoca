import React from 'react';
import { StudyMode } from '../../types/Types';
import { BookOpen, ArrowRightLeft } from 'lucide-react';

interface ModeSelectionScreenProps {
  setStudyMode: (mode: StudyMode) => void;
  setShowModeSelection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBatchSelection: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  setStudyMode,
  setShowModeSelection,
  setShowBatchSelection, // 사용하지 않지만 호환성을 위해 유지
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 mb-8">
      <div className="flex justify-center mb-6">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
          <BookOpen size={24} className="text-blue-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-3">
        학습 모드 선택
      </h2>
      <p className="text-gray-500 text-center mb-8">
        어떤 방식으로 단어를 학습하시겠습니까?
      </p>
      
      <div className="space-y-4">
        <button
          onClick={() => {
            setStudyMode("englishToKorean");
            setShowModeSelection(false);
          }}
          className="w-full py-4 px-5 bg-white border-2 border-blue-100 hover:border-blue-200 text-gray-800 rounded-xl flex items-center transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
            <ArrowRightLeft size={20} className="text-blue-600" />
          </div>
          <div className="text-left">
            <span className="block text-lg font-medium">영어 → 한국어</span>
            <span className="text-sm text-gray-500">
              영어 단어를 보고 한국어 뜻 맞추기
            </span>
          </div>
        </button>
        
        <button
          onClick={() => {
            setStudyMode("koreanToEnglish");
            setShowModeSelection(false);
          }}
          className="w-full py-4 px-5 bg-white border-2 border-green-100 hover:border-green-200 text-gray-800 rounded-xl flex items-center transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-100 transition-colors">
            <ArrowRightLeft size={20} className="text-green-600" />
          </div>
          <div className="text-left">
            <span className="block text-lg font-medium">한국어 → 영어</span>
            <span className="text-sm text-gray-500">
              한국어 뜻을 보고 영어 단어 맞추기
            </span>
          </div>
        </button>
        
        <div className="pt-4">
          <button
            onClick={() => window.history.back()}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    </div>
  );
};