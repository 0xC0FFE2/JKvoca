import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import StudyZZAL from "../assets/study.png";
import { Search, ArrowRight } from "lucide-react";

const ServiceIntroduction: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  };

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
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-500 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
                로그인하여 시작하기
              </button>
            </div>
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