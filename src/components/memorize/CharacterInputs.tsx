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
  const targetWord = studyMode === "englishToKorean" ? word.korean : word.english;

  const handleInputChange = (index: number, value: string) => {
    if (!word) return;

    if (value.length <= 1) {
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
    }
  };

  return (
    <div className="flex justify-center space-x-2 flex-wrap">
      {userInputs.map((charInput, index) => {
        if (targetWord[index] === " ") {
          return null;
        }

        let hint = "";
        if (studyMode === "englishToKorean") {
          const char = targetWord[index];
          const code = char.charCodeAt(0);

          if (code >= 44032 && code <= 55203) {
            const initialConsonants = [
              "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ",
              "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
            ];
            const initialIndex = Math.floor((code - 44032) / 588);
            hint = initialConsonants[initialIndex];
          } else {
            hint = char;
          }
        } else {
          hint = index === 0 ? targetWord[0] : "_";
        }

        return (
          <div key={index} className="flex flex-col items-center">
            <div className="text-gray-400 text-sm mb-1">
              {!showAnswer ? hint : targetWord[index]}
            </div>
            <input
              id={`char-input-${index}`}
              type="text"
              value={charInput}
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