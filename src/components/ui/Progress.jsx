import { useAssessment } from '../../context/AssessmentContext';
import { QUESTIONS } from '../../data/questions';

export function ProgressBar() {
  const { state } = useAssessment();
  const total = QUESTIONS.length;
  const pct = Math.round((state.qi / total) * 100);
  return (
    <div style={{
      height: '4px',
      background: '#eef0f6',
      borderRadius: '3px',
      marginBottom: '32px',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        background: 'linear-gradient(90deg, #1a5276, #2e86c1)',
        borderRadius: '3px',
        width: `${pct}%`,
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }} />
    </div>
  );
}

export function ProgressDots() {
  const { state } = useAssessment();
  const total = QUESTIONS.length;
  return (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: i === state.qi ? '6px' : '4px',
          width: i === state.qi ? '16px' : '4px',
          borderRadius: '3px',
          background: i <= state.qi
            ? 'linear-gradient(90deg, #1a5276, #2e86c1)'
            : '#e0e3ef',
          transition: 'all 0.3s ease',
        }} />
      ))}
    </div>
  );
}
