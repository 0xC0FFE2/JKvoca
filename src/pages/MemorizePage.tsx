import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import { ModeSelectionScreen } from "../components/memorize/ModeSelectionScreen";
import { StudyInterface } from "../components/memorize/StudyInterface";
import { useWordStudy } from "../hooks/useWordStudy";
import { Word, StudyMode } from "../types/Types";
import { fetchAllWords, fetchExamWords } from "../services/VocabApiService";

const MemorizePage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [allWords, setAllWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<StudyMode>("englishToKorean");
  const [showModeSelection, setShowModeSelection] = useState(true);
  // 상태는 유지하되 실제로는 사용하지 않음
  const [showBatchSelection, setShowBatchSelection] = useState(false);

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
          fetchedWords = await fetchExamWords(vocabId);
        } else {
          fetchedWords = await fetchAllWords(vocabId);
        }
        
        // 단어 목록을 랜덤으로 섞기
        const shuffledWords = shuffleArray([...fetchedWords]);
        setAllWords(shuffledWords);
      } catch (err) {
        console.error("단어 목록을 불러오는 중 오류가 발생했습니다:", err);
        setError("단어 목록을 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    };

    loadAllWords();
  }, [vocabId, isExamMode]);

  const shuffleArray = (array: any[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 실제 학습에 사용할 단어들
  const [activeWords, setActiveWords] = useState<Word[]>([]);

  // 모드 선택 시 activeWords 설정
  const handleModeSelection = (mode: StudyMode) => {
    setStudyMode(mode);
    setShowModeSelection(false);
    
    // 단어 선택 화면 제거 후 바로 모든 단어 설정
    if (allWords.length > 0) {
      setActiveWords(allWords);
    }
  };

  // useWordStudy 호출
  const studyHook = useWordStudy({
    initialWords: activeWords,
    studyMode: studyMode,
    shouldFetch: false  // 이미 모든 단어를 가져왔으므로 API 호출 비활성화
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
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-100 text-red-700 px-6 py-5 rounded-xl">
            <p className="font-medium">{error}</p>
            <button
              className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        </div>
      </Layout>
    );
  }
  
  // 단어가 없는 경우 처리
  if (allWords.length === 0 && !loading) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto px-4 py-8">
          <div className="bg-yellow-50 border border-yellow-100 text-yellow-700 px-6 py-5 rounded-xl text-center">
            <p className="font-medium mb-3">단어가 없습니다</p>
            <p className="text-sm text-yellow-600 mb-4">단어장에 단어를 추가해주세요.</p>
            <button
              className="px-5 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              onClick={() => navigate(`/vocabulary/${vocabId}`)}
            >
              단어장으로 돌아가기
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
            setStudyMode={handleModeSelection}
            setShowModeSelection={setShowModeSelection}
            setShowBatchSelection={setShowBatchSelection}
          />
        ) : (
          <StudyInterface
            vocabId={vocabId || ""}
            words={allWords}
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