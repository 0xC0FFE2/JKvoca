import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import StudyZZAL from "../assets/study.png";
import { Search, ArrowRight, Loader2, BookOpen, School, PenTool, Plus } from "lucide-react";
import { Vocab } from "../types/Vocab";
import classroomService from "../services/AdminClassroomService";
import { fetchAllVocabs } from "../services/AdminVocabService";
import { Classroom } from "../services/VocabApiService";
import AuthService from "../services/AuthService";

// 스켈레톤 UI 컴포넌트
const SkeletonPulse = () => (
  <div className="animate-pulse bg-gray-200 rounded-md"></div>
);

// 관리자용 스켈레톤 UI
const AdminSkeletonUI = () => (
  <div className="max-w-7xl mx-auto px-6 py-12">
    <div className="h-10 w-72 mb-6">
      <SkeletonPulse />
    </div>

    <div className="mb-8">
      <div className="w-full max-w-xl">
        <div className="relative flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-300">
          <div className="h-8 w-full">
            <SkeletonPulse />
          </div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* 반 목록 스켈레톤 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 w-32">
            <SkeletonPulse />
          </div>
          <div className="h-9 w-24">
            <SkeletonPulse />
          </div>
        </div>

        <ul className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <li key={i} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="w-3/5">
                  <div className="h-5 w-full mb-2">
                    <SkeletonPulse />
                  </div>
                  <div className="h-4 w-3/4">
                    <SkeletonPulse />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-20">
                    <SkeletonPulse />
                  </div>
                  <div className="h-8 w-20">
                    <SkeletonPulse />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* 단어장 목록 스켈레톤 */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <div className="h-7 w-32">
            <SkeletonPulse />
          </div>
          <div className="h-9 w-24">
            <SkeletonPulse />
          </div>
        </div>

        <ul className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <li key={i} className="p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="w-3/5">
                  <div className="h-5 w-full mb-2">
                    <SkeletonPulse />
                  </div>
                  <div className="h-4 w-2/4">
                    <SkeletonPulse />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-20">
                    <SkeletonPulse />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// 일반 사용자용 스켈레톤 UI
const UserSkeletonUI = () => (
  <section className="pt-12 pb-16">
    <div className="max-w-7xl mx-auto px-6">
      <div className="max-w-2xl">
        <div className="h-12 w-3/4 mb-6">
          <SkeletonPulse />
        </div>

        <div className="mb-6">
          <div className="h-7 w-full mb-3">
            <SkeletonPulse />
          </div>
          <div className="h-7 w-5/6">
            <SkeletonPulse />
          </div>
        </div>
      </div>

      <div className="mt-12 relative">
        <div className="relative">
          <div className="w-full h-128 rounded-xl bg-gray-300">
            <SkeletonPulse />
          </div>
        </div>
      </div>
      
      <div className="mt-32 flex justify-center flex-col items-center mb-32">
        <div className="h-7 w-80 mb-4">
          <SkeletonPulse />
        </div>
        <div className="w-full max-w-xl">
          <div className="h-14 w-full bg-white rounded-xl border border-gray-300">
            <SkeletonPulse />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const USER_EMAIL_KEY = "jkvoca_user_email";

const extractNumbers = (str: string) => {
  const matches = str.match(/\d+/g);
  if (!matches) return [0];
  return matches.map(Number);
};

const compareClassroomNames = (a: { classroomName: string; }, b: { classroomName: string; }) => {
  const aNumbers = extractNumbers(a.classroomName);
  const bNumbers = extractNumbers(b.classroomName);
  
  if (aNumbers[0] !== bNumbers[0]) {
    return aNumbers[0] - bNumbers[0];
  }
  
  if (aNumbers.length > 1 && bNumbers.length > 1) {
    return aNumbers[1] - bNumbers[1];
  }
  
  if (aNumbers.length > 1) return 1;
  if (bNumbers.length > 1) return -1;
  
  return a.classroomName.localeCompare(b.classroomName);
};

const ServiceIntroduction: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [adminSearchTerm, setAdminSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      // 새로운 로그인 시스템 체크
      const username = AuthService.getUsername();
      if (username) {
        setIsAdmin(true);
        fetchData();
        return;
      }

      // 기존 OAuth 시스템 체크
      const userEmail = localStorage.getItem(USER_EMAIL_KEY);
      if (userEmail) {
        setIsAdmin(true);
        fetchData();
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [classroomsData, vocabsData] = await Promise.all([
        classroomService.getAllClassrooms(),
        fetchAllVocabs()
      ]);
      
      setClassrooms(classroomsData);
      setVocabs(vocabsData);
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExamLink = (classroomId: string) => {
    return `https://jkvoca.ncloud.sbs/vocabulary/${classroomId}?ec=true`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

  const handleAdminSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // 검색어를 기준으로 필터링하고, 정렬도 적용
  const filteredClassrooms = classrooms
    .filter(classroom => 
      classroom.classroomName.toLowerCase().includes(adminSearchTerm.toLowerCase())
    )
    .sort(compareClassroomNames); // 숫자 순서대로 정렬

  const filteredVocabs = vocabs.filter(vocab => 
    vocab.vocabName.toLowerCase().includes(adminSearchTerm.toLowerCase())
  );

  // 로딩 중 스켈레톤 UI 표시
  if (loading) {
    return (
      <Layout>
        {isAdmin ? <AdminSkeletonUI /> : <UserSkeletonUI />}
      </Layout>
    );
  }

  if (isAdmin) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#205781] to-[#4F959D] text-transparent bg-clip-text tracking-tight mb-6">
            진경쌤최고ㅇㅅㅇ
          </h1>

          <div className="mb-8">
            <form onSubmit={handleAdminSearch} className="w-full max-w-xl">
              <div className="relative flex items-center justify-between py-3 px-4 bg-white rounded-xl border border-gray-300">
                <div className="flex items-center flex-1">
                  <Search size={18} className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="반 이름 또는 단어장 이름으로 검색"
                    className="w-full focus:outline-none text-gray-700"
                    value={adminSearchTerm}
                    onChange={(e) => setAdminSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <School className="mr-2 text-blue-500" size={20} />
                  반 목록
                </h2>
                <button 
                  onClick={() => navigate('/classroom/')} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  반 생성
                </button>
              </div>

              {filteredClassrooms.length > 0 ? (
                <ul className="space-y-3">
                  {filteredClassrooms.map((classroom) => (
                    <li 
                      key={classroom.classroomId} 
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{classroom.classroomName}</h3>
                          <p className="text-sm text-gray-500">
                            학습 단어장: {vocabs.find(v => v.vocabId === classroom.studyingVocabId)?.vocabName || '단어장 정보 없음'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/classroom/${classroom.classroomId}`)}
                            className="bg-blue-50 text-blue-600 py-1 px-3 rounded text-sm flex items-center"
                          >
                            <School size={14} className="mr-1" />
                            관리
                          </button>
                          <a 
                            href={getExamLink(classroom.classroomId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-50 text-green-600 py-1 px-3 rounded text-sm flex items-center"
                          >
                            <PenTool size={14} className="mr-1" />
                            시험
                          </a>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {adminSearchTerm ? "검색 결과가 없습니다." : "반이 없습니다."}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookOpen className="mr-2 text-blue-500" size={20} />
                  단어장 목록
                </h2>
                <button 
                  onClick={() => navigate('/vocab/')} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg text-sm flex items-center"
                >
                  <Plus size={16} className="mr-1" />
                  단어장 생성
                </button>
              </div>

              {filteredVocabs.length > 0 ? (
                <ul className="space-y-3">
                  {filteredVocabs.map((vocab) => (
                    <li 
                      key={vocab.vocabId} 
                      className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{vocab.vocabName}</h3>
                          <p className="text-sm text-gray-500">
                            단어 수: {vocab.wordCount || 0}개
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => navigate(`/vocab/`)}
                            className="bg-blue-50 text-blue-600 py-1 px-3 rounded text-sm flex items-center"
                          >
                            <BookOpen size={14} className="mr-1" />
                            관리
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  {adminSearchTerm ? "검색 결과가 없습니다." : "단어장이 없습니다."}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#205781] to-[#4F959D] text-transparent bg-clip-text tracking-tight mb-6">
              JK만의 특별한 단어장
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              JK가 엄선한 단어들로
              <br />
              영어 실력을 더 높여드립니다 ㅇㅅㅇ
            </p>
          </div>

          <div className="mt-12 relative">
            <div className="relative">
              <img
                src={StudyZZAL}
                className="w-full h-128 object-cover rounded-xl brightness-50"
                alt="Study illustration"
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-5xl mx-4">
                  <div className="text-center">
                    <div className="text-white text-3xl mb-2">"</div>
                    <p className="text-4xl font-light text-white mb-6 leading-tight tracking-tight">
                      To have another language is to possess a second soul
                    </p>
                    <div className="text-white text-3xl mb-2">"</div>
                    <p className="text-2xl text-white italic font-light">- JK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-32 flex justify-center flex-col items-center mb-32">
            <h3 className="text-xl font-medium text-gray-800 mb-4">
              지금 바로 JK의 단어장을 찾아보세요!
            </h3>
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="relative flex items-center justify-between py-4 px-6 bg-white rounded-xl border border-gray-300">
                <div className="flex items-center flex-1">
                  <Search size={20} className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="단어장 이름으로 검색하세요"
                    className="w-full focus:outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-gray-100 p-2 rounded-lg"
                  disabled={!searchTerm.trim()}
                >
                  <ArrowRight size={16} className={`${searchTerm.trim() ? 'text-blue-500' : 'text-gray-300'}`} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceIntroduction;