import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Word } from '../types/Types';
import { fetchAndShuffleWords, fetchExamWords } from '../services/VocabApiService';

interface UseFlashcardStudyProps {
  vocabId: string | undefined;
}

export const useFlashcardStudy = ({ vocabId }: UseFlashcardStudyProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [knownWords, setKnownWords] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadWords = async () => {
      if (vocabId) {
        setLoading(true);
        try {
          const isExamMode = new URLSearchParams(location.search).get('ec') === 'true';
          
          let fetchedWords: Word[];
          if (isExamMode) {
            fetchedWords = await fetchExamWords(vocabId);
          } else {
            fetchedWords = await fetchAndShuffleWords(vocabId);
          }
          
          setWords(fetchedWords);
          setIsCompleted(false);
        } catch (error) {
          console.error("단어 로딩 중 오류:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadWords();
  }, [vocabId, location.search]);
  
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
  
  const resetFlashcards = async () => {
    if (vocabId) {
      setLoading(true);
      try {
        const isExamMode = new URLSearchParams(location.search).get('ec') === 'true';
        
        let fetchedWords: Word[];
        if (isExamMode) {
          fetchedWords = await fetchExamWords(vocabId);
        } else {
          fetchedWords = await fetchAndShuffleWords(vocabId);
        }
        
        setWords(fetchedWords);
        setCurrentIndex(0);
        setKnownWords([]);
        setIsCompleted(false);
      } catch (error) {
        console.error("단어 리셋 중 오류:", error);
      } finally {
        setLoading(false);
      }
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
    loading,
    goToNextCard,
    goToPrevCard,
    markAsKnown,
    markAsUnknown,
    resetFlashcards,
    exitFlashcardMode
  };
};