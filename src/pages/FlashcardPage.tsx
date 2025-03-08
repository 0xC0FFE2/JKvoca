import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layouts/Layout';
import BatchSelectionScreen from '../components/flashcard/BatchSelectionScreen';
import ModeSelectionScreen from '../components/flashcard/ModeSelectionScreen';
import StudyInterface from '../components/flashcard/StudyInterface';
import { useFlashcardStudy } from '../hooks/useFlashcardStudy';
import { StudyMode } from '../types/Types';

const FlashcardPage: React.FC = () => {
    const { vocabId } = useParams<{ vocabId: string }>();
    const [showModeSelection, setShowModeSelection] = useState(true);
    const [showBatchSelection, setShowBatchSelection] = useState(false);
    const [selectedBatchSize, setSelectedBatchSize] = useState<number | null>(null);
    
    const {
      words,
      currentWord,
      currentIndex,
      knownWords,
      studyMode,
      progressPercent,
      goToNextCard,
      goToPrevCard,
      markAsKnown,
      markAsUnknown,
      resetFlashcards,
      exitFlashcardMode
    } = useFlashcardStudy({ vocabId });
    
    const handleModeSelect = (mode: StudyMode) => {
      if (mode === 'englishToKorean') {
        setShowBatchSelection(true);
      } else {
        setShowModeSelection(false);
      }
    };
    
    const handleBatchSelect = (batchSize: number) => {
      setSelectedBatchSize(batchSize);
      setShowBatchSelection(false);
      setShowModeSelection(false);
    };
    
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
        {showModeSelection ? (
          <ModeSelectionScreen 
            onSelectMode={handleModeSelect}
          />
        ) : showBatchSelection ? (
          <BatchSelectionScreen
            totalWords={words.length}
            onSelectBatch={handleBatchSelect}
          />
        ) : (
          <StudyInterface
            currentWord={currentWord}
            progressPercent={progressPercent}
            currentIndex={currentIndex}
            totalWords={words.length}
            studyMode={studyMode}
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