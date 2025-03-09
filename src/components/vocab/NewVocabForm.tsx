import React, { useState } from 'react';
import { X } from 'lucide-react';
import { NewVocabFormType } from '../../types/Vocab';

interface NewVocabFormProps {
  onClose: () => void;
  onSubmit: (vocabData: NewVocabFormType) => void;
}

const NewVocabForm: React.FC<NewVocabFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<NewVocabFormType>({
    vocabName: '',
    vocabCategory: '',
    vocabDescription: '',
    vocabLevel: 'Beginner'
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
    <div className="mb-6 p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">새 단어장 만들기</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
          type="button"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="vocabName" className="block text-sm font-medium text-gray-700 mb-1">
              단어장 이름
            </label>
            <input
              type="text"
              id="vocabName"
              name="vocabName"
              value={formData.vocabName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="단어장 이름"
              required
            />
          </div>
          
          <div>
            <label htmlFor="vocabCategory" className="block text-sm font-medium text-gray-700 mb-1">
              카테고리
            </label>
            <input
              type="text"
              id="vocabCategory"
              name="vocabCategory"
              value={formData.vocabCategory}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="카테고리"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="vocabDescription" className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              id="vocabDescription"
              name="vocabDescription"
              value={formData.vocabDescription}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="단어장 설명"
              rows={3}
            />
          </div>
          
          <div>
            <label htmlFor="vocabLevel" className="block text-sm font-medium text-gray-700 mb-1">
              난이도
            </label>
            <select
              id="vocabLevel"
              name="vocabLevel"
              value={formData.vocabLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Beginner">초급</option>
              <option value="Intermediate">중급</option>
              <option value="Advanced">고급</option>
            </select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            단어장 생성
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewVocabForm;