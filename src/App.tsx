import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ServiceIntroduction from "./pages/DefaultIntro";
import SearchResultsPage from "./pages/SearchResultsPage";
import FlashcardPage from "./pages/FlashcardPage";
import MemorizePage from "./pages/MemorizePage";
import VocabularyPage from "./pages/VocabularyPage";
import OAuthHandler from "./pages/OAuthHandler";
import VocabManagementPage from "./pages/VocabManagementPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ServiceIntroduction />} />
        <Route path="/search/:keyword" element={<SearchResultsPage />} />
        <Route path="/vocabulary/:vocabId" element={<VocabularyPage />} />
        <Route path="/flashcard/:vocabId" element={<FlashcardPage />} />
        <Route path="/memorize/:vocabId" element={<MemorizePage />} />
        <Route path="/oauth_handler" element={<OAuthHandler />} />
        <Route path="/vocab/" element={<VocabManagementPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;