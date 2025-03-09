import React, { useState } from 'react';
import { FileUp, Loader } from 'lucide-react';
import { NewWordFormType } from '../../types/Vocab';
import { createWord } from '../../services/AdminVocabService';

interface BulkImportProps {
  vocabId: string;
  onImportComplete: () => void;
}

const BulkImportWords: React.FC<BulkImportProps> = ({ vocabId, onImportComplete }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    total: number;
    processed: number;
    success: number;
    failed: number;
    errors: string[];
  }>({ total: 0, processed: 0, success: 0, failed: 0, errors: [] });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
    setError(null);
    setImportStatus({ total: 0, processed: 0, success: 0, failed: 0, errors: [] });
  };

  const handleImport = async () => {
    if (!selectedFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    try {
      setIsImporting(true);
      const fileContent = await selectedFile.text();
      let words: NewWordFormType[];

      try {
        words = JSON.parse(fileContent);
      } catch (parseError) {
        setError('유효하지 않은 JSON 형식입니다.');
        setIsImporting(false);
        return;
      }

      if (!Array.isArray(words)) {
        setError('JSON 배열 형식이 아닙니다.');
        setIsImporting(false);
        return;
      }

      setImportStatus({ 
        total: words.length, 
        processed: 0,
        success: 0, 
        failed: 0, 
        errors: [] 
      });

      const errors: string[] = [];
      let successCount = 0;
      let failedCount = 0;

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        try {
          if (!word.korean || !word.english) {
            throw new Error(`잘못된 단어 형식: ${JSON.stringify(word)}`);
          }

          const wordToImport: NewWordFormType = {
            korean: word.korean,
            english: word.english,
            difficulty: word.difficulty || 'ADVANCED',
            example: word.example || '',
            pronunciation: word.pronunciation || ''
          };

          await createWord(vocabId, wordToImport);
          successCount++;
        } catch (err) {
          failedCount++;
          errors.push(err instanceof Error ? err.message : String(err));
        }

        setImportStatus({
          total: words.length,
          processed: i + 1,
          success: successCount,
          failed: failedCount,
          errors: errors
        });

        // 각 단어 처리 후 500ms 지연
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (successCount > 0) {
        onImportComplete();
      }
    } catch (err) {
      console.error('단어 가져오기 중 오류:', err);
      setError('단어 가져오기 중 오류가 발생했습니다.');
    } finally {
      setIsImporting(false);
    }
  };

  const calculateProgress = () => {
    if (importStatus.total === 0) return 0;
    return (importStatus.processed / importStatus.total) * 100;
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          id="jsonFileInput"
          disabled={isImporting}
        />
        <label 
          htmlFor="jsonFileInput" 
          className={`flex items-center py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg cursor-pointer transition-colors ${isImporting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FileUp size={16} className="mr-2" /> JSON 파일 선택
        </label>
        {selectedFile && (
          <span className="text-gray-600">{selectedFile.name}</span>
        )}
        <button
          onClick={handleImport}
          disabled={!selectedFile || isImporting}
          className="py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isImporting ? (
            <span className="flex items-center">
              <Loader size={16} className="mr-2 animate-spin" /> 가져오는 중...
            </span>
          ) : '가져오기'}
        </button>
      </div>
      
      {error && (
        <div className="mt-2 text-red-600 text-sm">{error}</div>
      )}
      
      {isImporting && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            진행 중: {importStatus.processed}/{importStatus.total} ({Math.round(calculateProgress())}%)
          </p>
        </div>
      )}
      
      {importStatus.total > 0 && (
        <div className="mt-2 text-sm">
          <p>총 단어: {importStatus.total}</p>
          <p className="text-green-600">성공: {importStatus.success}</p>
          <p className="text-red-600">실패: {importStatus.failed}</p>
          {importStatus.errors.length > 0 && (
            <div className="mt-2">
              <p className="text-red-600 font-semibold">오류 상세:</p>
              <div className="max-h-32 overflow-y-auto">
                {importStatus.errors.map((errorMsg, index) => (
                  <p key={index} className="text-red-500 text-xs">{errorMsg}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkImportWords;