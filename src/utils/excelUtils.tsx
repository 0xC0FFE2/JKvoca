import * as XLSX from 'xlsx';
import { WordType } from '../types/Vocab';

export interface ParsedWordType {
  id?: string;
  wordIndex: number;
  english: string;
  korean: string;
  pronunciation: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  example: string;
  isNew?: boolean;
  isChanged?: boolean;
}

export interface ExportOptions {
  words: WordType[];
  vocabName: string;
}

// 함수 시그니처 수정 - 객체 하나로 받기
export const exportToExcel = (options: ExportOptions): void => {
  const { words, vocabName } = options;
  
  // 엑셀에 저장할 데이터 변환
  const excelData = words.map((word) => ({
    Id: word.id,
    WordIndex: word.wordIndex,
    English: word.english,
    Korean: word.korean,
    Pronunciation: word.pronunciation,
    Difficulty: word.difficulty,
    Example: word.example
  }));

  // 워크시트 생성
  const worksheet = XLSX.utils.json_to_sheet(excelData);
  
  // 열 너비 설정
  const columnWidths = [
    { wch: 36 }, // Id
    { wch: 8 },  // WordIndex
    { wch: 15 }, // English
    { wch: 15 }, // Korean
    { wch: 15 }, // Pronunciation
    { wch: 10 }, // Difficulty
    { wch: 50 }  // Example
  ];
  
  worksheet['!cols'] = columnWidths;
  
  // 워크북 생성
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Words');
  
  // 엑셀 파일 다운로드
  const filename = `${vocabName.replace(/\s+/g, '_')}_Words_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

export interface ImportResult {
  words: ParsedWordType[];
  added: number;
  updated: number;
  unchanged: number;
  errors: string[];
}

export const importFromExcel = (file: File, existingWords: WordType[]): Promise<ImportResult> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 첫 번째 시트 사용
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // 시트 데이터를 JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importResult: ImportResult = {
          words: [],
          added: 0,
          updated: 0,
          unchanged: 0,
          errors: []
        };
        
        // 데이터 매핑 및 유효성 검사
        jsonData.forEach((row: any, index) => {
          try {
            // 필수 필드 확인
            if (!row.English || !row.Korean) {
              importResult.errors.push(`행 ${index + 2}: 영어와 한국어는 필수 항목입니다.`);
              return;
            }
            
            // 난이도 유효성 검사
            const difficulty = row.Difficulty?.toUpperCase();
            if (difficulty && !['EASY', 'MEDIUM', 'HARD'].includes(difficulty)) {
              importResult.errors.push(`행 ${index + 2}: 난이도는 EASY, MEDIUM, HARD 중 하나여야 합니다.`);
              return;
            }
            
            const wordIndex = row.WordIndex || (importResult.words.length + 1);
            
            const parsedWord: ParsedWordType = {
              wordIndex: parseInt(wordIndex, 10),
              english: row.English,
              korean: row.Korean,
              pronunciation: row.Pronunciation || '',
              difficulty: (difficulty as "EASY" | "MEDIUM" | "HARD") || 'EASY',
              example: row.Example || ''
            };
            
            // 기존 단어와 비교
            if (row.Id) {
              const existingWord = existingWords.find(w => w.id === row.Id);
              if (existingWord) {
                parsedWord.id = existingWord.id;
                
                // 변경 여부 확인
                const isChanged = 
                  existingWord.english !== parsedWord.english ||
                  existingWord.korean !== parsedWord.korean ||
                  existingWord.pronunciation !== parsedWord.pronunciation ||
                  existingWord.difficulty !== parsedWord.difficulty ||
                  existingWord.example !== parsedWord.example ||
                  existingWord.wordIndex !== parsedWord.wordIndex;
                
                if (isChanged) {
                  parsedWord.isChanged = true;
                  importResult.updated++;
                } else {
                  importResult.unchanged++;
                }
              } else {
                // ID가 있지만 기존 단어에 없는 경우
                delete parsedWord.id; // ID 초기화하여 새 단어로 추가
                parsedWord.isNew = true;
                importResult.added++;
              }
            } else {
              // 새 단어
              parsedWord.isNew = true;
              importResult.added++;
            }
            
            importResult.words.push(parsedWord);
          } catch (error) {
            importResult.errors.push(`행 ${index + 2}: 처리 중 오류 발생`);
          }
        });
        
        // 단어 인덱스 기준으로 정렬
        importResult.words.sort((a, b) => a.wordIndex - b.wordIndex);
        
        resolve(importResult);
      } catch (error) {
        reject(`엑셀 파일 처리 중 오류가 발생했습니다: ${error}`);
      }
    };
    
    reader.onerror = () => {
      reject('파일을 읽는 중 오류가 발생했습니다.');
    };
    
    reader.readAsArrayBuffer(file);
  });
};