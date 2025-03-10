import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Word, StudyMode } from '../types/Types';
import { fetchAndShuffleWords, fetchExamWords } from '../services/VocabApiService';

interface UseWordStudyProps {
  vocabId?: string;
  initialWords?: Word[];
  batchSize?: number;
  studyMode?: StudyMode;
  shouldFetch?: boolean;
}

export const useWordStudy = ({
  vocabId,
  initialWords = [],
  batchSize = 5,
  studyMode = "englishToKorean",
  shouldFetch = false
}: UseWordStudyProps) => {
  const location = useLocation();
  
  const [words, setWords] = useState<Word[]>(initialWords);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [incorrectWords, setIncorrectWords] = useState<number[]>([]);
  const [studyCompleted, setStudyCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(initialWords.length === 0 && shouldFetch);

  // 외부에서 전달된 initialWords가 변경될 때마다 words 업데이트
  useEffect(() => {
    if (initialWords.length > 0) {
      console.log("initialWords 변경 감지:", initialWords.length);
      setWords(initialWords);
      resetStudyState();
      setLoading(false);
    }
  }, [initialWords]);

  // API로 단어 가져오기 (shouldFetch가 true인 경우에만)
  useEffect(() => {
    if (!shouldFetch || initialWords.length > 0) return;

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
          
          console.log("API로 가져온 단어 수:", fetchedWords.length);
          setWords(fetchedWords);
          resetStudyState();
        } catch (error) {
          console.error("단어 로딩 중 오류:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    loadWords();
  }, [vocabId, shouldFetch, location.search]);

  const resetStudyState = () => {
    setCurrentWordIndex(0);
    setUserInputs([]);
    setIsCorrect(null);
    setShowAnswer(false);
    setIncorrectWords([]);
    setStudyCompleted(false);
  };

  const currentWord = words.length > 0 && currentWordIndex < words.length 
    ? words[currentWordIndex] 
    : null;

  // 디버깅용 로깅
  useEffect(() => {
    console.log("현재 단어:", currentWord);
    console.log("총 단어 수:", words.length);
  }, [currentWord, words]);

  const progressPercent = words.length > 0 
    ? Math.round(((currentWordIndex + 1) / words.length) * 100) 
    : 0;

  const moveToNextWord = useCallback(() => {
    if (currentWordIndex < words.length - 1) {
      if (isCorrect === false && currentWord) {
        setIncorrectWords(prev => [...prev, currentWord.id]);
      }

      setCurrentWordIndex(prev => prev + 1);
      setUserInputs([]);
      setIsCorrect(null);
      setShowAnswer(false);
    } else {
      setStudyCompleted(true);
    }
  }, [currentWordIndex, words.length, currentWord, isCorrect]);

  const markWordAsCompleted = useCallback((wordId: number) => {
    // 구현 필요
  }, []);

  const checkAnswer = useCallback(() => {
    if (!currentWord) return;

    let isUserCorrect = false;
    const correctAnswer =
      studyMode === "englishToKorean"
        ? currentWord.korean
        : currentWord.english;

    const userAnswerCharacters = userInputs.filter(
      (char, index) => correctAnswer[index] !== " "
    );
    const correctAnswerCharacters = correctAnswer
      .split("")
      .filter((char) => char !== " ");

    if (studyMode === "englishToKorean") {
      isUserCorrect =
        userAnswerCharacters.join("") === correctAnswerCharacters.join("");
    } else {
      isUserCorrect =
        userAnswerCharacters.join("").toLowerCase() ===
        correctAnswerCharacters.join("").toLowerCase();
    }

    setIsCorrect(isUserCorrect);

    if (isUserCorrect) {
      setTimeout(() => {
        moveToNextWord();
      }, 3000);
    }
  }, [currentWord, userInputs, studyMode, moveToNextWord]);

  const setCurrentBatch = useCallback((newBatch: Word[]) => {
    console.log("새 배치 설정:", newBatch.length);
    setWords(newBatch);
    resetStudyState();
  }, []);

  const resetWordStudy = async () => {
    if (vocabId && shouldFetch) {
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
        resetStudyState();
      } catch (error) {
        console.error("단어 리셋 중 오류:", error);
      } finally {
        setLoading(false);
      }
    } else {
      resetStudyState();
    }
  };

  return {
    words,
    currentWord,
    currentWordIndex,
    userInputs,
    setUserInputs,
    isCorrect,
    setIsCorrect,
    showAnswer,
    setShowAnswer,
    moveToNextWord,
    progressPercent,
    markWordAsCompleted,
    checkAnswer,
    studyCompleted,
    incorrectWords,
    totalWords: words.length,
    setCurrentBatch,
    setCurrentWordIndex,
    resetWordStudy,
    loading
  };
};