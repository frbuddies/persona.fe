import { ArrowRight, Clock, ListChecks, Users2, LayoutDashboard, Sparkles } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { PERSONAS } from '../data/personas';
import { ROLES } from '../data/roles';
import { getPersonaIcon, getRoleIcon } from '../utils/icons';
import { FieldInput } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { useBreakpoints } from '../hooks/useMediaQuery';

export default function IntroPage() {
  const { state, dispatch } = useAssessment();
  const canStart = state.userName.trim() && state.userEmail.trim() && state.userRole.trim() && state.filledFor;
  const { isDesktop } = useBreakpoints();

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1.1fr 0.9fr' : '1fr',
        gap: isDesktop ? '40px' : '0',
        marginBottom: '52px',
        alignItems: 'start',
      }}>
        <div style={{
          paddingTop: isDesktop ? '28px' : '0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #eaf1f8, #dce8f2)',
            color: '#1a5276',
            fontSize: '15px',
            fontWeight: '700',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '7px 16px',
            borderRadius: '20px',
            alignSelf: 'flex-start',
          }}>
            <Sparkles size={14} />
            RedRock Sales Assessment
          </div>
          <h1 style={{
            fontSize: 'clamp(35px, 6vw, 57px)',
            fontWeight: '800',
            lineHeight: '1.08',
            color: '#0f1628',
            letterSpacing: '-1.2px',
          }}>
            Which Seller<br />Are You?
          </h1>
          <p style={{
            fontSize: '15px',
            lineHeight: '1.85',
            color: '#4a5070',
            maxWidth: '460px',
          }}>
            Twenty questions. All answers are right. Discover your dominant seller persona, your most likely sales role match, and the development opportunities that matter most for your growth.
          </p>
          <div style={{
            display: 'flex',
            gap: isDesktop ? '24px' : '16px',
            flexWrap: 'wrap',
            paddingTop: '8px',
          }}>
            {[
              { icon: Clock, label: '~7 min' },
              { icon: ListChecks, label: '15 questions' },
              { icon: Users2, label: '6 personas' },
              { icon: LayoutDashboard, label: '4 role types' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: '#eaf1f8', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#1a5276',
                }}>
                  <Icon size={16} />
                </div>
                <span style={{ fontSize: '15px', fontWeight: '600', color: '#4a5070' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {isDesktop ? (
          <div style={{
            background: '#fff',
            border: '1.5px solid #dee6f0',
            borderRadius: '18px',
            padding: '34px 30px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #1a5276',
          }}>
            <FormContent state={state} dispatch={dispatch} canStart={canStart} />
          </div>
        ) : (
          <div style={{
            marginTop: '28px',
            background: '#fff',
            border: '1.5px solid #dee6f0',
            borderRadius: '18px',
            padding: '28px 24px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            borderLeft: '4px solid #1a5276',
          }}>
            <FormContent state={state} dispatch={dispatch} canStart={canStart} />
          </div>
        )}
      </div>

      <SectionHeader
        title="The Six Seller Personas"
        subtitle="A quick look at each seller persona before you begin. Your results will show which one aligns most with your natural style."
      />
      <PreviewGrid items={PERSONAS} getIcon={getPersonaIcon} />

      <div style={{ marginTop: '48px' }}>
        <SectionHeader
          title="The Four Sales Role Types"
          subtitle="The four sales role types describe how seller responsibilities are structured. Your results will reveal which role fits you best."
        />
        <PreviewGrid items={ROLES} getIcon={getRoleIcon} />
      </div>
    </div>
  );
}

function FormContent({ state, dispatch, canStart }) {
  return (
    <>
      <div style={{
        fontSize: '15px',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#0f1628',
        fontWeight: '700',
        marginBottom: '22px',
      }}>
        Tell Us About You
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          fontSize: '15px', fontWeight: '600', color: '#2a2d44',
          marginBottom: '6px', display: 'block',
        }}>
          Name
        </label>
        <FieldInput
          value={state.userName}
          onChange={(v) => dispatch({ type: 'SET_NAME', payload: v })}
          placeholder="e.g. Jane Smith"
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          fontSize: '15px', fontWeight: '600', color: '#2a2d44',
          marginBottom: '6px', display: 'block',
        }}>
          Email
        </label>
        <FieldInput
          value={state.userEmail}
          onChange={(v) => dispatch({ type: 'SET_EMAIL', payload: v })}
          placeholder="e.g. jane@company.com"
          type="email"
        />
      </div>
      <div style={{ marginBottom: '4px' }}>
        <label style={{
          fontSize: '15px', fontWeight: '600', color: '#2a2d44',
          marginBottom: '6px', display: 'block',
        }}>
          Role
        </label>
        <FieldInput
          value={state.userRole}
          onChange={(v) => dispatch({ type: 'SET_ROLE', payload: v })}
          placeholder="e.g. Sales Executive"
        />
      </div>
      <div style={{ marginBottom: '4px' }}>
        <label style={{
          fontSize: '15px', fontWeight: '600', color: '#2a2d44',
          marginBottom: '6px', display: 'block',
        }}>
          Filling for
        </label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {['myself', 'someone else'].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => dispatch({ type: 'SET_FILLED_FOR', payload: option })}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1.5px solid',
                borderColor: state.filledFor === option ? '#1a5276' : '#e0e3ef',
                background: state.filledFor === option ? '#eaf1f8' : '#fff',
                color: state.filledFor === option ? '#1a5276' : '#4a5070',
                fontSize: '15px',
                fontWeight: state.filledFor === option ? '700' : '500',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'capitalize',
              }}
              onMouseEnter={(e) => {
                if (state.filledFor !== option) e.currentTarget.style.borderColor = '#b8cfe0';
              }}
              onMouseLeave={(e) => {
                if (state.filledFor !== option) e.currentTarget.style.borderColor = '#e0e3ef';
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <p style={{ fontSize: '15px', color: '#4a5070', marginTop: '12px' }}>
        Your email is used only to send your results. It is never shared.
      </p>
      <div style={{ marginTop: '26px' }}>
        <Button
          disabled={!canStart}
          onClick={() => {
            dispatch({ type: 'SET_NAME', payload: state.userName });
            dispatch({ type: 'NEXT_QUESTION' });
          }}
          style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          Begin Assessment <ArrowRight size={18} />
        </Button>
      </div>
    </>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '22px' }}>
      <h2 style={{
        fontSize: '15px', fontWeight: '700', color: '#0f1628',
        marginBottom: '6px',
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: '16px', color: '#4a5070', lineHeight: '1.65', maxWidth: '580px' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function PreviewGrid({ items, getIcon }) {
  const { isDesktop, isTablet } = useBreakpoints();
  const cols = isDesktop ? 'repeat(3, 1fr)' : isTablet ? 'repeat(2, 1fr)' : '1fr';
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: cols,
      gap: '14px',
    }}>
      {items.map((item) => {
        const Icon = getIcon ? getIcon(item.id) : null;
        return (
          <PreviewCard key={item.id} item={item} Icon={Icon} />
        );
      })}
    </div>
  );
}

