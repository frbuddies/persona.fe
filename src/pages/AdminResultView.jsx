import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ResultsContent from '../components/ResultsContent';

export default function AdminResultView() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;
  const [activeTip, setActiveTip] = useState(0);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9aa0b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚠</div>
        <div style={{ fontWeight: '700', marginBottom: '6px' }}>No result data found</div>
        <button
          onClick={() => navigate('/admin')}
          style={{
            marginTop: '16px', padding: '10px 24px',
            background: '#1a5276', color: '#fff', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
            fontSize: '13px', fontWeight: '600',
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/admin')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '13px', fontWeight: '600', color: '#4a5070',
          fontFamily: 'inherit', marginBottom: '24px', padding: '4px 0',
        }}
        onMouseEnter={(e) => e.target.style.color = '#1a5276'}
        onMouseLeave={(e) => e.target.style.color = '#4a5070'}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>
      <ResultsContent
        scores={data.personaScores || {}}
        roleScores={data.roleScores || {}}
        userName={data.name || ''}
        userEmail={data.email || ''}
        activeTip={activeTip}
        onSetActiveTip={setActiveTip}
        emailSent={emailSent}
        emailError={emailError}
        onViewResults={() => setEmailSent(true)}
        onEmail={() => {}}
        showActions={true}
      />
    </div>
  );
}
