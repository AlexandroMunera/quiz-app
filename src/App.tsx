import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { HomePage } from "@/pages/HomePage";
import { LevelSelectPage } from "@/pages/LevelSelectPage";
import { QuizPage } from "@/pages/QuizPage";
import { ResultsPage } from "@/pages/ResultsPage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/select-level" element={<LevelSelectPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
