import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AssessmentProvider, useAssessment } from './context/AssessmentContext';
import IntroPage from './pages/Intro';
import AssessmentPage from './pages/Assessment';
import ResultsPage from './pages/Results';
import AdminPage from './pages/Admin';
import AdminResultView from './pages/AdminResultView';
import AdminCompare from './pages/AdminCompare';
import RegisterPage from './pages/Register';
import logo from './assets/redrock_logo.webp';

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

function Navbar() {
  const isAuth = localStorage.getItem('isAuth') === 'true';
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '40px', minHeight: '80px',
    }}>
      <Link to="/" style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        textDecoration: 'none', color: '#0f1628',
        fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px',
      }}>
        <img src={logo} alt="RedRock" style={{ height: '100px', width: 'auto' }} />
        RedRock
      </Link>
      {!isAuth && (
        <Link to="/register" style={{
          textDecoration: 'none',
          background: 'linear-gradient(135deg, #1a5276, #1e6a8a)',
          color: '#fff', fontSize: '13px', fontWeight: '700',
          padding: '10px 20px', borderRadius: '10px',
          border: 'none', cursor: 'pointer',
          transition: 'opacity 0.2s',
        }}
          onMouseEnter={(e) => e.target.style.opacity = '0.9'}
          onMouseLeave={(e) => e.target.style.opacity = '1'}
        >
          Sign Up
        </Link>
      )}
    </nav>
  );
}

function AppLayout() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <AssessmentProvider>
            <AssessmentFlow />
          </AssessmentProvider>
        } />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/result" element={<AdminResultView />} />
        <Route path="/admin/compare" element={<AdminCompare />} />
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
