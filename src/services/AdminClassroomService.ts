import { Vocab } from "../types/Vocab";
import apiClient from "../utils/adminApi";

export interface Classroom {
  classroomId: string;
  classroomName: string;
  studyingVocabId: string;
  lastVocaId: number;
  testCount: number;
}

export interface Word {
  id: string;
  vocabId: string;
  english: string;
  korean: string;
  example: string;
  pronunciation: string;
  difficulty: string;
  wordIndex: number;
}

export interface ClassroomCreateRequest {
  classroomName: string;
  studyingVocabId: string;
  lastVocaId: number;
  testCount: number;
}

export interface ClassroomUpdateRequest {
  classroomName: string;
  studyingVocabId: string;
  lastVocaId: number;
  testCount: number;
}

export const classroomService = {
  getAllClassrooms: async (): Promise<Classroom[]> => {
    const response = await apiClient.get<Classroom[]>("/v1/classroom");
    return response.data;
  },

  getClassroomById: async (classroomId: string): Promise<Classroom> => {
    const response = await apiClient.get<Classroom>(
      `/v1/classroom/${classroomId}`
    );
    return response.data;
  },

  getClassroomWords: async (classroomId: string): Promise<Word[]> => {
    const response = await apiClient.get<Word[]>(
      `/v1/words/vocab/list/${classroomId}/words`
    );
    return response.data;
  },

  createClassroom: async (classroom: ClassroomCreateRequest): Promise<void> => {
    await apiClient.post("/v1/classroom", classroom);
  },

  updateClassroom: async (
    classroomId: string,
    classroom: ClassroomUpdateRequest
  ): Promise<void> => {
    await apiClient.put(`/v1/classroom/${classroomId}`, classroom);
  },

  deleteClassroom: async (classroomId: string): Promise<void> => {
    await apiClient.delete(`/v1/classroom/${classroomId}`);
  },

  fetchAllVocabs: async (): Promise<Vocab[]> => {
    try {
      const response = await apiClient.get<Vocab[]>("/v1/vocab/getAll");
      return response.data;
    } catch (error) {
      console.error("단어장 목록을 가져오는데 실패했습니다:", error);
      throw error;
    }
  },

  moveToNextTest: async (classroomId: string): Promise<boolean> => {
    try {
      await apiClient.put(`/v1/classroom/${classroomId}/next`);
      return true;
    } catch (error) {
      console.error("다음 시험으로 이동 중 오류가 발생했습니다:", error);
      return false;
    }
  },

  moveToPreviousTest: async (classroomId: string): Promise<boolean> => {
    try {
      await apiClient.put(`/v1/classroom/${classroomId}/prev`);
      return true;
    } catch (error) {
      console.error("이전 시험으로 이동 중 오류가 발생했습니다:", error);
      return false;
    }
  },
};

export default classroomService;
