import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Plus, Pencil, Trash2, Book, ChevronRight } from "lucide-react";
import classroomService, { Classroom, ClassroomCreateRequest, ClassroomUpdateRequest } from "../services/AdminClassroomService";

const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [formData, setFormData] = useState<ClassroomCreateRequest | ClassroomUpdateRequest>({
    classroomName: "",
    studyingVocabId: "",
    lastVocaId: 0,
    testCount: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setIsLoading(true);
    try {
      const data = await classroomService.getAllClassrooms();
      setClassrooms(data);
      setError(null);
    } catch (err) {
      setError("클래스룸 목록을 불러오는데 실패했습니다.");
      console.error("Error fetching classrooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClassroom = async () => {
    try {
      await classroomService.createClassroom(formData);
      setShowCreateModal(false);
      setFormData({
        classroomName: "",
        studyingVocabId: "",
        lastVocaId: 0,
        testCount: 0
      });
      fetchClassrooms();
    } catch (err) {
      setError("클래스룸 생성에 실패했습니다.");
      console.error("Error creating classroom:", err);
    }
  };

  const handleUpdateClassroom = async () => {
    if (!selectedClassroom) return;
    
    try {
      await classroomService.updateClassroom(selectedClassroom.classroomId, formData);
      setShowEditModal(false);
      setSelectedClassroom(null);
      fetchClassrooms();
    } catch (err) {
      setError("클래스룸 업데이트에 실패했습니다.");
      console.error("Error updating classroom:", err);
    }
  };

  const handleDeleteClassroom = async (classroomId: string) => {
    if (window.confirm("정말로 이 클래스룸을 삭제하시겠습니까?")) {
      try {
        await classroomService.deleteClassroom(classroomId);
        fetchClassrooms();
      } catch (err) {
        setError("클래스룸 삭제에 실패했습니다.");
        console.error("Error deleting classroom:", err);
      }
    }
  };

  const openEditModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setFormData({
      classroomName: classroom.classroomName || "",
      studyingVocabId: classroom.studyingVocabId || "",
      lastVocaId: classroom.lastVocaId || 0,
      testCount: classroom.testCount || 0
    });
    setShowEditModal(true);
  };

  const viewClassroomDetails = (classroomId: string) => {
    navigate(`/classroom/${classroomId}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (name === 'lastVocaId' || name === 'testCount') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  return (
    <Layout>
      <section className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#205781] to-[#4F959D] text-transparent bg-clip-text">
              반 관리
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              새 반 만들기
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : classrooms.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-xl text-gray-500 mb-6">등록된 반이 없습니다.</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                새 반 만들기
              </button>
            </div>
          ) : (
            <div className="grid gap-6 mt-8">
              {classrooms.map((classroom) => (
                <div
                  key={classroom.classroomId}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">{classroom.classroomName}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Book size={16} className="mr-1" />
                        <span>단어장 ID: {classroom.studyingVocabId}</span>
                        <span className="mx-2">•</span>
                        <span>학습 단어 수: {classroom.lastVocaId}</span>
                        <span className="mx-2">•</span>
                        <span>테스트 수: {classroom.testCount}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDeleteClassroom(classroom.classroomId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => viewClassroomDetails(classroom.classroomId)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="상세 보기"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">새 반 만들기</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  반 이름
                </label>
                <input
                  type="text"
                  name="classroomName"
                  value={formData.classroomName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="반 이름을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  테스트 수
                </label>
                <input
                  type="number"
                  name="testCount"
                  value={formData.testCount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="테스트 수를 입력하세요"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleCreateClassroom}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                만들기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-6">반 정보 수정</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  반 이름
                </label>
                <input
                  type="text"
                  name="classroomName"
                  value={formData.classroomName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  단어장 ID
                </label>
                <input
                  type="text"
                  name="studyingVocabId"
                  value={formData.studyingVocabId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  학습 단어 수
                </label>
                <input
                  type="number"
                  name="lastVocaId"
                  value={formData.lastVocaId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  테스트 수
                </label>
                <input
                  type="number"
                  name="testCount"
                  value={formData.testCount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateClassroom}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClassroomManagement;