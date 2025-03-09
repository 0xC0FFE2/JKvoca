import React, { useState } from 'react';
import { Edit, Trash, Save, ChevronUp, ChevronDown, X } from 'lucide-react';
import { WordType } from '../../types/Vocab';

interface WordListProps {
  words: WordType[];
  loading: boolean;
  onEditWord: (word: WordType) => void;
  onDeleteWord: (wordId: string) => void;
  onChangeWordOrder: (wordId: string, direction: 'up' | 'down') => void;
}

const WordList: React.FC<WordListProps> = ({
  words,
  loading,
  onEditWord,
  onDeleteWord,
  onChangeWordOrder
}) => {
  const [editingWordId, setEditingWordId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<WordType | null>(null);
  
  const handleEditClick = (word: WordType) => {
    setEditingWordId(word.id);
    setEditFormData({...word});
  };
  
  const handleSaveEdit = () => {
    if (editFormData) {
      onEditWord(editFormData);
      setEditingWordId(null);
      setEditFormData(null);
    }
  };
  
  const handleCancelEdit = () => {
    setEditingWordId(null);
    setEditFormData(null);
  };
  
  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!editFormData) return;
    
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };
  
  if (loading) {
    return (
      <div className="py-6 text-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }
  
  if (words.length === 0) {
    return (
      <div className="py-8 text-center">
        <div className="flex justify-center mb-4">
          <img 
            src="/404.png" 
            alt="단어 없음" 
            className="h-40"
          />
        </div>
        <p className="text-gray-600 text-lg mb-2">
          아직 단어가 없네요...
        </p>
        <p className="text-gray-500">
          오른쪽 상단의 '단어 추가' 버튼을 눌러 단어를 추가해보세요.
        </p>
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
              순서
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              영어
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              한국어
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              발음
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              난이도
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              예문
            </th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              관리
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {words.map((word) => (
            <tr key={word.id} className="hover:bg-gray-50">
              {editingWordId === word.id ? (
                // 수정 모드
                <>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex flex-col space-y-1">
                      <button 
                        type="button"
                        onClick={() => onChangeWordOrder(word.id, "up")} 
                        className="text-gray-500 hover:text-gray-700">
                        <ChevronUp size={16} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => onChangeWordOrder(word.id, "down")} 
                        className="text-gray-500 hover:text-gray-700">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="english"
                      value={editFormData?.english || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="korean"
                      value={editFormData?.korean || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      name="pronunciation"
                      value={editFormData?.pronunciation || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <select
                      name="difficulty"
                      value={editFormData?.difficulty || "EASY"}
                      onChange={handleEditFormChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="EASY">쉬움</option>
                      <option value="MEDIUM">보통</option>
                      <option value="HARD">어려움</option>
                    </select>
                  </td>
                  <td className="px-3 py-4">
                    <textarea
                      name="example"
                      value={editFormData?.example || ""}
                      onChange={handleEditFormChange}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={2}
                    />
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="text-green-500 hover:text-green-700 mr-2"
                    >
                      <Save size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  </td>
                </>
              ) : (
                // 일반 모드
                <>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex flex-col space-y-1">
                      <button 
                        type="button"
                        onClick={() => onChangeWordOrder(word.id, "up")} 
                        className="text-gray-500 hover:text-gray-700">
                        <ChevronUp size={16} />
                      </button>
                      <span className="text-center">{word.wordIndex}</span>
                      <button 
                        type="button"
                        onClick={() => onChangeWordOrder(word.id, "down")} 
                        className="text-gray-500 hover:text-gray-700">
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {word.english}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-600">
                    {word.korean}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                    {word.pronunciation}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${word.difficulty === "EASY" ? "bg-green-100 text-green-800" : 
                          word.difficulty === "MEDIUM" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"}`}
                    >
                      {word.difficulty === "EASY" ? "쉬움" : 
                        word.difficulty === "MEDIUM" ? "보통" : "어려움"}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    <div className="max-w-xs truncate">{word.example}</div>
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      type="button"
                      onClick={() => handleEditClick(word)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteWord(word.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash size={16} />
                    </button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WordList;