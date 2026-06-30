import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import IntroPage from './pages/Intro';
import AssessmentPage from './pages/Assessment';
import ResultsPage from './pages/Results';
import AdminPage from './pages/Admin';
import RegisterPage from './pages/Register';

function AssessmentFlow() {
  const { state } = useAssessment();
  switch (state.screen) {
    case 'intro':
      return <IntroPage />;
    case 'assessment':
      return <AssessmentPage />;
    case 'results':
      return <ResultsPage />;
    default:
      return <IntroPage />;
  }
}

function AppLayout() {
  return (
    <div>
      <Routes>
        <Route path="/" element={
          <AssessmentProvider>
            <AssessmentFlow />
          </AssessmentProvider>
        } />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="wrap">
        <AppLayout />
      </div>
    </BrowserRouter>
  );
}
