import { useState, useEffect, useCallback } from "react";
import { Word } from "../types/Types";

export const useWordStudy = (words: Word[], batchSize: number) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedWords, setCompletedWords] = useState<number[]>([]);
  const [currentBatch, setCurrentBatch] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInputs, setUserInputs] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (words.length > 0) {
      setCurrentBatch(words.slice(currentIndex, currentIndex + batchSize));
    }
  }, [words, currentIndex, batchSize]);

  const currentWord = currentBatch[currentWordIndex] || null;

  const moveToNextWord = useCallback(() => {
    setUserInputs([]);
    setIsCorrect(null);
    setShowAnswer(false);

    if (currentWordIndex < currentBatch.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      showNextBatch();
    }
  }, [currentWordIndex, currentBatch.length]);

  const showNextBatch = useCallback(() => {
    const nextBatchStart = currentIndex + batchSize;
    if (nextBatchStart < words.length) {
      setCurrentIndex(nextBatchStart);
      setCurrentWordIndex(0);
      setUserInputs([]);
      setIsCorrect(null);
      setShowAnswer(false);
    }
  }, [currentIndex, batchSize, words.length]);

  const showPrevBatch = useCallback(() => {
    const prevBatchStart = currentIndex - batchSize;
    if (prevBatchStart >= 0) {
      setCurrentIndex(prevBatchStart);
      setCurrentWordIndex(0);
      setUserInputs([]);
      setIsCorrect(null);
      setShowAnswer(false);
    }
  }, [currentIndex, batchSize]);

  const markWordAsCompleted = useCallback(
    (wordId: number) => {
      if (!completedWords.includes(wordId)) {
        setCompletedWords([...completedWords, wordId]);
      }
    },
    [completedWords]
  );

  const progressPercent =
    words.length > 0
      ? Math.round((completedWords.length / words.length) * 100)
      : 0;

  const batchProgress =
    currentBatch.length > 0
      ? Math.round((currentWordIndex / currentBatch.length) * 100)
      : 0;

  const totalBatches = Math.ceil(words.length / batchSize);
  const currentBatchNumber = Math.floor(currentIndex / batchSize) + 1;

  return {
    currentIndex,
    completedWords,
    currentBatch,
    currentWordIndex,
    currentWord,
    userInputs,
    setUserInputs,
    isCorrect,
    setIsCorrect,
    showAnswer,
    setShowAnswer,
    moveToNextWord,
    showNextBatch,
    showPrevBatch,
    markWordAsCompleted,
    progressPercent,
    batchProgress,
    totalBatches,
    currentBatchNumber,
    setCurrentWordIndex,
    setCurrentBatch,
  };
};