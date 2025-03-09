import { useState, useCallback } from 'react';
import { WordType, NewWordFormType } from '../types/Vocab';
import { 
  fetchAllWordsByVocabId, 
  createWord as apiCreateWord, 
  updateWord as apiUpdateWord, 
  deleteWord as apiDeleteWord 
} from '../services/AdminVocabService';

export const useWordManager = () => {
  const [words, setWords] = useState<WordType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadWords = useCallback(async (vocabId: string) => {
    setLoading(true);
    try {
      const data = await fetchAllWordsByVocabId(vocabId);
      setWords(data);
      return data;
    } catch (error) {
      console.error('단어 목록을 가져오는데 실패했습니다:', error);
      setWords([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createWord = useCallback(async (vocabId: string, wordData: NewWordFormType) => {
    try {
      await apiCreateWord(vocabId, wordData);
      await loadWords(vocabId);
    } catch (error) {
      console.error('단어 생성에 실패했습니다:', error);
      throw error;
    }
  }, [loadWords]);

  const updateWord = useCallback(async (updatedWord: WordType) => {
    try {
      await apiUpdateWord(updatedWord);
      setWords(prevWords => 
        prevWords.map(word => 
          word.id === updatedWord.id ? updatedWord : word
        )
      );
    } catch (error) {
      console.error('단어 수정에 실패했습니다:', error);
      throw error;
    }
  }, []);

  const deleteWord = useCallback(async (wordId: string) => {
    try {
      await apiDeleteWord(wordId);
      setWords(prevWords => prevWords.filter(word => word.id !== wordId));
    } catch (error) {
      console.error('단어 삭제에 실패했습니다:', error);
      throw error;
    }
  }, []);

  const changeWordOrder = useCallback(async (wordId: string, direction: "up" | "down") => {
    const currentIndex = words.findIndex(word => word.id === wordId);
    if (
      (direction === "up" && currentIndex === 0) || 
      (direction === "down" && currentIndex === words.length - 1)
    ) return;

    const adjacentWordIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const adjacentWord = words[adjacentWordIndex];

    try {
      const updatedWords = [...words];
      const wordToMove: WordType = {...updatedWords[currentIndex]};
      const tempIndex = wordToMove.wordIndex;
      
      wordToMove.wordIndex = adjacentWord.wordIndex;
      updatedWords[adjacentWordIndex] = {...adjacentWord, wordIndex: tempIndex};
      updatedWords[currentIndex] = wordToMove;
      
      const sortedWords = [...updatedWords].sort((a, b) => a.wordIndex - b.wordIndex);
      setWords(sortedWords);

      await apiUpdateWord(wordToMove);
      await apiUpdateWord(updatedWords[adjacentWordIndex]);
    } catch (error) {
      console.error('단어 순서 변경에 실패했습니다:', error);
      throw error;
    }
  }, [words]);

  return {
    words,
    loading,
    loadWords,
    createWord,
    updateWord,
    deleteWord,
    changeWordOrder
  };
};