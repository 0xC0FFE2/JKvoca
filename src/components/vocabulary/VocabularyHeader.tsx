import React from "react";
import { Book, Users, BarChart, FileDown } from "lucide-react";

interface VocabularyHeaderProps {
  title: string;
  description: string;
  count: number;
  level: string;
  category: string;
  onExportPDF?: () => void;
}

const VocabularyHeader: React.FC<VocabularyHeaderProps> = ({
  title,
  description,
  count,
  level,
  category,
  onExportPDF = () => alert(`PDF로 내보내기 요청되었습니다.`),
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0 md:pr-8 md:flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-sm md:text-base text-gray-600">{description}</p>
        </div>

        <div className="flex flex-col md:items-end gap-3 md:flex-none">
          <div className="flex gap-2">
            <button 
              onClick={onExportPDF}
              className="flex items-center px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-sm text-xs"
            >
              <FileDown size={14} className="mr-1" />
              <span className="font-medium">내보내기</span>
            </button>
            
            <button 
              onClick={() => alert('공유하기 기능이 클릭되었습니다.')}
              className="flex items-center px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-sm text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              <span className="font-medium">공유하기</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center px-2 py-0.5 bg-blue-50 rounded">
              <Book size={12} className="text-blue-500 mr-1" />
              <span className="text-xs font-medium text-gray-700">
                {count}개 단어
              </span>
            </div>

            <div className="flex items-center px-2 py-0.5 bg-green-50 rounded">
              <BarChart size={12} className="text-green-500 mr-1" />
              <span className="text-xs font-medium text-gray-700">
                {level}
              </span>
            </div>

            <div className="flex items-center px-2 py-0.5 bg-purple-50 rounded">
              <Users size={12} className="text-purple-500 mr-1" />
              <span className="text-xs font-medium text-gray-700">
                {category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyHeader;