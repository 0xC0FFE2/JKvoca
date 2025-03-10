import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Word, StudyMode } from '../types/Types';
import { fetchAndShuffleWords, fetchExamWords } from '../services/VocabApiService';

interface UseWordStudyProps {
  vocabId?: string;
  initialWords?: Word[];
  batchSize?: number;
  studyMode?: StudyMode;
}

export const useWordStudy = ({
  vocabId,
  initialWords = [],
  batchSize = 5,
  studyMode = "englishToKorean"
}: UseWordStudyProps) => {
  const location = useLocation();
  
  const [words, setWords] = useState<Word[]>(initialWords);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [incorrectWords, setIncorrectWords] = useState<number[]>([]);
  const [studyCompleted, setStudyCompleted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

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
          setCurrentWordIndex(0);
          setUserInputs([]);
          setIsCorrect(null);
          setShowAnswer(false);
          setIncorrectWords([]);
          setStudyCompleted(false);
        } catch (error) {
          console.error("단어 로딩 중 오류:", error);
        } finally {
          setLoading(false);
        }
      } else if (initialWords.length > 0) {
        setWords(initialWords);
        setLoading(false);
      }
    };
    
    loadWords();
  }, [vocabId, location.search, initialWords]);

  const currentWord = words.length > 0 && currentWordIndex < words.length 
    ? words[currentWordIndex] 
    : null;

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

  // setCurrentBatch 함수 추가 - 이전 코드에서 사용하던 함수
  const setCurrentBatch = useCallback((newBatch: Word[]) => {
    setWords(newBatch);
    setCurrentWordIndex(0);
    setUserInputs([]);
    setIsCorrect(null);
    setShowAnswer(false);
    setIncorrectWords([]);
    setStudyCompleted(false);
  }, []);

  const resetWordStudy = async () => {
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
        setCurrentWordIndex(0);
        setUserInputs([]);
        setIsCorrect(null);
        setShowAnswer(false);
        setIncorrectWords([]);
        setStudyCompleted(false);
      } catch (error) {
        console.error("단어 리셋 중 오류:", error);
      } finally {
        setLoading(false);
      }
    } else {
      // vocabId가 없는 경우 초기 상태로 리셋
      setCurrentWordIndex(0);
      setUserInputs([]);
      setIsCorrect(null);
      setShowAnswer(false);
      setIncorrectWords([]);
      setStudyCompleted(false);
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
    setCurrentBatch,  // 여기에 함수 다시 추가
    setCurrentWordIndex,
    resetWordStudy,
    loading
  };
};