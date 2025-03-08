import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
import StudyModeSelector from "../components/vocabulary/StudyModeSelector";
import { Book, Users, BarChart, Volume2, Star, ChevronDown, ChevronUp } from "lucide-react";

// TTS 유틸리티 임포트
import { speakWord } from "../utils/tts";

interface Word {
  id: number;
  english: string;
  korean: string;
  example: string;
  pronunciation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

// 예시 데이터
const dummyWords: Record<string, Word[]> = {
  "toeic-100": Array(100).fill(null).map((_, index) => ({
    id: index + 1,
    english: `Word ${index + 1}`,
    korean: `단어 ${index + 1}`,
    example: `This is an example sentence using Word ${index + 1}.`,
    pronunciation: `/wɜːrd ${index + 1}/`,
    difficulty: index % 3 === 0 ? 'easy' : (index % 3 === 1 ? 'medium' : 'hard')
  })),
  "business-basic": Array(150).fill(null).map((_, index) => ({
    id: index + 1,
    english: `Business Term ${index + 1}`,
    korean: `비즈니스 용어 ${index + 1}`,
    example: `In a business context, you can use Business Term ${index + 1} like this.`,
    pronunciation: `/ˈbɪznɪs tɜːrm ${index + 1}/`,
    difficulty: index % 3 === 0 ? 'easy' : (index % 3 === 1 ? 'medium' : 'hard')
  })),
};

// 단어장 정보
const vocabularyInfo: Record<string, {
  title: string;
  description: string;
  count: number;
  level: string;
  category: string;
}> = {
  "toeic-100": {
    title: "토익 100 단어장",
    description: "토익 시험에 자주 출제되는 핵심 단어 100개 모음",
    count: 100,
    level: "초급",
    category: "시험대비"
  },
  "business-basic": {
    title: "비즈니스 영어 기초 단어장",
    description: "직장 생활에 필요한 기본 비즈니스 영어 단어 모음",
    count: 150,
    level: "초급",
    category: "비즈니스"
  }
};

const VocabularyPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const id = vocabId || "";
  
  const [currentPage, setCurrentPage] = useState(1);
  const [wordsPerPage, setWordsPerPage] = useState(24); // PC에서 더 많은 단어 표시
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // 그리드/리스트 뷰 모드 추가
  const [playingWordId, setPlayingWordId] = useState<number | null>(null); // 재생 중인 단어 ID
  
  // 현재 단어장의 단어 목록과 정보
  const words = dummyWords[id] || [];
  const info = vocabularyInfo[id] || {
    title: "단어장",
    description: "단어장 설명이 없습니다.",
    count: 0,
    level: "미정",
    category: "기타"
  };
  
  // 현재 페이지의 단어들만 추출
  const indexOfLastWord = currentPage * wordsPerPage;
  const indexOfFirstWord = indexOfLastWord - wordsPerPage;
  const currentWords = words.slice(indexOfFirstWord, indexOfLastWord);
  
