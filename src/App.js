import { Routes, Route, BrowserRouter } from "react-router-dom";
import List from "./List";
import Cvedata from "./Cvedata";
import NotFoundPage from "./NotFoundPage";
import './App.css'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<List />} />
          <Route path="/cvedata/:id" element={<Cvedata />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
