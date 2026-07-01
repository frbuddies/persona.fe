import { useEffect, useRef } from 'react';
import { useAssessment } from '../context/AssessmentContext';
import { sendResultsToBackend } from '../data/api';
import ResultsContent from '../components/ResultsContent';

export default function ResultsPage() {
  const { state, dispatch } = useAssessment();
  const sentRef = useRef(false);

  useEffect(() => {
    const keys = Object.keys(state.scores);
    if (state.userName && state.userEmail && keys.length > 0 && !sentRef.current) {
      sentRef.current = true;
      const topPersona = keys.reduce((a, b) => state.scores[a] > state.scores[b] ? a : b);
      const params = new URLSearchParams(window.location.search);
      const client_id = params.get('client_id');
      sendResultsToBackend({
        name: state.userName,
        email: state.userEmail,
        role: state.userRole,
        personaScores: state.scores,
        roleScores: state.roleScores,
        topPersona,
        ...(client_id && { client_id }),
      });
    }
  }, []);

  return (
    <ResultsContent
      scores={state.scores}
      roleScores={state.roleScores}
      userName={state.userName}
      userEmail={state.userEmail}
      activeTip={state.activeTip}
      onSetActiveTip={(i) => dispatch({ type: 'SET_ACTIVE_TIP', payload: i })}
      emailSent={state.emailSent}
      emailError={state.emailError}
      onViewResults={() => dispatch({ type: 'SET_EMAIL_SENT' })}
      onEmail={() => {}}
      onRetake={() => dispatch({ type: 'RETAKE' })}
      showActions={true}
    />
  );
}
