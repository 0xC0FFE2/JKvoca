import instance from '../utils/adminApi';
import { Vocab, WordType, NewVocabFormType, NewWordFormType } from '../types/Vocab';

export const fetchAllVocabs = async (): Promise<Vocab[]> => {
  try {
    const response = await instance.get<Vocab[]>('/v1/vocab/getAll');
    return response.data;
  } catch (error) {
    console.error('단어장 목록을 가져오는데 실패했습니다:', error);
    throw error;
  }
};

export const fetchVocabById = async (vocabId: string): Promise<Vocab> => {
  try {
    const response = await instance.get<Vocab>(`/v1/vocab/info/${vocabId}`);
    return response.data;
  } catch (error) {
    console.error('단어장 정보를 가져오는데 실패했습니다:', error);
    throw error;
  }
};

export const createVocab = async (vocabData: NewVocabFormType): Promise<void> => {
  try {
    await instance.post('/v1/vocab/create', vocabData);
  } catch (error) {
    console.error('단어장 생성에 실패했습니다:', error);
    throw error;
  }
};

export const deleteVocab = async (vocabId: string): Promise<void> => {
  try {
    await instance.delete(`/v1/vocab/delete/${vocabId}`);
  } catch (error) {
    console.error('단어장 삭제에 실패했습니다:', error);
    throw error;
  }
};

export const fetchAllWordsByVocabId = async (vocabId: string): Promise<WordType[]> => {
  try {
    const response = await instance.get<WordType[]>(`/v1/words/vocab/list/all/${vocabId}`);
    return response.data;
  } catch (error) {
    console.error('단어 목록을 가져오는데 실패했습니다:', error);
    throw error;
  }
};

export const createWord = async (vocabId: string, wordData: NewWordFormType): Promise<void> => {
  try {
    await instance.post('/v1/words', {
      ...wordData,
      vocabId
    });
  } catch (error) {
    console.error('단어 생성에 실패했습니다:', error);
    throw error;
  }
};

export const updateWord = async (word: WordType): Promise<void> => {
  try {
    await instance.put('/v1/words', word);
  } catch (error) {
    console.error('단어 수정에 실패했습니다:', error);
    throw error;
  }
};

export const deleteWord = async (wordId: string): Promise<void> => {
  try {
    await instance.delete(`/v1/words/${wordId}`);
  } catch (error) {
    console.error('단어 삭제에 실패했습니다:', error);
    throw error;
  }
};