function PreviewCard({ item: it, Icon }) {
  return (
    <div
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderTopColor = it.accent;
        el.style.borderRightColor = it.accent;
        el.style.borderBottomColor = it.accent;
        el.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)';
        el.style.transform = 'translateY(-3px)';
        const ic = el.querySelector('.card-icon');
        if (ic) ic.style.background = `${it.accent}15`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderTopColor = '#e4e9f2';
        el.style.borderRightColor = '#e4e9f2';
        el.style.borderBottomColor = '#e4e9f2';
        el.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
        el.style.transform = 'translateY(0)';
        const ic = el.querySelector('.card-icon');
        if (ic) ic.style.background = '#f5f7fb';
      }}
      style={{
        borderRadius: '14px',
        padding: '24px 20px',
        border: '1.5px solid #e4e9f2',
        borderLeft: `3.5px solid ${it.accent}`,
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        cursor: 'default',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
        transform: 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
        <div
          className="card-icon"
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
            background: '#f5f7fb',
            color: it.accent,
            transition: 'background 0.25s ease',
          }}
        >
          {Icon && <Icon size={22} />}
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f1628' }}>{it.name}</div>
          <div style={{ fontSize: '15px', color: '#4a5070', marginTop: '2px' }}>{it.tagline}</div>
        </div>
      </div>
      {it.desc && (
        <p style={{
          fontSize: '15px', color: '#4a5070', lineHeight: '1.7',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {it.desc}
        </p>
      )}
      {it.characteristics && it.characteristics.length > 0 && (
        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f0f2f8' }}>
          {it.characteristics.slice(0, 2).map((c, i) => (
            <div key={i} style={{ fontSize: '15px', color: '#4a5070', lineHeight: '1.55', marginBottom: '4px' }}>
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
