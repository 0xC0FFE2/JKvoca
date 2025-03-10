import React, { useRef, useEffect } from 'react';
import { StudyMode, Word } from '../../types/Types';

interface CharacterInputsProps {
  word: Word;
  studyMode: StudyMode;
  userInputs: string[];
  setUserInputs: React.Dispatch<React.SetStateAction<string[]>>;
  isCorrect: boolean | null;
  showAnswer: boolean;
  handleInputKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const CharacterInputs: React.FC<CharacterInputsProps> = ({
  word,
  studyMode,
  userInputs,
  setUserInputs,
  isCorrect,
  showAnswer,
  handleInputKeyDown,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const getKoreanInitialConsonant = (char: string): string => {
    try {
      if (!char || typeof char !== 'string' || char.length === 0) return '_';
      
      const code = char.charCodeAt(0);
      
      if (code >= 44032 && code <= 55203) {
        const initialConsonants = [
          "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
          "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
        ];
        const initialIndex = Math.floor((code - 44032) / 588);
        
        if (initialIndex >= 0 && initialIndex < initialConsonants.length) {
          return initialConsonants[initialIndex];
        }
      }
      
      return char;
    } catch (error) {
      console.error("한글 자음 추출 중 오류:", error);
      return '_';
    }
  };

  const isCompleteKoreanChar = (char: string): boolean => {
    if (!char) return false;
    
    const code = char.charCodeAt(0);
    return code >= 44032 && code <= 55203;
  };
  
  const targetWord = word && (studyMode === "englishToKorean" ? word.korean || "" : word.english || "");
  
  useEffect(() => {
    if (targetWord) {
      inputRefs.current = inputRefs.current.slice(0, targetWord.length);
    }
  }, [targetWord]);

  const handleInputChange = (index: number, value: string) => {
    if (!targetWord) return;
    
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);

    // 영어 → 한국어 모드가 아닐 때만(즉, 한국어 → 영어 모드일 때만) 자동 이동
    if (studyMode === "koreanToEnglish" && value && index < userInputs.length - 1) {
      let nextIndex = index + 1;
      while (nextIndex < userInputs.length && targetWord[nextIndex] === " ") {
        nextIndex++;
      }
      if (nextIndex < userInputs.length) {
        setTimeout(() => {
          if (inputRefs.current[nextIndex]) {
            inputRefs.current[nextIndex]?.focus();
          }
        }, 10);
      }
    }
    // 한글 입력 모드일 때는 자동 이동하지 않음
  };

  if (!word) {
    return <div className="text-center py-4 text-gray-500">단어를 불러오는 중...</div>;
  }
  
  if (!targetWord) {
    return <div className="text-center py-4 text-gray-500">단어를 불러오는 중...</div>;
  }

  if (userInputs.length !== targetWord.length) {
    const newInputs = Array(targetWord.length).fill('');
    setUserInputs(newInputs);
    return <div className="text-center py-4 text-gray-500">입력 칸 준비 중...</div>;
  }

  const displayTargetWord = targetWord.split('');
  const isKoreanInput = studyMode === "englishToKorean";

  return (
    <div className="flex flex-col items-center">
      {isKoreanInput && (
        <div className="text-sm text-gray-500 mb-3 bg-gray-100 p-2 rounded-md">
          한글 입력 시 <strong>Tab키</strong>를 눌러 다음 칸으로 이동하세요
        </div>
      )}
      <div className="flex justify-center flex-wrap gap-2 md:gap-3">
        {displayTargetWord.map((char, index) => {
          if (char === " ") {
            return <div key={`space-${index}`} className="w-4"></div>;
          }

          let hint = "";
          if (studyMode === "englishToKorean") {
            hint = getKoreanInitialConsonant(char);
          } else {
            hint = index === 0 ? char : "_";
          }

          return (
            <div key={index} className="flex flex-col items-center">
              <div className="text-gray-400 text-sm mb-1">
                {!showAnswer ? hint : char}
              </div>
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                id={`char-input-${index}`}
                type="text"
                value={userInputs[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleInputKeyDown(index, e)}
                maxLength={1}
                className={`w-14 h-14 text-center text-lg font-medium border-2 rounded-xl shadow-sm transition-all duration-200 ${
                  isCorrect === null
                    ? "border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                    : isCorrect
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-red-500 bg-red-50 text-red-700"
                } ${showAnswer ? "opacity-50" : "opacity-100"}`}
                disabled={isCorrect === true || showAnswer}
                autoComplete="off"
                autoCapitalize="off"
                autoFocus={index === 0}
                style={{
                  fontFamily: "'Noto Sans KR', sans-serif",
                  fontSize: isKoreanInput ? '20px' : '20px',
                  padding: '0',
                  textAlign: 'center',
                  lineHeight: '1.2',
                  WebkitTextFillColor: isCorrect === true ? 'green' : (isCorrect === false ? 'red' : 'inherit'),
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};