import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Volume2, ChevronLeft, ChevronRight, X, RotateCcw, Check, SkipForward } from "lucide-react";

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

const FlashcardPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  
  useEffect(() => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);
    }
  }, [vocabId]);
  
  const currentWord = words[currentIndex];
  
  const flipCard = () => {
    setFlipped(!flipped);
  };
  
  const goToNextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    } else if (!reviewMode && words.length > 0) {
      // 모든 카드를 다 본 경우, 복습 모드로 전환할지 묻기
      const unknownWords = words.filter(word => !knownWords.includes(word.id));
      if (unknownWords.length > 0) {
        setReviewMode(true);
        setWords(unknownWords);
        setCurrentIndex(0);
        setFlipped(false);
      }
    }
  };
  
  const goToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlipped(false);
    }
  };
  
  const markAsKnown = () => {
    if (currentWord) {
      setKnownWords([...knownWords, currentWord.id]);
    }
    goToNextCard();
  };
  
  const markAsUnknown = () => {
    goToNextCard();
  };
  
  const exitFlashcardMode = () => {
    navigate(`/vocabulary/${vocabId}`);
  };
  
  const resetFlashcards = () => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);
      setCurrentIndex(0);
      setFlipped(false);
      setKnownWords([]);
      setReviewMode(false);
    }
  };
  
  const progressPercent = words.length > 0 
    ? Math.round(((currentIndex + 1) / words.length) * 100) 
    : 0;
    
  if (!currentWord) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-xl text-gray-600">단어장을 불러오는 중...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={exitFlashcardMode}
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <X size={20} className="mr-1" />
            <span>종료하기</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {reviewMode ? "복습 모드" : "플래시카드 모드"}
            </h1>
            <p className="text-sm text-gray-500">
              {currentIndex + 1} / {words.length} 카드
            </p>
          </div>
          
          <button 
            onClick={resetFlashcards}
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
        
        {/* 플래시카드 */}
        <div 
          className="relative w-full aspect-[3/2] bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer mb-8 transform transition-transform duration-500"
          style={{ 
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
            transformStyle: 'preserve-3d'
          }}
          onClick={flipCard}
        >
          {/* 앞면 (영어) */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden'
            }}
          >
            <div className="flex items-center">
              <h2 className="text-4xl font-bold text-gray-800 text-center">
                {currentWord.english}
              </h2>
              <button className="ml-3 text-gray-400 hover:text-blue-500 focus:outline-none">
                <Volume2 size={24} />
              </button>
            </div>
            <p className="text-gray-500 mt-2">{currentWord.pronunciation}</p>
            
            <div className="mt-8 text-gray-400 text-sm">
              카드를 클릭하여 뒤집기
            </div>
          </div>
          
          {/* 뒷면 (한국어) */}
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden"
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <h2 className="text-4xl font-bold text-gray-800 text-center mb-4">
              {currentWord.korean}
            </h2>
            
            <p className="text-gray-600 text-center mb-6 italic">
              {currentWord.example}
            </p>
            
            <div className="mt-4 text-gray-400 text-sm">
              카드를 클릭하여 뒤집기
            </div>
          </div>
        </div>
        
        {/* 컨트롤 버튼 */}
        <div className="flex justify-between items-center">
          <button 
            onClick={goToPrevCard}
            disabled={currentIndex === 0}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              currentIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex space-x-4">
            <button 
              onClick={markAsKnown}
              className="flex items-center px-6 py-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
            >
              <Check size={20} className="mr-2" />
              <span>알고 있어요</span>
            </button>
            
            <button 
              onClick={markAsUnknown}
              className="flex items-center px-6 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
            >
              <SkipForward size={20} className="mr-2" />
              <span>모르겠어요</span>
            </button>
          </div>
          
          <button 
            onClick={goToNextCard}
            disabled={currentIndex === words.length - 1 && reviewMode}
            className={`flex items-center justify-center w-12 h-12 rounded-full ${
              currentIndex === words.length - 1 && reviewMode 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default FlashcardPage;