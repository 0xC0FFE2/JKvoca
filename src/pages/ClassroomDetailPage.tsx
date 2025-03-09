import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { ArrowLeft, BookOpen, Book, Edit, Trash2, Save, X, Check } from "lucide-react";
import classroomService, { Classroom, Word } from "../services/AdminClassroomService";
import { fetchApiVocabInfo } from "../services/VocabApiService";

const ClassroomDetail: React.FC = () => {
  const { classroomId } = useParams<{ classroomId: string }>();
  const navigate = useNavigate();
  
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "words">("overview");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedClassroom, setEditedClassroom] = useState<Classroom | null>(null);
  const [vocabList, setVocabList] = useState<any[]>([]);
  const [vocabInfo, setVocabInfo] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  useEffect(() => {
    if (classroomId) {
      fetchClassroomInfo();
      fetchVocabList();
    }
  }, [classroomId]);
  
  useEffect(() => {
    if (classroom && classroom.studyingVocabId) {
      fetchVocabInfo(classroom.studyingVocabId);
    }
  }, [classroom]);

  const fetchClassroomInfo = async () => {
    setIsLoading(true);
    try {
      const [classroomData, wordsData] = await Promise.all([
        classroomService.getClassroomById(classroomId as string),
        classroomService.getClassroomWords(classroomId as string)
      ]);
      
      setClassroom(classroomData);
      setEditedClassroom(classroomData);
      setWords(wordsData);
      setError(null);
    } catch (err) {
      setError("클래스룸 정보를 불러오는데 실패했습니다.");
      console.error("Error fetching classroom data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVocabList = async () => {
    try {
      const vocabs = await classroomService.fetchAllVocabs();
      setVocabList(vocabs);
    } catch (err) {
      console.error("단어장 목록을 불러오는데 실패했습니다:", err);
    }
  };
  
  const fetchVocabInfo = async (vocabId: string) => {
    try {
      const info = await fetchApiVocabInfo(vocabId);
      setVocabInfo(info);
    } catch (err) {
      console.error("단어장 정보를 불러오는데 실패했습니다:", err);
      setVocabInfo(null);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedClassroom(classroom);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (!editedClassroom) return;

    if (name === "lastVocaId" || name === "testCount") {
      setEditedClassroom({
        ...editedClassroom,
        [name]: parseInt(value)
      });
    } else {
      setEditedClassroom({
        ...editedClassroom,
        [name]: value
      });
    }
    
    // 단어장을 변경했을 때 해당 단어장 정보를 가져옵니다
    if (name === "studyingVocabId" && value) {
      fetchVocabInfo(value);
    }
  };

  const handleSaveChanges = async () => {
    if (!editedClassroom || !classroom) return;
    
    try {
      // 기존 lastVocaId 값을 유지
      await classroomService.updateClassroom(classroomId as string, {
        classroomName: editedClassroom.classroomName,
        studyingVocabId: editedClassroom.studyingVocabId,
        lastVocaId: classroom.lastVocaId, // 기존 값 사용
        testCount: editedClassroom.testCount
      });
      
      setClassroom({
        ...classroom,
        classroomName: editedClassroom.classroomName,
        studyingVocabId: editedClassroom.studyingVocabId,
        testCount: editedClassroom.testCount
      });
      setIsEditing(false);
      fetchClassroomInfo(); // 업데이트된 정보 가져오기
    } catch (err) {
      setError("반 정보 수정에 실패했습니다.");
      console.error("Error updating classroom:", err);
    }
  };

  const handleDeleteClassroom = async () => {
    try {
      await classroomService.deleteClassroom(classroomId as string);
      navigate("/classroom", { state: { message: "반이 성공적으로 삭제되었습니다." } });
    } catch (err) {
      setError("반 삭제에 실패했습니다.");
      console.error("Error deleting classroom:", err);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !classroom) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error || "클래스룸 정보를 찾을 수 없습니다."}
          </div>
          <button
            onClick={() => navigate("/classroom")}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={16} className="mr-1" />
            반 목록으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/classroom")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={16} className="mr-1" />
          반 목록으로 돌아가기
        </button>

        <div className="flex justify-between items-start mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#205781] to-[#4F959D] text-transparent bg-clip-text">
            {isEditing ? (
              <input
                type="text"
                name="classroomName"
                value={editedClassroom?.classroomName || ""}
                onChange={handleInputChange}
                className="border-b-2 border-blue-500 bg-transparent focus:outline-none px-2 py-1 text-blue-800"
              />
            ) : (
              classroom.classroomName
            )}
          </h1>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save size={16} className="mr-2" />
                  저장
                </button>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} className="mr-2" />
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  편집
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">반 삭제 확인</h3>
              <p className="text-gray-600 mb-6">
                '{classroom.classroomName}' 반을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteClassroom}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  삭제하기
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === "overview"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <BookOpen size={16} className="mr-2" />
              반 개요
            </button>
            <button
              className={`px-6 py-4 text-sm font-medium flex items-center ${
                activeTab === "words"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("words")}
            >
              <Book size={16} className="mr-2" />
              단어 목록 ({words.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === "overview" ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-blue-700 mb-2">단어장</h3>
                    {isEditing ? (
                      <select
                        name="studyingVocabId"
                        value={editedClassroom?.studyingVocabId || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">-- 단어장 선택 --</option>
                        {vocabList.map((vocab) => (
                          <option key={vocab.vocabId} value={vocab.vocabId}>
                            {vocab.vocabName} ({vocab.vocabLevel}) - {vocab.wordCount}개 단어
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div>
                        <p className="text-xl font-semibold text-blue-900 truncate">
                          {vocabInfo?.vocabName || "단어장 정보 로딩중..."}
                        </p>
                        {vocabInfo && (
                          <div className="mt-2 text-sm text-blue-700">
                            <span className="inline-block bg-blue-100 rounded px-2 py-1 mr-2">
                              {vocabInfo.vocabCategory}
                            </span>
                            <span className="inline-block bg-blue-100 rounded px-2 py-1">
                              {vocabInfo.vocabLevel}
                            </span>
                            <p className="mt-2 text-gray-600 text-xs">{vocabInfo.vocabDescription}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-sm font-medium text-green-700 mb-2">테스트 수</h3>
                    {isEditing ? (
                      <input
                        type="number"
                        name="testCount"
                        value={editedClassroom?.testCount || 0}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    ) : (
                      <p className="text-2xl font-semibold text-green-900">{classroom.testCount}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">단어 난이도 분포</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {words.length > 0 ? (
                      <div>
                        {/* Simple visualization of difficulty distribution */}
                        <div className="flex h-8 w-full rounded-md overflow-hidden">
                          {(() => {
                            const difficulties = words.map(w => w.difficulty);
                            const easyCount = difficulties.filter(d => d === "EASY").length;
                            const mediumCount = difficulties.filter(d => d === "MEDIUM").length;
                            const hardCount = difficulties.filter(d => d === "HARD").length;
                            const total = words.length;
                            
                            return (
                              <>
                                <div 
                                  className="bg-green-500" 
                                  style={{ width: `${(easyCount / total) * 100}%` }}
                                />
                                <div 
                                  className="bg-yellow-500" 
                                  style={{ width: `${(mediumCount / total) * 100}%` }}
                                />
                                <div 
                                  className="bg-red-500" 
                                  style={{ width: `${(hardCount / total) * 100}%` }}
                                />
                              </>
                            );
                          })()}
                        </div>
                        
                        <div className="flex mt-2 text-sm">
                          <div className="flex items-center mr-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                            <span>쉬움: {words.filter(w => w.difficulty === "EASY").length}개</span>
                          </div>
                          <div className="flex items-center mr-4">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                            <span>보통: {words.filter(w => w.difficulty === "MEDIUM").length}개</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                            <span>어려움: {words.filter(w => w.difficulty === "HARD").length}개</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">단어 정보가 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {words.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            번호
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            영어
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            한국어
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            발음
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            난이도
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {words.sort((a, b) => a.wordIndex - b.wordIndex).map((word) => (
                          <tr key={word.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {word.wordIndex + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{word.english}</div>
                              <div className="text-sm text-gray-500 mt-1 italic">{word.example}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {word.korean}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {word.pronunciation}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(word.difficulty)}`}>
                                {word.difficulty === "EASY" ? "쉬움" : 
                                 word.difficulty === "MEDIUM" ? "보통" : "어려움"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Book size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">단어가 없습니다</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      이 반에 등록된 단어가 없습니다. 단어장 ID와 학습 단어 수를 확인해 주세요.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ClassroomDetail;