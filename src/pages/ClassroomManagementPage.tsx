import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Plus, Pencil, Trash2, Book, ChevronRight, Filter, Search } from "lucide-react";
import classroomService, { Classroom, ClassroomCreateRequest, ClassroomUpdateRequest } from "../services/AdminClassroomService";

const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Classroom>("classroomName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  useEffect(() => {
    filterAndSortClassrooms();
  }, [classrooms, searchTerm, sortBy, sortDirection]);

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

  const filterAndSortClassrooms = () => {
    let result = [...classrooms];

    // 검색 필터링
    if (searchTerm) {
      result = result.filter(classroom => 
        classroom.classroomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classroom.studyingVocabId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 정렬
    result.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredClassrooms(result);
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
    const confirmDelete = window.confirm("정말로 이 클래스룸을 삭제하시겠습니까?");
    if (confirmDelete) {
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
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'lastVocaId' || name === 'testCount' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSort = (key: keyof Classroom) => {
    if (sortBy === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (key: keyof Classroom) => {
    if (sortBy !== key) return null;
    return sortDirection === "asc" 
      ? <span className="ml-1 text-xs">▲</span>
      : <span className="ml-1 text-xs">▼</span>;
  };

  return (
    <Layout>
      <section className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#205781] to-[#4F959D] text-transparent bg-clip-text">
              반 관리
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="반 이름 또는 단어장 ID 검색" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} className="mr-2" />
                새 반 만들기
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center justify-between">
              {error}
              <button 
                onClick={() => setError(null)} 
                className="text-red-700 hover:text-red-900"
              >
                × 닫기
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredClassrooms.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <p className="text-xl text-gray-500 mb-6">
                {searchTerm 
                  ? "검색 결과가 없습니다." 
                  : "등록된 반이 없습니다."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  검색 초기화
                </button>
              ) : (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={18} className="mr-2" />
                  새 반 만들기
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("classroomName")}
                    >
                      반 이름 {renderSortIcon("classroomName")}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("studyingVocabId")}
                    >
                      단어장 ID {renderSortIcon("studyingVocabId")}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("lastVocaId")}
                    >
                      학습 단어 수 {renderSortIcon("lastVocaId")}
                    </th>
                    <th 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                      onClick={() => handleSort("testCount")}
                    >
                      테스트 수 {renderSortIcon("testCount")}
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredClassrooms.map((classroom) => (
                    <tr 
                      key={classroom.classroomId} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {classroom.classroomName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classroom.studyingVocabId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classroom.lastVocaId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {classroom.testCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteClassroom(classroom.classroomId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => viewClassroomDetails(classroom.classroomId)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                            title="상세 보기"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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