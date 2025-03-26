import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Play,
  Pause,
  Settings,
  Speaker,
} from "lucide-react";
import { speakWord } from "../utils/tts";
import {
  fetchVocabInfo,
  fetchWords,
  fetchExamWords,
  getClassroomById,
  fetchAllWords,
} from "../services/VocabApiService";

import { Word } from "../types/Types";
import {
  getBookmarkedWords,
  toggleWordBookmark,
  getCookie,
} from "../utils/utils";
import classroomService from "../services/AdminClassroomService";
import VocaAdmin from "./VocaAdmin";

const speakExample = (text: string, lang: string): void => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
};

const VocabularyPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const id = vocabId || "";

  const searchParams = new URLSearchParams(location.search);
  const isExamMode = searchParams.get("ec") === "true";

  const classroomId = isExamMode ? id : "";

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [wordsPerPage, setWordsPerPage] = useState<number>(24);
  const [expandedWordId, setExpandedWordId] = useState<number | null>(null);
  const [bookmarkedWords, setBookmarkedWords] = useState<{
    [key: string]: boolean;
  }>({});
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const [playingExampleId, setPlayingExampleId] = useState<number | null>(null);

  // 관리자 패널 상태 추가
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

  // 자동 발음 재생 관련 상태 추가
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [currentAutoPlayIndex, setCurrentAutoPlayIndex] = useState<number>(0);
  const autoPlayIntervalRef = useRef<number | null>(null);

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

  const [classroomInfo, setClassroomInfo] = useState<{
    classroomId: string;
    classroomName: string;
    studyingVocabId: string;
    testCount: number;
  }>({
    classroomId: "",
    classroomName: "",
    studyingVocabId: "",
    testCount: 0,
  });

  const [hasAccessToken, setHasAccessToken] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // 단어 목록 필터링
  const filteredWords = showOnlyBookmarked
    ? words.filter((word) => bookmarkedWords[word.english])
    : words;

  // 단어장 접근 권한 확인
  useEffect(() => {
    const accessToken = localStorage.getItem("REFRESH");
    setHasAccessToken(!!accessToken);

    // 임시로 관리자 권한 체크 (실제로는 서버에서 권한 확인 필요)
    const userRole = localStorage.getItem("USER_ROLE") || "";
    setIsAdmin(userRole.includes("ADMIN") || userRole.includes("TEACHER"));

    const savedBookmarks = getBookmarkedWords();
    setBookmarkedWords(savedBookmarks);
  }, []);

  // 단어장 정보 로드
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        if (isExamMode) {
          const classroom = await getClassroomById(classroomId);
          setClassroomInfo({
            classroomId: classroom.classroomId,
            classroomName: classroom.classroomName,
            studyingVocabId: classroom.studyingVocabId,
            testCount: classroom.testCount,
          });

          if (classroom.studyingVocabId) {
            const vocabInfo = await fetchVocabInfo(classroom.studyingVocabId);
            setInfo({
              title: vocabInfo.vocabName || "단어장",
              description: vocabInfo.vocabDescription || "설명 없음",
              level: vocabInfo.vocabLevel || "미정",
              category: vocabInfo.vocabCategory || "기타",
              count: vocabInfo.vocabCount || 0,
            });
          }
        } else {
          const vocabInfo = await fetchVocabInfo(id);
          setInfo({
            title: vocabInfo.vocabName || "단어장",
            description: vocabInfo.vocabDescription || "설명 없음",
            level: vocabInfo.vocabLevel || "미정",
            category: vocabInfo.vocabCategory || "기타",
            count: vocabInfo.vocabCount || 0,
          });
        }
      } catch (err) {
        setError("단어장 정보를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isExamMode, classroomId]);

  // 단어 목록 로드
  useEffect(() => {
    const loadWords = async (): Promise<void> => {
      setLoading(true);
      try {
        if (isExamMode) {
          const examWords = await fetchExamWords(classroomId);
          setWords(examWords);
          setTotalWords(examWords.length);
          setTotalPages(Math.ceil(examWords.length / wordsPerPage));
        } else {
          const response = await fetchWords(id, currentPage, wordsPerPage);

          const wordsWithIndex = response.content.map((word, index) => ({
            ...word,
            wordIndex: currentPage * wordsPerPage + index + 1,
          }));

          setWords(wordsWithIndex);
          setTotalWords(response.totalElements);
          setTotalPages(response.totalPages);
        }
      } catch (err) {
        setError("단어 목록을 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, [id, currentPage, wordsPerPage, isExamMode, classroomId]);

  // 모드 변경 또는 필터링 변경 시 자동 재생 중지
  useEffect(() => {
    stopAutoPlay();
  }, [isExamMode, showOnlyBookmarked]);

  // 자동 재생 효과
  useEffect(() => {
    if (!isAutoPlaying) return;

    const playCurrentWord = () => {
      if (currentAutoPlayIndex >= filteredWords.length) {
        // 모든 단어를 재생했으면 중지
        stopAutoPlay();
        return;
      }

      const currentWord = filteredWords[currentAutoPlayIndex];
      if (currentWord) {
        // 현재 재생 중인 단어 ID 설정 (UI 표시용)
        setPlayingWordId(currentWord.id);

        // 단어 발음 재생
        const utterance = new SpeechSynthesisUtterance(currentWord.english);
        utterance.lang = "en-US";
        utterance.rate = 0.9;

        // 기존 발음 취소 후 재생
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    };

    // 현재 단어 재생
    playCurrentWord();

    // 타이머 설정 - 5초마다 다음 단어 재생
    const timerId = window.setTimeout(() => {
      setCurrentAutoPlayIndex((prevIndex) => prevIndex + 1);
    }, 3400);

    // 컴포넌트 언마운트 또는 의존성 변경 시 정리 함수
    return () => {
      window.clearTimeout(timerId);
    };
  }, [isAutoPlaying, currentAutoPlayIndex, filteredWords]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (autoPlayIntervalRef.current) {
        window.clearTimeout(autoPlayIntervalRef.current);
        autoPlayIntervalRef.current = null;
      }
    };
  }, []);

  // 자동 발음 재생 시작/중지 함수
  const toggleAutoPlay = (): void => {
    if (isAutoPlaying) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  };

  // 자동 발음 재생 시작 함수
  const startAutoPlay = (): void => {
    setIsAutoPlaying(true);
    setCurrentAutoPlayIndex(0);
  };

  // 자동 발음 재생 중지 함수
  const stopAutoPlay = (): void => {
    setIsAutoPlaying(false);
    setPlayingWordId(null);
    setCurrentAutoPlayIndex(0);
    window.speechSynthesis.cancel();
  };

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
    }, 5000);
  };

  const handleNextTest = async (): Promise<void> => {
    setLoading(true);
    try {
      const success = await classroomService.moveToNextTest(classroomId);
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("다음 시험으로 이동 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousTest = async (): Promise<void> => {
    setLoading(true);
    try {
      const success = await classroomService.moveToPreviousTest(classroomId);
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("이전 시험으로 이동 중 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdminPanel = (): void => {
    setShowAdminPanel(true);
  };

  const handleCloseAdminPanel = (): void => {
    setShowAdminPanel(false);
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
      {showAdminPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <VocaAdmin
            words={words}
            classroomId={classroomId}
            onClose={handleCloseAdminPanel}
          />
        </div>
      )}
      <div className="max-w-full mx-auto px-4 py-6">
        <div className="bg-gray-100 rounded-xl p-6 mb-6 text-black">
          <h1 className="text-3xl font-bold mb-2">
            {isExamMode
              ? `${classroomInfo.classroomName || "교실"} - ${info.title} `
              : info.title}
          </h1>

          {isExamMode && classroomInfo.studyingVocabId && (
            <div className="mb-3">
              <Link
                to={`/vocabulary/${classroomInfo.studyingVocabId}`}
                className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <ExternalLink size={16} className="mr-1" /> 원본 단어장 보기
              </Link>
            </div>
          )}

          <p className="text-black-400 mb-4">{info.description}</p>

          <div className="flex flex-wrap gap-4 mt-3">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              <Book size={18} className="mr-2" />
              <span>{words.length}개 단어</span>
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

          {isExamMode && hasAccessToken && (
            <div className="flex flex-wrap mt-4 space-x-4">
              <button
                onClick={handlePreviousTest}
                className="px-4 py-2 bg-white/80 text-indigo-600 font-medium rounded-lg flex items-center shadow-sm hover:bg-white transition-colors"
              >
                <ChevronLeft size={18} className="mr-1" /> 이전 시험
              </button>

              <button
                onClick={handleNextTest}
                className="px-4 py-2 bg-white/80 text-indigo-600 font-medium rounded-lg flex items-center shadow-sm hover:bg-white transition-colors"
              >
                다음 시험 <ChevronRight size={18} className="ml-1" />
              </button>

              <button
                onClick={handleOpenAdminPanel}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-400 text-white font-medium rounded-lg flex items-center shadow-sm hover:bg-amber-600 transition-colors"
              >
                <Speaker size={18} className="mr-1" /> TTS 자동 시험
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
              {/* 전체 단어 발음 재생 버튼 (학습 모드 위에 배치) */}
              <button
                onClick={toggleAutoPlay}
                className={`w-full mb-4 flex items-center justify-center py-3 px-4 rounded-lg ${
                  isAutoPlaying
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                } transition-colors font-bold`}
              >
                {isAutoPlaying ? (
                  <>
                    <Pause size={18} className="mr-2" />
                    <span>
                      발음 재생 중지 ({currentAutoPlayIndex + 1}/
                      {filteredWords.length})
                    </span>
                  </>
                ) : (
                  <>
                    <Play size={18} className="mr-2" />
                    <span>전체 단어 발음 재생</span>
                  </>
                )}
              </button>

              <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <BookOpen size={20} className="text-indigo-600 mr-2" />
                단어장 학습
              </h2>

              {true && (
                <StudyModeSelector vocabularyId={id} isExamMode={isExamMode} />
              )}

              <hr className="my-4 border-gray-200" />

              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <Grid size={18} className="text-indigo-600 mr-2" />
                표시 설정
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">
                    보기 모드
                  </label>
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

                {!isExamMode && (
                  <div>
                    <label className="text-sm text-gray-600 block mb-2">
                      단어 표시 수
                    </label>
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
                )}

                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={showOnlyBookmarked}
                      onChange={() =>
                        setShowOnlyBookmarked(!showOnlyBookmarked)
                      }
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">
                      북마크만 보기
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* 이하 단어 목록 표시 부분은 원본과 동일하게 유지 */}
          <div className="flex-grow">
            {filteredWords.length === 0 ? (
              <div className="p-12 text-center text-gray-500 bg-white rounded-lg shadow-sm border border-gray-100">
                {showOnlyBookmarked
                  ? "북마크한 단어가 없습니다."
                  : "단어가 없습니다."}
              </div>
            ) : viewMode === "grid" ? (
              <div className={`grid ${getGridCols()} gap-4 mb-6`}>
                {filteredWords.map((word) => (
                  <div
                    key={word.id}
                    className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all ${
                      expandedWordId === word.id ? "ring-2 ring-indigo-300" : ""
                    } ${getDifficultyBgColor(word.difficulty)} ${
                      isAutoPlaying && playingWordId === word.id
                        ? "ring-2 ring-indigo-500"
                        : ""
                    }`}
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
                            {word.english.toLowerCase()}
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
                        <p className="text-gray-700 font-medium">
                          {word.korean}
                        </p>

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
                                예문 보기{" "}
                                <ChevronDown size={14} className="ml-1" />
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
                          } ${
                            isAutoPlaying && playingWordId === word.id
                              ? "bg-indigo-100"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-sm text-gray-500 text-center">
                            {word.wordIndex}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {word.english.toLowerCase()}
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

            {filteredWords.length > 0 && !showOnlyBookmarked && !isExamMode && (
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
