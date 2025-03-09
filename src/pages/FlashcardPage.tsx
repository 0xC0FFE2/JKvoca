import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
import StudyInterface from "../components/flashcard/StudyInterface";
import { useFlashcardStudy } from "../hooks/useFlashcardStudy";
import ResultScreen from "../components/flashcard/ResultScreen";

const FlashcardPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();

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
          onExit={exitFlashcardMode}
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
          onExit={exitFlashcardMode}
        />
      )}
    </Layout>
  );
};

export default FlashcardPage;