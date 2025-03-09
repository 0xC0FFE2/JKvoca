import { useState, useCallback } from 'react';
import { Vocab, NewVocabFormType } from '../types/Vocab';
import { 
  fetchAllVocabs, 
  createVocab as apiCreateVocab, 
  deleteVocab as apiDeleteVocab
} from '../services/AdminVocabService';

export const useVocabManager = () => {
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadVocabs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllVocabs();
      setVocabs(data);
      return data;
    } catch (error) {
      console.error('단어장 목록을 가져오는데 실패했습니다:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVocab = useCallback(async (vocabData: NewVocabFormType) => {
    try {
      await apiCreateVocab(vocabData);
      await loadVocabs();
    } catch (error) {
      console.error('단어장 생성에 실패했습니다:', error);
      throw error;
    }
  }, [loadVocabs]);

  const deleteVocab = useCallback(async (vocabId: string) => {
    try {
      await apiDeleteVocab(vocabId);
      await loadVocabs();
    } catch (error) {
      console.error('단어장 삭제에 실패했습니다:', error);
      throw error;
    }
  }, [loadVocabs]);

  return {
    vocabs,
    loading,
    loadVocabs,
    createVocab,
    deleteVocab
  };
};