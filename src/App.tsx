import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ServiceIntroduction from "./pages/DefaultIntro";
import SearchResultsPage from "./pages/SearchResultsPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ServiceIntroduction />} />
        <Route path="/search/:keyword" element={<SearchResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;