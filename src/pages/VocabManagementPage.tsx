import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Layout from "../layouts/Layout";

import VocabList from "../components/vocab/VocabList";
import NewVocabForm from "../components/vocab/NewVocabForm";
import WordList from "../components/vocab/WordList";
import NewWordForm from "../components/vocab/NewWordForm";

import { 
  fetchAllVocabs, 
  fetchAllWordsByVocabId, 
  createVocab,
  deleteVocab,
  createWord,
  updateWord,
  deleteWord
} from "../services/AdminVocabService";

import { 
  Vocab, 
  WordType, 
  NewVocabFormType,
  NewWordFormType
} from "../types/Vocab";

const VocabManagementPage: React.FC = () => {
  const [vocabs, setVocabs] = useState<Vocab[]>([]);
  const [selectedVocab, setSelectedVocab] = useState<Vocab | null>(null);
  const [words, setWords] = useState<WordType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showNewVocabForm, setShowNewVocabForm] = useState<boolean>(false);
  const [showNewWordForm, setShowNewWordForm] = useState<boolean>(false);

  useEffect(() => {
    loadVocabs();
  }, []);

  useEffect(() => {
    if (selectedVocab) {
      loadWords(selectedVocab.vocabId);
    }
  }, [selectedVocab]);

  const loadVocabs = async () => {
    setLoading(true);
    try {
      const data = await fetchAllVocabs();
      setVocabs(data);
      setError(null);
    } catch (err) {
      setError("단어장 목록을 가져오는데 실패했습니다");
      setVocabs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadWords = async (vocabId: string) => {
    setLoading(true);
    try {
      const data = await fetchAllWordsByVocabId(vocabId);
      setWords(data);
      setError(null);
    } catch (err) {
      setError("단어 목록을 가져오는데 실패했습니다");
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVocab = (vocab: Vocab) => {
    setSelectedVocab(vocab);
  };

  const handleCreateVocab = async (vocabData: NewVocabFormType) => {
    try {
      await createVocab(vocabData);
      await loadVocabs();
      setShowNewVocabForm(false);
    } catch (err) {
      setError("단어장 생성에 실패했습니다");
    }
  };

  const handleDeleteVocab = async (vocabId: string) => {
    if (!window.confirm("정말로 이 단어장을 삭제하시겠습니까?")) return;
    
    try {
      await deleteVocab(vocabId);
      await loadVocabs();
      if (selectedVocab?.vocabId === vocabId) {
        setSelectedVocab(null);
        setWords([]);
      }
    } catch (err) {
      setError("단어장 삭제에 실패했습니다");
    }
  };

  const handleCreateWord = async (wordData: NewWordFormType) => {
    if (!selectedVocab) return;
    
    try {
      await createWord(selectedVocab.vocabId, wordData);
      await loadWords(selectedVocab.vocabId);
      setShowNewWordForm(false);
    } catch (err) {
      setError("단어 생성에 실패했습니다");
    }
  };

  const handleUpdateWord = async (updatedWord: WordType) => {
    try {
      await updateWord(updatedWord);
      if (selectedVocab) {
        await loadWords(selectedVocab.vocabId);
      }
    } catch (err) {
      setError("단어 수정에 실패했습니다");
    }
  };

  const handleDeleteWord = async (wordId: string) => {
    if (!window.confirm("정말로 이 단어를 삭제하시겠습니까?")) return;
    
    try {
      await deleteWord(wordId);
      if (selectedVocab) {
        await loadWords(selectedVocab.vocabId);
      }
    } catch (err) {
      setError("단어 삭제에 실패했습니다");
    }
  };

  const handleChangeWordOrder = async (wordId: string, direction: "up" | "down") => {
    const currentIndex = words.findIndex(word => word.id === wordId);
    if (
      (direction === "up" && currentIndex === 0) || 
      (direction === "down" && currentIndex === words.length - 1)
    ) return;

    const adjacentWordIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    const adjacentWord = words[adjacentWordIndex];

    try {
      const updatedWords = [...words];
      const wordToMove: WordType = {...updatedWords[currentIndex]};
      const tempIndex = wordToMove.wordIndex;
      
      wordToMove.wordIndex = adjacentWord.wordIndex;
      updatedWords[adjacentWordIndex] = {...adjacentWord, wordIndex: tempIndex};
      updatedWords[currentIndex] = wordToMove;
      
      setWords([...updatedWords].sort((a, b) => a.wordIndex - b.wordIndex));

      await updateWord(wordToMove);
      await updateWord(updatedWords[adjacentWordIndex]);
    } catch (err) {
      setError("단어 순서 변경에 실패했습니다");
      if (selectedVocab) {
        await loadWords(selectedVocab.vocabId);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">단어장 관리</h1>
          <button
            type="button"
            onClick={() => setShowNewVocabForm(true)}
            className="flex items-center py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Plus size={16} className="mr-1" /> 새 단어장 만들기
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showNewVocabForm && (
          <NewVocabForm 
            onClose={() => setShowNewVocabForm(false)} 
            onSubmit={handleCreateVocab} 
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VocabList 
              vocabs={vocabs}
              selectedVocab={selectedVocab}
              loading={loading && !selectedVocab}
              onSelectVocab={handleSelectVocab}
              onDeleteVocab={handleDeleteVocab}
            />
          </div>

          <div className="lg:col-span-2">
            {selectedVocab ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-1">{selectedVocab.vocabName}</h2>
                    <p className="text-gray-600 text-sm">{selectedVocab.vocabDescription}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowNewWordForm(true)}
                    className="flex items-center py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  >
                    <Plus size={16} className="mr-1" /> 단어 추가
                  </button>
                </div>

                {showNewWordForm && (
                  <NewWordForm 
                    onClose={() => setShowNewWordForm(false)}
                    onSubmit={handleCreateWord}
                  />
                )}

                <WordList 
                  words={words}
                  loading={loading && !!selectedVocab}
                  onEditWord={handleUpdateWord}
                  onDeleteWord={handleDeleteWord}
                  onChangeWordOrder={handleChangeWordOrder}
                />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center h-64">
                <p className="text-gray-500 text-lg mb-4">단어장을 선택해주세요</p>
                <p className="text-gray-400">좌측에서 관리할 단어장을 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VocabManagementPage;