import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { QUESTIONS } from '../data/questions';
import { ProgressBar, ProgressDots } from '../components/ui/Progress';
import { Button, OptionButton } from '../components/ui/Button';
import { useBreakpoints } from '../hooks/useMediaQuery';

export default function AssessmentPage() {
  const { state, dispatch } = useAssessment();
  const q = QUESTIONS[state.qi];
  const total = QUESTIONS.length;
  const isLast = state.qi + 1 >= total;
  const { isDesktop } = useBreakpoints();

  return (
    <div>
      {/* ── Progress header ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{ flex: 1 }}>
          <ProgressBar />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '8px',
          }}>
            <div style={{ fontSize: '18px', color: '#4a5070', fontWeight: '600' }}>
              Question <strong style={{ color: '#4a5070' }}>{state.qi + 1}</strong> of {total}
            </div>
            <div style={{ fontSize: '18px', color: '#4a5070', fontWeight: '600' }}>
              {Math.round((state.qi / total) * 100)}% complete
            </div>
          </div>
        </div>
        {!isDesktop && (
          <div style={{ flexShrink: 0 }}>
            <ProgressDots />
          </div>
        )}
      </div>

      {isDesktop && (
        <div style={{ marginBottom: '24px' }}>
          <ProgressDots />
        </div>
      )}

      {/* ── Question card ── */}
      <div style={{
        background: '#fff',
        border: '1.5px solid #e4e9f2',
        borderRadius: '16px',
        padding: isDesktop ? '36px 40px' : '28px 24px',
        marginBottom: '20px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        borderTop: '3px solid #1a5276',
      }}>
        <h2 style={{
          fontSize: 'clamp(20px, 3vw, 25px)',
          fontWeight: '700',
          lineHeight: '1.5',
          marginBottom: '28px',
          color: '#0f1628',
        }}>
          {q.q}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: '10px',
        }}>
          {q.o.map((opt, i) => (
            <OptionButton
              key={i}
              active={state.selected === opt}
              onClick={() => dispatch({ type: 'SELECT_OPTION', payload: opt })}
            >
              {opt.t}
            </OptionButton>
          ))}
        </div>
      </div>

      {/* ── Navigation ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
      }}>
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: 'PREV_QUESTION' })}
          style={{
            visibility: state.qi === 0 ? 'hidden' : 'visible',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ArrowLeft size={16} /> Back
        </Button>
        <Button
          disabled={!state.selected}
          onClick={() => dispatch({ type: 'NEXT_QUESTION' })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '14px 36px',
          }}
        >
          {isLast ? 'View My Results' : 'Continue'} <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