  // 페이지 변경 핸들러
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 페이지 상단으로 스크롤
    window.scrollTo(0, 0);
  };
  
  const toggleExpand = (id: number) => {
    setExpandedWordId(expandedWordId === id ? null : id);
  };

  const toggleBookmark = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setBookmarkedWords(prev => 
      prev.includes(id) 
        ? prev.filter(wordId => wordId !== id) 
        : [...prev, id]
    );
  };

  // 단어 발음 재생 함수
  const handleSpeakWord = (word: Word, event: React.MouseEvent) => {
    event.stopPropagation(); // 이벤트 전파 방지
    setPlayingWordId(word.id);
    
    // 단어 재생
    speakWord(word.english);
    
    // 재생 상태 표시를 위한 타이머 (약 2초)
    setTimeout(() => {
      setPlayingWordId(null);
    }, 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // 디바이스 크기에 따라 그리드 열 수 조정
  const getGridCols = () => {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };
  
  return (
    <Layout>
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-start">
          {/* 좌측 사이드바 (PC에서만 표시) */}
          <div className="hidden lg:block lg:w-64 mr-8 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-20">
              <h2 className="font-bold text-lg text-gray-800 mb-4">단어장 정보</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Book size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700">{info.count}개 단어</span>
                </div>
                
                <div className="flex items-center">
                  <BarChart size={16} className="text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">난이도: {info.level}</span>
                </div>
                
                <div className="flex items-center">
                  <Users size={16} className="text-purple-500 mr-2" />
                  <span className="text-sm text-gray-700">카테고리: {info.category}</span>
                </div>
              </div>
              
              <h3 className="font-medium text-gray-700 mb-2">표시 설정</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">보기 모드</span>
                  <div className="flex border rounded overflow-hidden">
                    <button 
                      className={`px-2 py-1 text-xs ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}
                      onClick={() => setViewMode('grid')}
                    >
                      그리드
                    </button>
                    <button 
                      className={`px-2 py-1 text-xs ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}
                      onClick={() => setViewMode('list')}
                    >
                      리스트
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">단어 표시 수</span>
                  <select 
                    className="text-xs border rounded px-1 py-1"
                    value={wordsPerPage}
                    onChange={(e) => setWordsPerPage(Number(e.target.value))}
                  >
                    <option value={12}>12개</option>
                    <option value={24}>24개</option>
                    <option value={36}>36개</option>
                    <option value={48}>48개</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-grow">
            {/* 단어장 헤더 */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">{info.title}</h1>
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">{info.description}</p>
              </div>
              
              {/* 모바일에서만 표시되는 정보 */}
              <div className="flex flex-wrap gap-2 lg:hidden">
                <div className="flex items-center px-3 py-1 bg-blue-50 rounded">
                  <Book size={14} className="text-blue-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">{info.count}개</span>
                </div>
                
                <div className="flex items-center px-3 py-1 bg-green-50 rounded">
                  <BarChart size={14} className="text-green-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">{info.level}</span>
                </div>
                
                <div className="flex items-center px-3 py-1 bg-purple-50 rounded">
                  <Users size={14} className="text-purple-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">{info.category}</span>
                </div>
              </div>
            </div>
            
            {/* 학습 모드 선택 */}
            <StudyModeSelector vocabularyId={id} />
            
            {/* 모바일에서 표시 설정 */}
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <div className="flex border rounded overflow-hidden">
                <button 
                  className={`px-2 py-1 text-xs ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}
                  onClick={() => setViewMode('grid')}
                >
                  그리드
                </button>
                <button 
                  className={`px-2 py-1 text-xs ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-50'}`}
                  onClick={() => setViewMode('list')}
                >
                  리스트
                </button>
              </div>
              
              <select 
                className="text-xs border rounded px-2 py-1"
                value={wordsPerPage}
                onChange={(e) => setWordsPerPage(Number(e.target.value))}
              >
                <option value={12}>12개씩 보기</option>
                <option value={24}>24개씩 보기</option>
                <option value={36}>36개씩 보기</option>
              </select>
            </div>
            
            {/* 단어 목록 */}
            {viewMode === 'grid' ? (
              // 그리드 뷰
              <div className={`grid ${getGridCols()} gap-4 mb-6`}>
                {currentWords.length > 0 ? (
                  currentWords.map((word) => (
                    <div 
                      key={word.id} 
                      className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all ${
                        expandedWordId === word.id ? 'ring-2 ring-blue-200' : 'hover:border-blue-200'
                      }`}
                    >
                      <div 
                        className="p-3 cursor-pointer"
                        onClick={() => toggleExpand(word.id)}
                      >
                        <div className="flex justify-between mb-1">
                          <div>
                            <h3 className="font-medium text-gray-900">{word.english}</h3>
                            <p className="text-xs text-gray-500">{word.pronunciation}</p>
                          </div>
                          
                          <div className="flex items-start">
                            <button 
                              className={`focus:outline-none ${
                                bookmarkedWords.includes(word.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                              }`}
                              onClick={(e) => toggleBookmark(word.id, e)}
                            >
                              <Star size={16} fill={bookmarkedWords.includes(word.id) ? "currentColor" : "none"} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-gray-700">{word.korean}</p>
                          
                          <div className="flex items-center">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(word.difficulty)}`}>
                              {word.difficulty === 'easy' ? '쉬움' : word.difficulty === 'medium' ? '보통' : '어려움'}
                            </span>
                            
                            <button 
                              className={`ml-1 focus:outline-none ${
                                playingWordId === word.id 
                                  ? 'text-blue-500 animate-pulse' 
                                  : 'text-gray-400 hover:text-blue-500'
                              }`}
                              onClick={(e) => handleSpeakWord(word, e)}
                              title="단어 발음 듣기"
                            >
                              <Volume2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        {expandedWordId === word.id && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-600 italic">
                              {word.example}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                    단어가 없습니다.
                  </div>
                )}
              </div>
            ) : (
              // 리스트 뷰 (테이블 형식)
              <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-6">번호</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">영어</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">한국어</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">발음</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">난이도</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-12">저장</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-12">듣기</th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-12">더보기</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentWords.map((word) => (
                      <React.Fragment key={word.id}>
                        <tr className={`hover:bg-gray-50 ${expandedWordId === word.id ? 'bg-blue-50' : ''}`}>
                          <td className="px-4 py-2.5 text-sm text-gray-500">{word.id}</td>
                          <td className="px-4 py-2.5 text-sm font-medium text-gray-900">{word.english}</td>
                          <td className="px-4 py-2.5 text-sm text-gray-700">{word.korean}</td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">{word.pronunciation}</td>
                          <td className="px-4 py-2.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(word.difficulty)}`}>
                              {word.difficulty === 'easy' ? '쉬움' : word.difficulty === 'medium' ? '보통' : '어려움'}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <button 
                              className={`focus:outline-none ${
                                bookmarkedWords.includes(word.id) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'
                              }`}
                              onClick={(e) => toggleBookmark(word.id, e)}
                            >
                              <Star size={16} fill={bookmarkedWords.includes(word.id) ? "currentColor" : "none"} />
                            </button>
                          </td>
                          <td className="px-4 py-2.5">
                            <button 
                              className={`focus:outline-none ${
                                playingWordId === word.id 
                                  ? 'text-blue-500 animate-pulse' 
                                  : 'text-gray-400 hover:text-blue-500'
                              }`}
                              onClick={(e) => handleSpeakWord(word, e)}
                              title="단어 발음 듣기"
                            >
                              <Volume2 size={16} />
                            </button>
                          </td>
                          <td className="px-4 py-2.5">
                            <button 
                              className="text-gray-400 hover:text-blue-500 focus:outline-none"
                              onClick={() => toggleExpand(word.id)}
                            >
                              {expandedWordId === word.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </td>
                        </tr>
                        {expandedWordId === word.id && (
                          <tr className="bg-blue-50">
                            <td className="px-4 py-2 text-xs text-gray-500" colSpan={8}>
                              <div className="pl-3 border-l-2 border-blue-300">
                                <p className="text-xs text-gray-600 italic">{word.example}</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* 페이지네이션 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex items-center justify-between">
              {/* 현재 위치 정보 */}
              <div className="text-xs text-gray-500">
                <span className="font-medium">{indexOfFirstWord + 1}</span> - <span className="font-medium">{Math.min(indexOfLastWord, words.length)}</span> / {words.length}개 표시
                (<span className="font-medium">{currentPage}</span>/{Math.ceil(words.length / wordsPerPage)} 페이지)
              </div>
              
              {/* 페이지네이션 */}
              <div className="flex items-center">
                <button
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  처음
                </button>
                
                <button
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  이전
                </button>
                
                <div className="hidden md:flex">
                  {Array.from({ length: Math.ceil(words.length / wordsPerPage) }, (_, i) => {
                    const pageNumber = i + 1;
                    // 현재 페이지 주변의 5개 페이지만 표시
                    if (
                      pageNumber === 1 || 
                      pageNumber === Math.ceil(words.length / wordsPerPage) ||
                      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => paginate(pageNumber)}
                          className={`px-2 py-1 rounded-md text-xs mx-0.5 ${
                            currentPage === pageNumber
                              ? "bg-blue-500 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 3 ||
                      pageNumber === currentPage + 3
                    ) {
                      return <span key={pageNumber} className="px-1 py-1 text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>
                
                <button
                  onClick={() => paginate(currentPage < Math.ceil(words.length / wordsPerPage) ? currentPage + 1 : currentPage)}
                  disabled={currentPage === Math.ceil(words.length / wordsPerPage)}
                  className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                    currentPage === Math.ceil(words.length / wordsPerPage)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  다음
                </button>
                
                <button
                  onClick={() => paginate(Math.ceil(words.length / wordsPerPage))}
                  disabled={currentPage === Math.ceil(words.length / wordsPerPage)}
                  className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                    currentPage === Math.ceil(words.length / wordsPerPage)
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  마지막
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VocabularyPage;