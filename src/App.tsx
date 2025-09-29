import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import QuizBuilder from './pages/builder/QuizBuilder';
import EnterQuiz from './pages/play/EnterQuiz';
import QuizIntroduction from './pages/play/QuizIntroduction';
import PlayQuiz from './pages/play/PlayQuiz';
import QuizResult from './pages/play/QuizResult';

function App() {
  return (
    <div className="bg-interface-subtle">
      <div className="max-w-screen-lg mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<QuizBuilder />} />
          <Route
            path="/play/*"
            element={
              <Routes>
                <Route index element={<EnterQuiz />} />
                <Route path="introduction" element={<QuizIntroduction />} />
                <Route path="quiz" element={<PlayQuiz />} />
                <Route path="result" element={<QuizResult />} />
              </Routes>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
