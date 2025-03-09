import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NewWordFormType } from '../../types/Vocab';

interface NewWordFormProps {
  onClose: () => void;
  onSubmit: (wordData: NewWordFormType) => void;
}

const NewWordForm: React.FC<NewWordFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewWordFormType>({
    english: '',
    korean: '',
    example: '',
    pronunciation: '',
    difficulty: 'EASY'
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-800">새 단어 추가</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          <X size={16} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="english" className="block text-sm font-medium text-gray-700 mb-1">
              영어
            </label>
            <input
              type="text"
              id="english"
              name="english"
              value={formData.english}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="영어 단어"
              required
            />
          </div>
          
          <div>
            <label htmlFor="korean" className="block text-sm font-medium text-gray-700 mb-1">
              한국어
            </label>
            <input
              type="text"
              id="korean"
              name="korean"
              value={formData.korean}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="한국어 뜻"
              required
            />
          </div>
          
          <div>
            <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700 mb-1">
              발음
            </label>
            <input
              type="text"
              id="pronunciation"
              name="pronunciation"
              value={formData.pronunciation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="발음"
            />
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
              난이도
            </label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="EASY">쉬움</option>
              <option value="MEDIUM">보통</option>
              <option value="HARD">어려움</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-1">
              예문
            </label>
            <textarea
              id="example"
              name="example"
              value={formData.example}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="예문"
              rows={2}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            단어 추가
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewWordForm;