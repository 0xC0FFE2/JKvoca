import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word } from '../types/Types';
import { getVocabulary } from '../utils/tts';

interface UseFlashcardStudyProps {
  vocabId: string | undefined;
}

export const useFlashcardStudy = ({ vocabId }: UseFlashcardStudyProps) => {
  const navigate = useNavigate();
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useEffect(() => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);
      setIsCompleted(false);
    }
  }, [vocabId]);
  
  const currentWord = words[currentIndex];
  
  const goToNextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };
  
  const goToPrevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const markAsKnown = () => {
    if (currentWord) {
      setKnownWords([...knownWords, currentWord.id]);
    }
    goToNextCard();
  };
  
  const markAsUnknown = () => {
    goToNextCard();
  };
  
  const resetFlashcards = () => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);
      setCurrentIndex(0);
      setKnownWords([]);
      setIsCompleted(false);
    }
  };
  
  const exitFlashcardMode = () => {
    navigate(`/vocabulary/${vocabId}`);
  };
  
  const progressPercent = words.length > 0 
    ? Math.round(((currentIndex + 1) / words.length) * 100) 
    : 0;
    
  return {
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
    exitFlashcardMode
  };
};