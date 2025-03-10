import React from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../layouts/Layout";
import StudyInterface from "../components/flashcard/StudyInterface";
import { useFlashcardStudy } from "../hooks/useFlashcardStudy";
import ResultScreen from "../components/flashcard/ResultScreen";

const FlashcardPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const location = useLocation();
  
  // URL에서 ec 파라미터 값 가져오기
  const isExamMode = new URLSearchParams(location.search).get('ec') === 'true';

  const {
    words,
    currentWord,
    currentIndex,
    knownWords,
    isCompleted,
    progressPercent,
    loading,
    goToNextCard,
    goToPrevCard,
    markAsKnown,
    markAsUnknown,
    resetFlashcards,
    exitFlashcardMode,
  } = useFlashcardStudy({ vocabId });

  // ec 파라미터 값을 유지하면서 나가는 함수
  const handleExit = () => {
    if (isExamMode) {
      // exitFlashcardMode 함수를 직접 호출하지 않고 ec 파라미터를 유지한 채 나가기
      window.location.href = `/vocabulary/${vocabId}?ec=true`;
    } else {
      // 일반 모드일 때는 기존 함수 사용
      exitFlashcardMode();
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-xl text-gray-600">단어장을 불러오는 중...</p>
        </div>
      </Layout>
    );
  }

  if (!currentWord && !isCompleted) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-96">
          <p className="text-xl text-gray-600">단어를 불러올 수 없습니다.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isCompleted ? (
        <ResultScreen
          words={words}
          knownWords={knownWords}
          onReset={resetFlashcards}
          onExit={handleExit}
          isExamMode={isExamMode}
        />
      ) : (
        <StudyInterface
          currentWord={currentWord}
          progressPercent={progressPercent}
          currentIndex={currentIndex}
          totalWords={words.length}
          onPrev={goToPrevCard}
          onNext={goToNextCard}
          onKnown={markAsKnown}
          onUnknown={markAsUnknown}
          onReset={resetFlashcards}
          onExit={handleExit}
          isExamMode={isExamMode}
        />
      )}
    </Layout>
  );
};

export default FlashcardPage;