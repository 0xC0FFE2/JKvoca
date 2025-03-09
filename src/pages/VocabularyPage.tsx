import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
import StudyModeSelector from "../components/vocabulary/StudyModeSelector";
import {
  Book,
  Users,
  BarChart,
  Volume2,
  Star,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  BookOpen,
  Bookmark,
  MessageCircle,
} from "lucide-react";
import { speakWord } from "../utils/tts";
import { fetchVocabInfo, fetchWords } from "../services/VocabApiService";
import { Word } from "../types/Types";
import { getBookmarkedWords, toggleWordBookmark, isWordBookmarked } from "../utils/utils";

// Add this function to your tts.js utility file
// This function is similar to speakWord but optimized for longer text
const speakExample = (text: string, lang: string): void => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9; // Slightly slower for better comprehension
  window.speechSynthesis.cancel(); // Cancel any ongoing speech
  window.speechSynthesis.speak(utterance);
};

const VocabularyPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const id = vocabId || "";

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [wordsPerPage, setWordsPerPage] = useState<number>(24);
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<{[key: string]: boolean}>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const [playingExampleId, setPlayingExampleId] = useState<number | null>(null);

  const [words, setWords] = useState<Word[]>([]);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [info, setInfo] = useState<{
    title: string;
    description: string;
    count: number;
    level: string;
    category: string;
  }>({
    title: "단어장",
    description: "단어장 설명이 없습니다.",
    count: 0,
    level: "미정",
    category: "기타",
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const savedBookmarks = getBookmarkedWords();
    setBookmarkedWords(savedBookmarks);
  }, []);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const vocabInfo = await fetchVocabInfo(id);
        setInfo({
          title: vocabInfo.vocabName || "단어장",
          description: vocabInfo.vocabDescription || "설명 없음",
          level: vocabInfo.vocabLevel || "미정",
          category: vocabInfo.vocabCategory || "기타",
          count: vocabInfo.vocabCount || 0,
        });
      } catch (err) {
        setError("단어장 정보를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    const loadWords = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await fetchWords(id, currentPage, wordsPerPage);
        
        const wordsWithIndex = response.content.map((word, index) => ({
          ...word,
          wordIndex: currentPage * wordsPerPage + index + 1
        }));

        setWords(wordsWithIndex);
        setTotalWords(response.totalElements);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError("단어 목록을 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [id, currentPage, wordsPerPage]);

  const paginate = (pageNumber: number): void => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const toggleExpand = (id: number): void => {
    setExpandedWordId(expandedWordId === id ? null : id);
  };

  const handleToggleBookmark = (word: Word, event: React.MouseEvent): void => {
    event.stopPropagation();
    
    const updatedBookmarks = toggleWordBookmark(word.english);
    setBookmarkedWords(updatedBookmarks);
  };

  const handleSpeakWord = (word: Word, event: React.MouseEvent): void => {
    event.stopPropagation();
    setPlayingWordId(word.id);
  
    speakWord(word.english, "en-US");
  
    setTimeout(() => {
      setPlayingWordId(null);
    }, 2000);
  };
  
  const handleSpeakExample = (word: Word, event: React.MouseEvent): void => {
    event.stopPropagation();
    setPlayingExampleId(word.id);
  
    speakExample(word.example, "en-US");
  
    setTimeout(() => {
      setPlayingExampleId(null);
    }, 5000); // 예문은 길어서 시간을 좀 더 길게 설정
  };
  
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty.toUpperCase()) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyBgColor = (difficulty: string): string => {
    switch (difficulty.toUpperCase()) {
      case "EASY":
        return "border-l-4 border-green-400";
      case "MEDIUM":
        return "border-l-4 border-yellow-400";
      case "HARD":
        return "border-l-4 border-red-400";
      default:
        return "border-l-4 border-gray-300";
    }
  };

  const getGridCols = (): string => {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  const filteredWords = showOnlyBookmarked
    ? words.filter(word => bookmarkedWords[word.english])
    : words;

  if (loading) {
    return (
      <Layout>
        <div className="max-w-full mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-full mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="bg-gray-100 rounded-xl p-6 mb-6 text-black">
          <h1 className="text-3xl font-bold mb-2">{info.title}</h1>
          <p className="text-black-400 mb-4">{info.description}</p>
          
          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Book size={18} className="mr-2" />
              <span>{info.count}개 단어</span>
            </div>
            
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <BarChart size={18} className="mr-2" />
              <span>난이도: {info.level}</span>
            </div>
            
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Users size={18} className="mr-2" />
              <span>카테고리: {info.category}</span>
            </div>
            
            {Object.keys(bookmarkedWords).length > 0 && (
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                <Bookmark size={18} className="mr-2" />
                <span>북마크: {Object.keys(bookmarkedWords).length}개</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
              <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <BookOpen size={20} className="text-indigo-600 mr-2" />
                단어장 학습
              </h2>

              <StudyModeSelector vocabularyId={id} />

              <hr className="my-4 border-gray-200" />

              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <Grid size={18} className="text-indigo-600 mr-2" />
                표시 설정
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">보기 모드</label>
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      className={`flex-1 py-2 flex justify-center items-center ${
                        viewMode === "grid"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      } transition-colors`}
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid size={16} className="mr-1" />
                      그리드
                    </button>
                    <button
                      className={`flex-1 py-2 flex justify-center items-center ${
                        viewMode === "list"
                          ? "bg-indigo-500 text-white"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      } transition-colors`}
                      onClick={() => setViewMode("list")}
                    >
                      <List size={16} className="mr-1" />
                      리스트
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 block mb-2">단어 표시 수</label>
                  <select
                    className="block w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={wordsPerPage}
                    onChange={(e) => setWordsPerPage(Number(e.target.value))}
                  >
                    <option value={12}>12개씩 보기</option>
                    <option value={24}>24개씩 보기</option>
                    <option value={36}>36개씩 보기</option>
                    <option value={48}>48개씩 보기</option>
                  </select>
                </div>

                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={showOnlyBookmarked}
                      onChange={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">북마크만 보기</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            {filteredWords.length === 0 ? (
              <div className="p-12 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
                {showOnlyBookmarked ? 
                  "북마크한 단어가 없습니다." : 
                  "단어가 없습니다."}
              </div>
            ) : viewMode === "grid" ? (
              <div className={`grid ${getGridCols()} gap-4 mb-6`}>
                {filteredWords.map((word) => (
                  <div
                    key={word.id}
                    className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all ${
                      expandedWordId === word.id
                        ? "ring-2 ring-indigo-300"
                        : ""
                    } ${getDifficultyBgColor(word.difficulty)}`}
                  >
                    <div className="absolute top-2 right-2 text-xs font-medium text-gray-500">
                      #{word.wordIndex}
                    </div>
                    <div
                      className="p-4 cursor-pointer"
                      onClick={() => toggleExpand(word.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-lg text-gray-900">
                            {word.english}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {word.pronunciation}
                          </p>
                        </div>

                        <div className="flex items-center space-x-1 mt-1">
                          <button
                            className={`focus:outline-none p-1.5 rounded-full hover:bg-gray-100 ${
                              playingWordId === word.id
                                ? "text-indigo-500 animate-pulse"
                                : "text-gray-400 hover:text-indigo-500"
                            }`}
                            onClick={(e) => handleSpeakWord(word, e)}
                            title="단어 발음 듣기"
                          >
                            <Volume2 size={16} />
                          </button>
                          
                          <button
                            className={`focus:outline-none p-1.5 rounded-full hover:bg-gray-100 ${
                              bookmarkedWords[word.english]
                                ? "text-amber-500"
                                : "text-gray-400 hover:text-amber-500"
                            }`}
                            onClick={(e) => handleToggleBookmark(word, e)}
                          >
                            <Star
                              size={16}
                              fill={
                                bookmarkedWords[word.english]
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-gray-700 font-medium">{word.korean}</p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                              word.difficulty
                            )}`}
                          >
                            {word.difficulty.toUpperCase() === "EASY"
                              ? "쉬움"
                              : word.difficulty.toUpperCase() === "MEDIUM"
                              ? "보통"
                              : "어려움"}
                          </span>
                          
                          <button
                            className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(word.id);
                            }}
                          >
                            {expandedWordId === word.id ? (
                              <>
                                접기 <ChevronUp size={14} className="ml-1" />
                              </>
                            ) : (
                              <>
                                예문 보기 <ChevronDown size={14} className="ml-1" />
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {expandedWordId === word.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-600 italic leading-relaxed">
                              {word.example}
                            </p>
                            <button
                              className={`focus:outline-none p-1.5 rounded-full hover:bg-gray-100 flex-shrink-0 ml-2 ${
                                playingExampleId === word.id
                                  ? "text-indigo-500 animate-pulse"
                                  : "text-gray-400 hover:text-indigo-500"
                              }`}
                              onClick={(e) => handleSpeakExample(word, e)}
                              title="예문 발음 듣기"
                            >
                              <MessageCircle size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-indigo-50 text-indigo-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16 text-center">
                        번호
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        영어
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        한국어
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider hidden md:table-cell">
                        발음
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-20">
                        난이도
                      </th>
                      <th className="px-4 py-3 text-xs font-medium uppercase tracking-wider w-24 text-center">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredWords.map((word) => (
                      <React.Fragment key={word.id}>
                        <tr
                          className={`hover:bg-gray-50 ${
                            expandedWordId === word.id ? "bg-indigo-50" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-500 text-center">
                            {word.wordIndex}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {word.english}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {word.korean}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">
                            {word.pronunciation}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex text-xs px-2 py-1 rounded-full ${getDifficultyColor(
                                word.difficulty
                              )}`}
                            >
                              {word.difficulty.toUpperCase() === "EASY"
                                ? "쉬움"
                                : word.difficulty.toUpperCase() === "MEDIUM"
                                ? "보통"
                                : "어려움"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                className={`focus:outline-none p-1.5 rounded-full hover:bg-gray-100 ${
                                  bookmarkedWords[word.english]
                                    ? "text-amber-500"
                                    : "text-gray-400 hover:text-amber-500"
                                }`}
                                onClick={(e) => handleToggleBookmark(word, e)}
                              >
                                <Star
                                  size={16}
                                  fill={
                                    bookmarkedWords[word.english]
                                      ? "currentColor"
                                      : "none"
                                  }
                                />
                              </button>
                              
                              <button
                                className={`focus:outline-none p-1.5 rounded-full hover:bg-gray-100 ${
                                  playingWordId === word.id
                                    ? "text-indigo-500 animate-pulse"
                                    : "text-gray-400 hover:text-indigo-500"
                                }`}
                                onClick={(e) => handleSpeakWord(word, e)}
                                title="단어 발음 듣기"
                              >
                                <Volume2 size={16} />
                              </button>
                              
                              <button
                                className="text-gray-400 hover:text-indigo-500 focus:outline-none p-1.5 rounded-full hover:bg-gray-100"
                                onClick={() => toggleExpand(word.id)}
                              >
                                {expandedWordId === word.id ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {expandedWordId === word.id && (
                          <tr className="bg-indigo-50">
                            <td
                              className="px-4 py-3 text-sm text-gray-600"
                              colSpan={6}
                            >
                              <div className="pl-4 border-l-2 border-indigo-400 py-2 flex justify-between items-center">
                                <p className="text-sm text-gray-600 italic">
                                  {word.example}
                                </p>
                                <button
                                  className={`focus:outline-none p-1.5 rounded-full hover:bg-gray-100 flex-shrink-0 ml-2 ${
                                    playingExampleId === word.id
                                      ? "text-indigo-500 animate-pulse"
                                      : "text-gray-400 hover:text-indigo-500"
                                  }`}
                                  onClick={(e) => handleSpeakExample(word, e)}
                                  title="예문 발음 듣기"
                                >
                                  <MessageCircle size={16} />
                                </button>
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
            {filteredWords.length > 0 && !showOnlyBookmarked && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                  <span className="font-medium">
                    {totalWords > 0 ? currentPage * wordsPerPage + 1 : 0}
                  </span>{" "}
                  -{" "}
                  <span className="font-medium">
                    {Math.min((currentPage + 1) * wordsPerPage, totalWords)}
                  </span>{" "}
                  / {totalWords}개 표시 (
                  <span className="font-medium">{currentPage + 1}</span>/
                  {totalPages} 페이지)
                </div>

                <div className="flex items-center">
                  <button
                    onClick={() => paginate(0)}
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm ${
                      currentPage === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    } transition-colors`}
                  >
                    처음
                  </button>

                  <button
                    onClick={() =>
                      paginate(currentPage > 0 ? currentPage - 1 : 0)
                    }
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm mx-1 ${
                      currentPage === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    } transition-colors`}
                  >
                    이전
                  </button>

                  <div className="hidden md:flex">
                    {Array.from({ length: totalPages }, (_, i) => {
                      const pageNumber = i;
                      if (
                        pageNumber === 0 ||
                        pageNumber === totalPages - 1 ||
                        (pageNumber >= currentPage - 2 &&
                          pageNumber <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => paginate(pageNumber)}
                            className={`px-3 py-1.5 rounded-md text-sm mx-1 ${
                              currentPage === pageNumber
                                ? "bg-indigo-500 text-white"
                                : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                            } transition-colors`}
                          >
                            {pageNumber + 1}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 3 ||
                        pageNumber === currentPage + 3
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="px-2 py-1.5 text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() =>
                      paginate(
                        currentPage < totalPages - 1
                          ? currentPage + 1
                          : currentPage
                      )
                    }
                    disabled={currentPage === totalPages - 1}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm mx-1 ${
                      currentPage === totalPages - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    } transition-colors`}
                  >
                    다음
                  </button>

                  <button
                    onClick={() => paginate(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                    className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm ${
                      currentPage === totalPages - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    } transition-colors`}
                  >
                    마지막
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VocabularyPage;