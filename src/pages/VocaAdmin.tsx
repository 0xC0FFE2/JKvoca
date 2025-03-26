import React, { useState, useEffect, useRef } from "react";
import { Word } from "../types/Types";
import { Volume2, X, Pause, Play, CheckCircle, ArrowRight } from "lucide-react";
import classroomService from "../services/AdminClassroomService";
import { speakWord } from "../utils/tts";

interface VocaAdminProps {
  words: Word[];
  classroomId: string;
  onClose: () => void;
}

const VocaAdmin: React.FC<VocaAdminProps> = ({
  words,
  classroomId,
  onClose,
}) => {
  const [shuffledWords, setShuffledWords] = useState<Word[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [playingWordId, setPlayingWordId] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [currentWordRepeat, setCurrentWordRepeat] = useState<number>(0);

  const intervalRef = useRef<number | null>(null);
  const PLAY_INTERVAL = 14500;
  const ANSWER_DELAY = 2000;
  const MAX_WORD_REPEATS = 2;

  useEffect(() => {
    if (words.length > 0) {
      const shuffled = [...words].sort(() => Math.random() - 0.5);
      setShuffledWords(shuffled);
    }
  }, [words]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const startTest = () => {
    setTestStarted(true);
    setCurrentWordIndex(0);
    setCurrentWordRepeat(0);
    startPlayback();
  };

  const startPlayback = () => {
    setIsPlaying(true);
    setShowAnswer(false);

    playCurrentWord(currentWordIndex);

    intervalRef.current = window.setInterval(() => {
      setCurrentWordIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= shuffledWords.length) {
          stopPlayback();
          setTestCompleted(true);
          return prevIndex;
        }

        setShowAnswer(false);
        setCurrentWordRepeat(0);
        playCurrentWord(nextIndex);
        return nextIndex;
      });
    }, PLAY_INTERVAL);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    window.speechSynthesis.cancel();
    setPlayingWordId(null);
  };

  const playCurrentWord = (index: number) => {
    if (index < shuffledWords.length) {
      const word = shuffledWords[index];
      setPlayingWordId(word.id);

      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = "en-US";
      utterance.rate = 0.9;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        // If we haven't repeated the maximum number of times, repeat the word
        if (currentWordRepeat < MAX_WORD_REPEATS - 1) {
          setCurrentWordRepeat(prev => prev + 1);
          
          // Slight delay before repeating
          setTimeout(() => {
            const repeatUtterance = new SpeechSynthesisUtterance(word.english);
            repeatUtterance.lang = "en-US";
            repeatUtterance.rate = 0.9;
            window.speechSynthesis.speak(repeatUtterance);
          }, 500);
        } else {
          setTimeout(() => {
            setPlayingWordId(null);
          }, 500);
        }
      };
    }
  };

  const handleMoveToNextTest = async () => {
    try {
      const success = await classroomService.moveToNextTest(classroomId);
      if (success) {
        window.location.reload();
      }
    } catch (error) {
      console.error("다음 시험으로 이동 중 오류:", error);
    }
  };

  const progressPercent = shuffledWords.length
    ? Math.min(100, ((currentWordIndex + 1) / shuffledWords.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-7xl h-[600px] mx-4 overflow-hidden flex shadow-2xl">
        <div className="w-1/3 p-6 border-r border-gray-100 flex flex-col bg-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">단어 시험</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {testStarted && (
            <div className="mb-6">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span className="font-medium">
                  {currentWordIndex + 1}/{shuffledWords.length} 단어
                </span>
                <span className="text-blue-500">
                  {Math.floor(progressPercent)}%
                </span>
              </div>
            </div>
          )}

          {!testStarted ? (
            <div className="flex-grow">
              <div className="bg-blue-50 p-6 rounded-2xl mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-3">
                  TTS 단어 시험
                </h3>
                <p className="text-blue-700 leading-relaxed">
                  총{" "}
                  <span className="font-semibold text-blue-900 mb-16">
                    {shuffledWords.length}개
                  </span>
                  의 단어를 TTS로 테스트합니다
                </p>
              </div>

              <button
                onClick={startTest}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center shadow-lg"
              >
                <Play size={20} className="mr-2" /> 시험 시작하기
              </button>
            </div>
          ) : testCompleted ? (
            <div className="flex-grow flex flex-col">
              <div className="flex flex-col items-center justify-center mb-8 flex-grow">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5 shadow-md">
                  <CheckCircle size={40} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  완료!
                </h3>
              </div>

              <button
                onClick={handleMoveToNextTest}
                className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center mt-auto shadow-lg"
              >
                단어장 넘기기 <ArrowRight size={18} className="ml-2" />
              </button>
            </div>
          ) : (
            <div className="flex-grow flex flex-col">
              {isPlaying ? (
                <>
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="w-full text-center">
                      <div className="mb-6 p-6 rounded-2xl">
                        {playingWordId && (
                          <div className="flex items-center justify-center mt-4">
                            <div className="w-20 h-20 bg-blue-500 rounded-full animate-ping mr-2"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={stopPlayback}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center shadow-lg"
                  >
                    <Pause size={20} className="mr-2" /> 시험 중단하기
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-yellow-50 p-6 rounded-2xl mb-6 flex-grow">
                    <h3 className="font-bold text-lg text-yellow-800 mb-3">
                      시험이 일시중지되었습니다
                    </h3>
                    <p className="text-yellow-700">
                      계속해서 진행하려면 아래 버튼을 눌러주세요.
                    </p>
                  </div>

                  <button
                    onClick={startPlayback}
                    className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center shadow-lg"
                  >
                    <Play size={20} className="mr-2" /> 시험 계속하기
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="w-2/3 overflow-hidden">
          {!testCompleted && (
            <div className="h-full relative">
              <video
                className="w-full h-full object-cover"
                src="/loader_a.mp4"
                autoPlay
                loop
                muted
                style={{ filter: "brightness(0.5)" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8 py-6 bg-opacity-60 rounded-xl max-w-lg">
                  <p className="text-white text-2xl font-bold leading-relaxed tracking-wide font-writing">
                    후회하기 싫으면 그렇게 살지 말고,
                    <br />
                    그렇게 살거면 후회하지 마라.
                  </p>
                </div>
              </div>
            </div>
          )}

          {testCompleted && (
            <div className="h-full p-6 overflow-hidden">
              <h3 className="font-bold mb-4 text-xl text-gray-900 pb-3 border-b border-gray-200">
                단어 목록 - {" "}
                <span className="text-blue-500">
                  {shuffledWords.length}개
                </span>
              </h3>
              <div className="h-[500px] overflow-y-auto pr-2 styled-scrollbar">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {shuffledWords.map((word, index) => (
                    <div
                      key={word.id}
                      className="bg-white p-4 rounded-xl transition-shadow border border-gray-100"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                              {index + 1}
                            </span>
                            <span className="font-bold text-gray-900">
                              {word.english.toLowerCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mt-2 font-medium">
                            {word.korean}
                          </p>
                        </div>
                        <button
                          onClick={() => speakWord(word.english, "en-US")}
                          className="p-2 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <Volume2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocaAdmin;