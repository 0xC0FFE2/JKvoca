import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ServiceIntroduction from "./pages/DefaultIntro";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ServiceIntroduction />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;