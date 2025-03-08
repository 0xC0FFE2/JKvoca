import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../layouts/Layout";
import { ModeSelectionScreen } from "../components/memorize/ModeSelectionScreen";
import { StudyInterface } from "../components/memorize/StudyInterface";
import { useWordStudy } from "../hooks/useWordStudy";
import { Word, StudyMode } from "../types/Types";
import { getVocabulary } from "../utils/tts";
import { BatchSelectionScreen } from "../components/memorize/BatchSelectionScreen";

const MemorizePage: React.FC = () => {
  const { vocabId } = useParams<{ vocabId: string }>();
  const navigate = useNavigate();

  const [words, setWords] = useState<Word[]>([]);
  const [studyMode, setStudyMode] = useState<StudyMode>("englishToKorean");
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [showBatchSelection, setShowBatchSelection] = useState(false);
  const [selectedBatchSize, setSelectedBatchSize] = useState(5);

  useEffect(() => {
    if (vocabId) {
      const fetchedWords = getVocabulary(vocabId);
      setWords(fetchedWords);
    }
  }, [vocabId]);

  const studyHook = useWordStudy(
    !showModeSelection && !showBatchSelection ? words : [],
    selectedBatchSize
  );

  const { currentWord, userInputs, setUserInputs } = studyHook;

  useEffect(() => {
    if (currentWord) {
      const targetWord =
        studyMode === "englishToKorean"
          ? currentWord.korean
          : currentWord.english;

      if (userInputs.length !== targetWord.length) {
        const newInputs = Array(targetWord.length)
          .fill("")
          .map((_, index) => (targetWord[index] === " " ? " " : ""));
        setUserInputs(newInputs);
      }
    }
  }, [currentWord, studyMode, userInputs.length, setUserInputs]);

  const toggleStudyMode = () => {
    setStudyMode((prev) =>
      prev === "englishToKorean" ? "koreanToEnglish" : "englishToKorean"
    );
    studyHook.setCurrentWordIndex(0);
    setUserInputs([]);
    studyHook.setIsCorrect(null);
    studyHook.setShowAnswer(false);
  };

  const exitMemorizeMode = () => {
    navigate(`/vocabulary/${vocabId}`);
  };

  const saveProgress = () => {
    alert("진행 상황이 저장되었습니다.");
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {showModeSelection ? (
          <ModeSelectionScreen
            setStudyMode={setStudyMode}
            setShowModeSelection={setShowModeSelection}
            setShowBatchSelection={setShowBatchSelection}
          />
        ) : showBatchSelection ? (
          <BatchSelectionScreen
            selectedBatchSize={selectedBatchSize}
            setSelectedBatchSize={setSelectedBatchSize}
            setShowModeSelection={setShowModeSelection}
            setShowBatchSelection={setShowBatchSelection}
            words={words}
            setCurrentBatch={studyHook.setCurrentBatch}
          />
        ) : (
          <StudyInterface
            vocabId={vocabId || ""}
            words={words}
            studyMode={studyMode}
            toggleStudyMode={toggleStudyMode}
            setShowModeSelection={setShowModeSelection}
            exitMemorizeMode={exitMemorizeMode}
            saveProgress={saveProgress}
            studyHook={studyHook}
          />
        )}
      </div>
    </Layout>
  );
};

export default MemorizePage;