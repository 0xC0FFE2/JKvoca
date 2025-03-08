import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ServiceIntroduction from "./pages/ServiceIntroduction";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/service/intro" element={<ServiceIntroduction />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;