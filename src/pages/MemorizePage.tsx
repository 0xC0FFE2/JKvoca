import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import { ModeSelectionScreen } from "../components/memorize/ModeSelectionScreen";
import { StudyInterface } from "../components/memorize/StudyInterface";
import { useWordStudy } from "../hooks/useWordStudy";
import { Word, StudyMode } from "../types/Types";
import { fetchAllWords, fetchExamWords } from "../services/VocabApiService";
import { BatchSelectionScreen } from "../components/memorize/BatchSelectionScreen";

const MemorizePage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>("englishToKorean");
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [showBatchSelection, setShowBatchSelection] = useState(false);
  const [selectedBatchSize, setSelectedBatchSize] = useState(5);

  // URL에서 ec 파라미터 값 가져오기
  const isExamMode = new URLSearchParams(location.search).get('ec') === 'true';

  // API를 통해 모든 단어 목록 한 번에 불러오기
  useEffect(() => {
    const loadAllWords = async () => {
      if (!vocabId) return;
      
      setLoading(true);
      setError(null);

      try {
        let fetchedWords: Word[];
        if (isExamMode) {
          // 시험 모드일 경우 시험용 API 호출
          fetchedWords = await fetchExamWords(vocabId);
        } else {
          // 일반 모드일 경우 기존 API 호출
          fetchedWords = await fetchAllWords(vocabId);
        }
        
        // 단어 목록을 랜덤으로 섞기
        const shuffledWords = shuffleArray([...fetchedWords]);
        setWords(shuffledWords);
      } catch (err) {
        console.error("단어 목록을 불러오는 중 오류가 발생했습니다:", err);
        setError("단어 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    loadAllWords();
  }, [vocabId, location.search, isExamMode]);

  // 배열을 랜덤하게 섞는 함수
  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const studyHook = useWordStudy({
    initialWords: !showModeSelection && !showBatchSelection ? words : [],
    batchSize: selectedBatchSize,
    studyMode: studyMode,
    vocabId: vocabId
  });

  const { currentWord, userInputs, setUserInputs } = studyHook;

  // 글자 입력 칸 초기화
  useEffect(() => {
    if (currentWord) {
      const targetWord =
        studyMode === "englishToKorean"
          ? currentWord.korean
          : currentWord.english;

      if (targetWord && userInputs.length !== targetWord.length) {
        const newInputs = Array(targetWord.length)
          .fill("")
          .map((_, index) => (targetWord[index] === " " ? " " : ""));
        setUserInputs(newInputs);
      }
    }
  }, [currentWord, studyMode, userInputs.length, setUserInputs]);

  const toggleStudyMode = () => {
    setStudyMode((prev) =>
      prev === "englishToKorean" ? "koreanToEnglish" : "englishToKorean"
    );
    studyHook.setCurrentWordIndex(0);
    setUserInputs([]);
    studyHook.setIsCorrect(null);
    studyHook.setShowAnswer(false);
  };

  // ec 파라미터를 유지하면서 나가기
  const exitMemorizeMode = () => {
    if (isExamMode) {
      navigate(`/vocabulary/${vocabId}?ec=true`);
    } else {
      navigate(`/vocabulary/${vocabId}`);
    }
  };

  const adaptedStudyHook = {
    ...studyHook,
    completedWords: studyHook.incorrectWords.map(id => 
      typeof id === 'string' ? parseInt(id, 10) : id
    ).filter(id => !isNaN(id))
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-4 py-8">
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        {showModeSelection ? (
          <ModeSelectionScreen
            setStudyMode={setStudyMode}
            setShowModeSelection={setShowModeSelection}
            setShowBatchSelection={setShowBatchSelection}
          />
        ) : showBatchSelection ? (
          <BatchSelectionScreen
            selectedBatchSize={selectedBatchSize}
            setSelectedBatchSize={setSelectedBatchSize}
            setShowModeSelection={setShowModeSelection}
            setShowBatchSelection={setShowBatchSelection}
            words={words}
            setCurrentBatch={studyHook.setCurrentBatch}
          />
        ) : (
          <StudyInterface
            vocabId={vocabId || ""}
            words={words}
            studyMode={studyMode}
            toggleStudyMode={toggleStudyMode}
            setShowModeSelection={setShowModeSelection}
            exitMemorizeMode={exitMemorizeMode}
            studyHook={adaptedStudyHook as any}
            isExamMode={isExamMode}
          />
        )}
      </div>
    </Layout>
  );
};

export default MemorizePage;