import React from 'react';
import { StudyMode } from '../../types/Types';

interface ModeSelectionScreenProps {
  setStudyMode: React.Dispatch<React.SetStateAction<StudyMode>>;
  setShowModeSelection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBatchSelection: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({
  setStudyMode,
  setShowModeSelection,
  setShowBatchSelection,
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-8 mb-8">
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
  );
};