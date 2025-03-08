import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { ChevronLeft, ChevronRight, X, Volume2, Check, Eye, EyeOff, Save } from "lucide-react";

interface Word {
  id: number;
  english: string;
  korean: string;
  example: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 예시 데이터
const getVocabulary = (id: string): Word[] => {
  return Array(50).fill(null).map((_, index) => ({
    id: index + 1,
    english: `Word ${index + 1}`,
    korean: `단어 ${index + 1}`,
    example: `This is an example sentence using Word ${index + 1}.`,
    pronunciation: `/wɜːrd ${index + 1}/`,
    difficulty: index % 3 === 0 ? 'easy' : (index % 3 === 1 ? 'medium' : 'hard')
  }));
};

const MemorizePage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleWords, setVisibleWords] = useState<number[]>([]);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  
  // 현재 표시할 단어들 (5개씩)
  const [currentBatch, setCurrentBatch] = useState<Word[]>([]);
  const batchSize = 5;
  
  useEffect(() => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);
      // 첫 배치 설정
      setCurrentBatch(fetchedWords.slice(0, batchSize));
    }
  }, [vocabId]);
  
  const toggleWordVisibility = (wordId: number) => {
    if (visibleWords.includes(wordId)) {
      setVisibleWords(visibleWords.filter(id => id !== wordId));
    } else {
      setVisibleWords([...visibleWords, wordId]);
    }
  };
  
  const markAsCompleted = (wordId: number) => {
    if (!completedWords.includes(wordId)) {
      setCompletedWords([...completedWords, wordId]);
    }
  };
  
  const markAllAsCompleted = () => {
    const ids = currentBatch.map(word => word.id);
    setCompletedWords([...completedWords, ...ids]);
  };
  
  const showNextBatch = () => {
    const nextBatchStart = currentIndex + batchSize;
    if (nextBatchStart < words.length) {
      setCurrentIndex(nextBatchStart);
      setCurrentBatch(words.slice(nextBatchStart, nextBatchStart + batchSize));
      setVisibleWords([]);
    }
  };
  
  const showPrevBatch = () => {
    const prevBatchStart = currentIndex - batchSize;
    if (prevBatchStart >= 0) {
      setCurrentIndex(prevBatchStart);
      setCurrentBatch(words.slice(prevBatchStart, prevBatchStart + batchSize));
      setVisibleWords([]);
    }
  };
  
  const exitMemorizeMode = () => {
    navigate(`/vocabulary/${vocabId}`);
  };
  
  const saveProgress = () => {
    // 실제로는 API 호출 등으로 진행 상황을 저장
    alert('진행 상황이 저장되었습니다.');
  };
  
  // 진행률 계산
  const progressPercent = words.length > 0
    ? Math.round((completedWords.length / words.length) * 100)
    : 0;
  
  const totalBatches = Math.ceil(words.length / batchSize);
  const currentBatchNumber = Math.floor(currentIndex / batchSize) + 1;
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={exitMemorizeMode}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <X size={20} className="mr-1" />
            <span>종료하기</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              암기 모드
            </h1>
            <p className="text-sm text-gray-500">
              배치 {currentBatchNumber} / {totalBatches}
            </p>
          </div>
          
          <button 
            onClick={saveProgress}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <Save size={20} className="mr-1" />
            <span>저장하기</span>
          </button>
        </div>
        
        {/* 진행바 */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
          <div 
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-500">
            진행률: {progressPercent}% ({completedWords.length}/{words.length} 단어)
          </p>
          
          <div className="flex items-center">
            <button 
              onClick={() => setShowHint(!showHint)}
              className="flex items-center text-gray-600 hover:text-blue-600 mr-4"
            >
              {showHint ? (
                <>
                  <EyeOff size={18} className="mr-1" />
                  <span>힌트 숨기기</span>
                </>
              ) : (
                <>
                  <Eye size={18} className="mr-1" />
                  <span>힌트 보기</span>
                </>
              )}
            </button>
            
            <button
              onClick={markAllAsCompleted}
              className="flex items-center px-3 py-1 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
            >
              <Check size={18} className="mr-1" />
              <span>모두 완료</span>
            </button>
          </div>
        </div>
        
        {/* 단어 카드 배치 */}
        <div className="space-y-4 mb-8">
          {currentBatch.map((word) => (
            <div 
              key={word.id} 
              className={`p-6 bg-white rounded-xl shadow-sm border ${
                completedWords.includes(word.id) 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-100 hover:shadow-md'
              } transition-all`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-1">
                    <h3 className="text-xl font-medium text-gray-900">
                      {word.english}
                    </h3>
                    <button className="ml-2 text-gray-400 hover:text-blue-500 focus:outline-none">
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{word.pronunciation}</p>
                  
                  {/* 한국어 의미 - 토글 가능 */}
                  <div 
                    className="flex items-center cursor-pointer mb-1"
                    onClick={() => toggleWordVisibility(word.id)}
                  >
                    <div className="mr-2">
                      {visibleWords.includes(word.id) ? (
                        <EyeOff size={16} className="text-gray-400" />
                      ) : (
                        <Eye size={16} className="text-gray-400" />
                      )}
                    </div>
                    
                    <p className="text-lg text-gray-700">
                      {visibleWords.includes(word.id) || showHint ? (
                        word.korean
                      ) : (
                        <span className="text-gray-300">클릭하여 의미 보기</span>
                      )}
                    </p>
                  </div>
                  
                  {/* 예문 - 힌트로 보기 가능 */}
                  {(visibleWords.includes(word.id) || showHint) && (
                    <p className="text-sm text-gray-600 italic mt-2 pl-3 border-l-2 border-gray-200">
                      {word.example}
                    </p>
                  )}
                </div>
                
                <button 
                  onClick={() => markAsCompleted(word.id)}
                  className={`p-2 rounded-full ${
                    completedWords.includes(word.id)
                      ? 'bg-green-100 text-green-500'
                      : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-500'
                  }`}
                >
                  <Check size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* 배치 네비게이션 */}
        <div className="flex justify-between items-center">
          <button 
            onClick={showPrevBatch}
            disabled={currentIndex === 0}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentIndex === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} className="mr-1" />
            <span>이전</span>
          </button>
          
          <button 
            onClick={showNextBatch}
            disabled={currentIndex + batchSize >= words.length}
            className={`flex items-center px-4 py-2 rounded-lg ${
              currentIndex + batchSize >= words.length
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span>다음</span>
            <ChevronRight size={20} className="ml-1" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default MemorizePage;