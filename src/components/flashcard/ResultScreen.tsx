import React from "react";
import { CheckCircle, RotateCcw, X, BookOpen } from "lucide-react";
import { Word } from "../../types/Types";

interface ResultScreenProps {
  words: Word[];
  knownWords: number[];
  onReset: () => void;
  onExit: () => void;
  isExamMode?: boolean; // 시험 모드 여부 (선택적 프로퍼티)
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  words,
  knownWords,
  onReset,
  onExit,
  isExamMode = false, // 기본값은 false
}) => {
  const totalWords = words.length;
  const knownCount = knownWords.length;
  const unknownCount = totalWords - knownCount;

  const knownWordsList = words.filter((word) => knownWords.includes(word.id));
  const unknownWordsList = words.filter(
    (word) => !knownWords.includes(word.id)
  );

  // 모드에 따라 다른 텍스트 사용
  const modeText = isExamMode ? "시험" : "학습";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={onExit}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <X size={20} className="mr-1" />
          <span>종료하기</span>
        </button>

        <h1 className="text-2xl font-bold text-center">{modeText} 결과</h1>

        <button
          onClick={onReset}
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <RotateCcw size={20} className="mr-1" />
          <span>다시하기</span>
        </button>
      </div>

      {/* 결과 요약 */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8">
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-600 mb-1">
              전체 단어
            </h3>
            <p className="text-3xl font-bold text-gray-800">{totalWords}개</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-600 mb-1">
              아는 단어
            </h3>
            <p className="text-3xl font-bold text-green-700">{knownCount}개</p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="text-lg font-semibold text-red-600 mb-1">
              모르는 단어
            </h3>
            <p className="text-3xl font-bold text-red-700">{unknownCount}개</p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-6 mb-4">
          <div
            className="h-full bg-green-500 rounded-full"
            style={{
              width: `${(knownCount / totalWords) * 100}%`,
              transition: "width 0.5s ease-in-out",
            }}
          ></div>
        </div>

        <p className="text-center text-gray-600">
          {Math.round((knownCount / totalWords) * 100)}% 완료했습니다!
        </p>
      </div>

      {/* 모르는 단어 목록 */}
      {unknownWordsList.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <BookOpen size={20} className="mr-2 text-red-500" />더 {modeText}해야 할
            단어 ({unknownWordsList.length}개)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unknownWordsList.map((word) => (
              <div
                key={word.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <h3 className="font-bold text-lg">{word.english}</h3>
                <p className="text-gray-600">{word.korean}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 알고 있는 단어 목록 */}
      {knownWordsList.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <CheckCircle size={20} className="mr-2 text-green-500" />
            알고 있는 단어 ({knownWordsList.length}개)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {knownWordsList.map((word) => (
              <div
                key={word.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <h3 className="font-bold text-lg">{word.english}</h3>
                <p className="text-gray-600">{word.korean}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <RotateCcw size={20} className="mr-2" />
          <span>다시 {modeText}하기</span>
        </button>

        <button
          onClick={onExit}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center"
        >
          <X size={20} className="mr-2" />
          <span>{modeText} 종료</span>
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;