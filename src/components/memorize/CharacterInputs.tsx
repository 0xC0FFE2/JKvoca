import React from 'react';
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
  // safety check: word가 undefined일 경우 빈 문자열 사용
  if (!word) {
    return <div className="text-center py-4">단어를 불러오는 중...</div>;
  }
  
  const targetWord = studyMode === "englishToKorean" ? word.korean || "" : word.english || "";

  // targetWord가 없을 경우 빈 컴포넌트 반환
  if (!targetWord) {
    return <div className="text-center py-4">단어를 불러오는 중...</div>;
  }

  const handleInputChange = (index: number, value: string) => {
    const newInputs = [...userInputs];
    newInputs[index] = value;
    setUserInputs(newInputs);

    if (
      studyMode === "koreanToEnglish" &&
      value &&
      index < userInputs.length - 1
    ) {
      let nextIndex = index + 1;

      while (nextIndex < userInputs.length && targetWord[nextIndex] === " ") {
        nextIndex++;
      }

      if (nextIndex < userInputs.length) {
        setTimeout(() => {
          const nextInput = document.getElementById(
            `char-input-${nextIndex}`
          );
          if (nextInput) {
            (nextInput as HTMLInputElement).focus();
          }
        }, 0);
      }
    }
  };

  // 안전하게 한글 자음 추출 함수
  const getKoreanInitialConsonant = (char: string): string => {
    try {
      if (!char || typeof char !== 'string' || char.length === 0) return '_';
      
      const code = char.charCodeAt(0);
      
      // 한글 범위 확인 (가 ~ 힣)
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
      
      // 한글이 아니면 그대로 반환
      return char;
    } catch (error) {
      console.error("한글 자음 추출 중 오류:", error);
      return '_';
    }
  };

  // userInputs 배열 길이 확인 및 조정
  if (userInputs.length !== targetWord.length) {
    const newInputs = Array(targetWord.length).fill('');
    setUserInputs(newInputs);
    return <div className="text-center py-4">입력 칸 준비 중...</div>;
  }

  return (
    <div className="flex justify-center space-x-2 flex-wrap">
      {targetWord.split('').map((char, index) => {
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
              id={`char-input-${index}`}
              type="text"
              value={userInputs[index] || ''}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleInputKeyDown(index, e)}
              maxLength={1}
              className={`w-10 h-10 text-center text-lg border rounded-lg ${
                isCorrect === null
                  ? "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  : isCorrect
                  ? "border-green-300 bg-green-50 text-green-700"
                  : "border-red-300 bg-red-50 text-red-700"
              }`}
              disabled={isCorrect === true || showAnswer}
              autoComplete="off"
              autoCapitalize="off"
              autoFocus={index === 0}
            />
          </div>
        );
      })}
    </div>
  );
};