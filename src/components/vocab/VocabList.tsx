import React from 'react';
import { Trash } from 'lucide-react';
import { Vocab } from '../../types/Vocab';

interface VocabListProps {
  vocabs: Vocab[];
  selectedVocab: Vocab | null;
  loading: boolean;
  onSelectVocab: (vocab: Vocab) => void;
  onDeleteVocab: (vocabId: string) => void;
}

const VocabList: React.FC<VocabListProps> = ({
  vocabs,
  selectedVocab,
  loading,
  onSelectVocab,
  onDeleteVocab
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">단어장 목록</h2>
      {loading ? (
        <div className="py-6 text-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      ) : vocabs.length > 0 ? (
        <div className="space-y-2">
          {vocabs.map((vocab) => (
            <div 
              key={vocab.vocabId}
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors flex justify-between ${
                selectedVocab?.vocabId === vocab.vocabId ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
              onClick={() => onSelectVocab(vocab)}
            >
              <div>
                <h3 className="font-medium text-gray-800">{vocab.vocabName}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
                    {vocab.vocabLevel}
                  </span>
                  <span className="text-xs text-gray-500">
                    {vocab.wordCount}개 단어
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteVocab(vocab.vocabId);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">단어장이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default VocabList;