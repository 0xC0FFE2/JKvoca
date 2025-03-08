import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
import BatchSelectionScreen from "../components/flashcard/BatchSelectionScreen";
import StudyInterface from "../components/flashcard/StudyInterface";
import { useFlashcardStudy } from "../hooks/useFlashcardStudy";
import ResultScreen from "../components/flashcard/ResultScreen";

const FlashcardPage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const [showBatchSelection, setShowBatchSelection] = useState(true);

  const {
    words,
    currentWord,
    currentIndex,
    knownWords,
    isCompleted,
    progressPercent,
    goToNextCard,
    goToPrevCard,
    markAsKnown,
    markAsUnknown,
    resetFlashcards,
    exitFlashcardMode,
  } = useFlashcardStudy({ vocabId });

  const handleBatchSelect = (batchSize: number) => {
    setShowBatchSelection(false);
  };

  const handleReset = () => {
    resetFlashcards();
    setShowBatchSelection(true);
  };

  if (!currentWord && !isCompleted) {
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
      {showBatchSelection ? (
        <BatchSelectionScreen
          totalWords={words.length}
          onSelectBatch={handleBatchSelect}
        />
      ) : isCompleted ? (
        <ResultScreen
          words={words}
          knownWords={knownWords}
          onReset={handleReset}
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
