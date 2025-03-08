import React from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Search, ArrowRight, ExternalLink } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  level: string;
  count: number;
  link: string;
}

// 검색 결과 더미 데이터
const searchResultsData: Record<string, SearchResult[]> = {
  "토익": [
    {
      id: "toeic-100",
      title: "토익 100 단어장",
      description: "토익 시험에 자주 출제되는 핵심 단어 100개 모음",
      level: "초급",
      count: 100,
      link: "/vocabulary/toeic-100"
    }
  ],
  "비즈니스": [
    {
      id: "business-basic",
      title: "비즈니스 영어 기초 단어장",
      description: "직장 생활에 필요한 기본 비즈니스 영어 단어 모음",
      level: "초급",
      count: 150,
      link: "/vocabulary/business-basic"
    },
    {
      id: "business-email",
      title: "비즈니스 이메일 표현 모음",
      description: "영어 이메일 작성에 필요한 표현과 단어 모음",
      level: "중급",
      count: 80,
      link: "/vocabulary/business-email"
    }
  ],
  "회화": [
    {
      id: "daily-conversation",
      title: "일상 영어회화 필수 단어장",
      description: "일상 대화에 필요한 기본 표현과 단어 모음",
      level: "초급",
      count: 200,
      link: "/vocabulary/daily-conversation"
    }
  ]
};

const SearchResultsPage: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const searchTerm = keyword || "";
  
  // 검색어에 맞는 결과 가져오기 (없으면 빈 배열)
  const results = searchResultsData[searchTerm] || [];
  
  // 새 검색 처리
  const [newSearchTerm, setNewSearchTerm] = React.useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSearchTerm.trim()) {
      window.location.href = `/search/${newSearchTerm}`;
    }
  };
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            "{searchTerm}"에 대한 검색결과 {results.length}건
          </h1>
        </div>
        
        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <div 
                key={result.id}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {result.title}
                    </h2>
                    <p className="text-gray-600 mb-3">{result.description}</p>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {result.level}
                      </span>
                      <span className="text-sm text-gray-500">
                        {result.count}개 단어
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={result.link}
                    className="flex items-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    바로가기 <ExternalLink size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500 text-lg mb-6">
              "{searchTerm}"에 대한 검색 결과가 없습니다.
            </p>
            <p className="text-gray-600">
              다른 검색어를 입력해보세요. 예: 토익, 비즈니스, 회화
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;