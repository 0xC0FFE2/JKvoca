import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Word, StudyMode } from '../types/Types';
import { getVocabulary } from '../utils/tts';

interface UseFlashcardStudyProps {
  vocabId: string | undefined;
}

export const useFlashcardStudy = ({ vocabId }: UseFlashcardStudyProps) => {
  const navigate = useNavigate();
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>('englishToKorean');
  
  useEffect(() => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);
    }
  }, [vocabId]);
  
  const currentWord = words[currentIndex];
  
  const goToNextCard = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (studyMode === 'englishToKorean' && words.length > 0) {
      const unknownWords = words.filter(word => !knownWords.includes(word.id));
      if (unknownWords.length > 0) {
        setStudyMode('koreanToEnglish');
        setWords(unknownWords);
        setCurrentIndex(0);
      }
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
      setStudyMode('englishToKorean');
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
    studyMode,
    progressPercent,
    goToNextCard,
    goToPrevCard,
    markAsKnown,
    markAsUnknown,
    resetFlashcards,
    exitFlashcardMode
  };
};