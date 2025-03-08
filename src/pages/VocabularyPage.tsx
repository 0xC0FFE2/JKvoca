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
} from "lucide-react";
import { speakWord } from "../utils/tts";
import { fetchVocabInfo, fetchWords } from "../services/VocabApiService";
import { Word } from "../types/Types";
import { getBookmarkedWords, toggleWordBookmark, isWordBookmarked } from "../utils/utils";

const VocabularyPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const id = vocabId || "";

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [wordsPerPage, setWordsPerPage] = useState<number>(24);
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<{[key: string]: boolean}>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);

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

        setWords(response.content);
        setTotalWords(response.totalElements);
        setTotalPages(response.totalPages);
        
        // count 값을 덮어쓰지 않도록 제거
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

    speakWord(word.english);

    setTimeout(() => {
      setPlayingWordId(null);
    }, 2000);
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

  const getGridCols = (): string => {
    return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-full mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-full mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
            <button
              className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
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
        <div className="flex flex-col lg:flex-row lg:items-start">
          <div className="hidden lg:block lg:w-64 mr-8 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sticky top-20">
              <h2 className="font-bold text-lg text-gray-800 mb-4">
                단어장 정보
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex items-center">
                  <Book size={16} className="text-blue-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    {info.count}개 단어
                  </span>
                </div>

                <div className="flex items-center">
                  <BarChart size={16} className="text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    난이도: {info.level}
                  </span>
                </div>

                <div className="flex items-center">
                  <Users size={16} className="text-purple-500 mr-2" />
                  <span className="text-sm text-gray-700">
                    카테고리: {info.category}
                  </span>
                </div>

                {Object.keys(bookmarkedWords).length > 0 && (
                  <div className="flex items-center">
                    <Star size={16} className="text-yellow-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      북마크: {Object.keys(bookmarkedWords).length}개
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-medium text-gray-700 mb-2">표시 설정</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">보기 모드</span>
                  <div className="flex border rounded overflow-hidden">
                    <button
                      className={`px-2 py-1 text-xs ${
                        viewMode === "grid"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-50"
                      }`}
                      onClick={() => setViewMode("grid")}
                    >
                      그리드
                    </button>
                    <button
                      className={`px-2 py-1 text-xs ${
                        viewMode === "list"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-50"
                      }`}
                      onClick={() => setViewMode("list")}
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

          <div className="flex-grow">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                  {info.title}
                </h1>
                <p className="text-sm text-gray-600 mb-4 sm:mb-0">
                  {info.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:hidden">
                <div className="flex items-center px-3 py-1 bg-blue-50 rounded">
                  <Book size={14} className="text-blue-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">
                    {info.count}개
                  </span>
                </div>

                <div className="flex items-center px-3 py-1 bg-green-50 rounded">
                  <BarChart size={14} className="text-green-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">
                    {info.level}
                  </span>
                </div>

                <div className="flex items-center px-3 py-1 bg-purple-50 rounded">
                  <Users size={14} className="text-purple-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">
                    {info.category}
                  </span>
                </div>

                {Object.keys(bookmarkedWords).length > 0 && (
                  <div className="flex items-center px-3 py-1 bg-yellow-50 rounded">
                    <Star size={14} className="text-yellow-500 mr-1" />
                    <span className="text-xs font-medium text-gray-700">
                      {Object.keys(bookmarkedWords).length}개
                    </span>
                  </div>
                )}
              </div>
            </div>

            <StudyModeSelector vocabularyId={id} />

            <div className="flex items-center justify-between mb-4 lg:hidden">
              <div className="flex border rounded overflow-hidden">
                <button
                  className={`px-2 py-1 text-xs ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  그리드
                </button>
                <button
                  className={`px-2 py-1 text-xs ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-50"
                  }`}
                  onClick={() => setViewMode("list")}
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

            {words.length === 0 ? (
              <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                단어가 없습니다.
              </div>
            ) : viewMode === "grid" ? (
              <div className={`grid ${getGridCols()} gap-4 mb-6`}>
                {words.map((word) => (
                  <div
                    key={word.id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all ${
                      expandedWordId === word.id
                        ? "ring-2 ring-blue-200"
                        : "hover:border-blue-200"
                    }`}
                  >
                    <div
                      className="p-3 cursor-pointer"
                      onClick={() => toggleExpand(word.id)}
                    >
                      <div className="flex justify-between mb-1">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {word.english}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {word.pronunciation}
                          </p>
                        </div>

                        <div className="flex items-start">
                          <button
                            className={`focus:outline-none ${
                              bookmarkedWords[word.english]
                                ? "text-yellow-500"
                                : "text-gray-300 hover:text-yellow-500"
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

                      <div className="flex justify-between items-center mt-2">
                        <p className="text-gray-700">{word.korean}</p>

                        <div className="flex items-center">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(
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
                            className={`ml-1 focus:outline-none ${
                              playingWordId === word.id
                                ? "text-blue-500 animate-pulse"
                                : "text-gray-400 hover:text-blue-500"
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
                ))}
              </div>
            ) : (
              <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-6">
                        번호
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        영어
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        한국어
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        발음
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16">
                        난이도
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-12">
                        저장
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-12">
                        듣기
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-12">
                        더보기
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {words.map((word) => (
                      <React.Fragment key={word.id}>
                        <tr
                          className={`hover:bg-gray-50 ${
                            expandedWordId === word.id ? "bg-blue-50" : ""
                          }`}
                        >
                          <td className="px-4 py-2.5 text-sm text-gray-500">
                            {word.id}
                          </td>
                          <td className="px-4 py-2.5 text-sm font-medium text-gray-900">
                            {word.english}
                          </td>
                          <td className="px-4 py-2.5 text-sm text-gray-700">
                            {word.korean}
                          </td>
                          <td className="px-4 py-2.5 text-xs text-gray-500">
                            {word.pronunciation}
                          </td>
                          <td className="px-4 py-2.5">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(
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
                          <td className="px-4 py-2.5">
                            <button
                              className={`focus:outline-none ${
                                bookmarkedWords[word.english]
                                  ? "text-yellow-500"
                                  : "text-gray-300 hover:text-yellow-500"
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
                          </td>
                          <td className="px-4 py-2.5">
                            <button
                              className={`focus:outline-none ${
                                playingWordId === word.id
                                  ? "text-blue-500 animate-pulse"
                                  : "text-gray-400 hover:text-blue-500"
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
                              {expandedWordId === word.id ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedWordId === word.id && (
                          <tr className="bg-blue-50">
                            <td
                              className="px-4 py-2 text-xs text-gray-500"
                              colSpan={8}
                            >
                              <div className="pl-3 border-l-2 border-blue-300">
                                <p className="text-xs text-gray-600 italic">
                                  {word.example}
                                </p>
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

            {words.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex items-center justify-between">
                <div className="text-xs text-gray-500">
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
                    className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                      currentPage === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    처음
                  </button>

                  <button
                    onClick={() =>
                      paginate(currentPage > 0 ? currentPage - 1 : 0)
                    }
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                      currentPage === 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
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
                            className={`px-2 py-1 rounded-md text-xs mx-0.5 ${
                              currentPage === pageNumber
                                ? "bg-blue-500 text-white"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
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
                            className="px-1 py-1 text-gray-400"
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
                    className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                      currentPage === totalPages - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    다음
                  </button>

                  <button
                    onClick={() => paginate(totalPages - 1)}
                    disabled={currentPage === totalPages - 1}
                    className={`flex items-center justify-center px-2 py-1 rounded-md text-xs ${
                      currentPage === totalPages - 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
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