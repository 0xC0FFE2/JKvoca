import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../layouts/Layout";
import { Search, ArrowRight, ExternalLink } from "lucide-react";
import instance from "../utils/publicApi";

interface SearchResult {
  vocabId: string;
  vocabName: string;
  vocabDescription: string;
  vocabLevel: string;
  wordCount: number;
  vocabCategory: string;
}

const SearchResultsPage: React.FC = () => {
  const { keyword } = useParams<{ keyword: string }>();
  const searchTerm = keyword || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await instance.get(`/v1/vocab/search/${searchTerm}`);
        setResults(response.data);
        setError(null);
      } catch (err) {
        console.error("검색 결과를 가져오는데 실패했습니다:", err);
        setError("검색 결과를 가져오는데 실패했습니다");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm) {
      fetchSearchResults();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [searchTerm]);
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            "{searchTerm}"에 대한 검색결과 {results.length}건
          </h1>
        </div>
        
        {loading ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">검색 중...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <div 
                key={result.vocabId}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {result.vocabName}
                    </h2>
                    <p className="text-gray-600 mb-3">{result.vocabDescription}</p>
                    <div className="flex items-center space-x-4">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                        {result.vocabLevel}
                      </span>
                      <span className="text-sm text-gray-500">
                        {result.wordCount}개 단어
                      </span>
                      {result.vocabCategory && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {result.vocabCategory}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link 
                    to={`/vocabulary/${result.vocabId}`}
                    className="flex items-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    바로가기 <ExternalLink size={16} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/404.png" 
                alt="검색 결과 없음" 
                className=" h-64"
              />
            </div>
            <p className="text-gray-600 text-lg mb-2">
              검색 결과가 없네요...
            </p>
            <p className="text-gray-500">
              다른 검색어를 입력해보세요. 예: 토익, 비즈니스, 회화
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchResultsPage;