import React from 'react';

interface BatchSelectionScreenProps {
  totalWords: number;
  onSelectBatch: (batchSize: number) => void;
}

const BatchSelectionScreen: React.FC<BatchSelectionScreenProps> = ({
  totalWords,
  onSelectBatch,
}) => {
  const batchSizes = [10, 20, totalWords];
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">학습할 단어 개수를 선택해주세요</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {batchSizes.map((size) => (
          <button
            key={size}
            onClick={() => onSelectBatch(size)}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-blue-600">{size}</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">
              {size === totalWords ? '전체 단어' : `${size}개씩`}
            </h2>
            <p className="text-gray-600 text-center text-sm">
              {size === totalWords
                ? '모든 단어를 한 번에 학습합니다.'
                : `총 ${Math.ceil(totalWords / size)}세트로 나누어 학습합니다.`}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BatchSelectionScreen;