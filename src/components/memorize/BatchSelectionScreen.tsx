import React from 'react';
import { Word } from '../../types/Types';

interface BatchSelectionScreenProps {
  selectedBatchSize: number;
  setSelectedBatchSize: React.Dispatch<React.SetStateAction<number>>;
  setShowModeSelection: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBatchSelection: React.Dispatch<React.SetStateAction<boolean>>;
  words: Word[];
  setCurrentBatch: React.Dispatch<React.SetStateAction<Word[]>>;
}

export const BatchSelectionScreen: React.FC<BatchSelectionScreenProps> = ({
  selectedBatchSize,
  setSelectedBatchSize,
  setShowModeSelection,
  setShowBatchSelection,
  words,
  setCurrentBatch,
}) => {
  return (
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
  );
};