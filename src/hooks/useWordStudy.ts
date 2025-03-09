import { useState, useEffect, useCallback } from 'react';
import { Word, StudyMode } from '../types/Types';

export const useWordStudy = (
  words: Word[], 
  batchSize: number = 5, 
  studyMode: StudyMode = "englishToKorean"
) => {
  const [currentBatch, setCurrentBatch] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [incorrectWords, setIncorrectWords] = useState<number[]>([]);
  const [studyCompleted, setStudyCompleted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // 단어 목록이 변경되었을 때 초기 배치 생성
  useEffect(() => {
    if (words.length > 0) {
      setCurrentBatch(words);
      setCurrentIndex(0);
    }
  }, [words]);

  // 현재 학습 중인 단어
  const currentWord = currentBatch.length > 0 && currentWordIndex < currentBatch.length ? 
    currentBatch[currentWordIndex] : null;

  // 진행 상황 계산
  const progressPercent = words.length > 0 
    ? Math.round(((currentWordIndex + 1) / words.length) * 100) 
    : 0;

  // 다음 단어로 이동
  const moveToNextWord = useCallback(() => {
    if (currentWordIndex < currentBatch.length - 1) {
      // 현재 단어가 틀렸으면 incorrectWords에 추가
      if (isCorrect === false) {
        setIncorrectWords(prev => [...prev, currentWord!.id]);
      }

      // 다음 단어로 이동
      setCurrentWordIndex(prev => prev + 1);
      setUserInputs([]);
      setIsCorrect(null);
      setShowAnswer(false);
    } else {
      // 마지막 단어에 도달했을 때
      setStudyCompleted(true);
    }
  }, [currentWordIndex, currentBatch.length, currentWord, isCorrect]);

  // 완료된 단어 표시
  const markWordAsCompleted = useCallback((wordId: number) => {
    // 어차피 moveToNextWord에서 처리함
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

  return {
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
  };
};