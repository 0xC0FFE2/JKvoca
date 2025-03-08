import React from "react";
import { Link } from "react-router-dom";
import { Brain, Zap } from "lucide-react";

interface StudyModeSelectorProps {
  vocabularyId: string;
}

const StudyModeSelector: React.FC<StudyModeSelectorProps> = ({ vocabularyId }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">학습 모드</h2>
      
      <div className="flex justify-start gap-4">
        <Link 
          to={`/memorize/${vocabularyId}`}
          className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] aspect-square w-36"
        >
          <Brain size={24} className="mb-2" />
          <span className="font-medium">암기 모드</span>
          <p className="text-xs text-blue-100 mt-1">완벽하게 암기하기</p>
        </Link>
        
        <Link 
          to={`/flashcard/${vocabularyId}`}
          className="flex flex-col items-center justify-center p-5 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl text-white shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px] aspect-square w-36"
        >
          <Zap size={24} className="mb-2" />
          <span className="font-medium">플래시 카드</span>
          <p className="text-xs text-indigo-100 mt-1">카드 형태로 학습하기</p>
        </Link>
      </div>
    </div>
  );
};

export default StudyModeSelector;