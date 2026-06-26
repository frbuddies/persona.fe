import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import IntroPage from './pages/Intro';
import AssessmentPage from './pages/Assessment';
import ResultsPage from './pages/Results';
import AdminPage from './pages/Admin';

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

function NavBar() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'flex-end', gap: '16px',
      padding: '12px 0', marginBottom: '8px',
    }}>
      <Link to="/" style={{
        fontSize: '12px', color: '#9aa0b8', textDecoration: 'none',
        fontWeight: '500', letterSpacing: '0.02em',
      }}>
        Assessment
      </Link>
      <Link to="/admin" style={{
        fontSize: '12px', color: '#9aa0b8', textDecoration: 'none',
        fontWeight: '500', letterSpacing: '0.02em',
      }}>
        Admin
      </Link>
    </div>
  );
}

function AppLayout() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={
          <AssessmentProvider>
            <AssessmentFlow />
          </AssessmentProvider>
        } />
        <Route path="/admin" element={<AdminPage />} />
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
