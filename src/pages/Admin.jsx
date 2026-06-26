import { useState, useEffect } from 'react';
import { BarChart3, Users, RefreshCw, Calendar, Mail } from 'lucide-react';
import { useBreakpoints } from '../hooks/useMediaQuery';
import { fetchAllResults } from '../data/api';
import { PERSONAS } from '../data/personas';
import { ROLES } from '../data/roles';
import { getPersonaIcon } from '../utils/icons';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDesktop } = useBreakpoints();

  const load = () => {
    setLoading(true);
    setError(null);
    fetchAllResults()
      .then((res) => {
        if (res.success) {
          setData(res.data);
        } else {
          setError(res.message || 'Failed to load');
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '32px', gap: '16px', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #eaf1f8, #dce8f2)',
            color: '#1a5276', fontSize: '10px', fontWeight: '700',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '7px 16px', borderRadius: '20px', marginBottom: '12px',
          }}>
            <BarChart3 size={14} />
            Admin Dashboard
          </div>
          <h1 style={{
            fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: '800',
            color: '#0f1628', letterSpacing: '-0.5px', marginBottom: '4px',
          }}>
            All Submitted Results
          </h1>
          <p style={{ fontSize: '14px', color: '#9aa0b8' }}>
            {data ? `${data.length} result${data.length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#fff', border: '1.5px solid #e4e9f2',
            borderRadius: '10px', padding: '10px 20px',
            fontSize: '13px', fontWeight: '600', color: '#4a5070',
            cursor: 'pointer', fontFamily: 'inherit',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.target.style.borderColor = '#1a5276'; e.target.style.color = '#1a5276'; }}
          onMouseLeave={(e) => { e.target.style.borderColor = '#e4e9f2'; e.target.style.color = '#4a5070'; }}
        >
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading && !data && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#9aa0b8' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #eef0f6',
            borderTopColor: '#1a5276', borderRadius: '50%',
            margin: '0 auto 16px', animation: 'spin 0.8s linear infinite',
          }} />
          Loading results...
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#fff5f5', border: '1.5px solid #f5c6cb',
          borderRadius: '14px', color: '#721c24',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚠</div>
          <div style={{ fontWeight: '700', marginBottom: '6px' }}>Failed to load results</div>
          <div style={{ fontSize: '13px', color: '#a05858' }}>{error}</div>
          <button
            onClick={load}
            style={{
              marginTop: '16px', padding: '8px 24px',
              background: '#1a5276', color: '#fff', border: 'none',
              borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '13px', fontWeight: '600',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {data && data.length === 0 && !loading && (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: '#fff', border: '1.5px solid #e4e9f2',
          borderRadius: '14px', color: '#9aa0b8',
        }}>
          <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#6a7090', marginBottom: '6px' }}>
            No results yet
          </div>
          <div style={{ fontSize: '13px' }}>
            Complete the assessment to see your results here.
          </div>
        </div>
      )}

      {/* Results list */}
      {data && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map((item) => (
            <ResultCard key={item._id} item={item} isDesktop={isDesktop} />
          ))}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ResultCard({ item, isDesktop }) {
  const added = item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—';

  const topPersonaData = item.topPersona
    ? PERSONAS.find((p) => p.id === item.topPersona)
    : null;
  const topPersonaName = topPersonaData?.name || item.topPersona || '—';
  const TopIcon = item.topPersona ? getPersonaIcon(item.topPersona) : null;

  const scores = item.personaScores || {};
  const roleScores = item.roleScores || {};

  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #dee6f0',
      borderRadius: '16px',
      padding: isDesktop ? '24px 28px' : '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      borderLeft: `4px solid ${topPersonaData?.accent || '#b0bdd4'}`,
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: '16px', marginBottom: '18px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {TopIcon && (
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: `${topPersonaData?.accent || '#eaf1f8'}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: topPersonaData?.accent || '#1a5276', flexShrink: 0,
            }}>
              <TopIcon size={22} />
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f1628' }}>
                {item.name}
              </span>
              <span style={{
                fontSize: '9px', background: topPersonaData?.accent || '#b0bdd4',
                color: '#fff', borderRadius: '6px', padding: '3px 10px',
                fontWeight: '700', letterSpacing: '0.03em',
              }}>
                {topPersonaName}
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              marginTop: '4px', fontSize: '12px', color: '#9aa0b8',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} /> {item.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {added}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: isDesktop ? '24px' : '16px',
      }}>
        <ScoreTable scores={scores} label="Persona Scores" accent={topPersonaData?.accent} />
        <ScoreTable scores={roleScores} label="Role Scores" accent="#8e44ad" />
      </div>
    </div>
  );
}

function ScoreTable({ scores, label, accent }) {
  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...entries.map(([, v]) => v), 1);

  return (
    <div>
      <div style={{
        fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
        color: '#b0b8cc', fontWeight: '600', marginBottom: '10px',
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {entries.map(([id, val]) => {
          const persona = PERSONAS.find((p) => p.id === id);
          const role = ROLES.find((r) => r.id === id);
          const name = persona?.name || role?.name || id;
          const emoji = persona?.emoji || role?.emoji || '';
          const pct2 = Math.round((val / maxVal) * 100);
          const isTop = pct2 >= 100;
          return (
            <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '20px', textAlign: 'center', fontSize: '14px', flexShrink: 0 }}>{emoji}</span>
              <span style={{
                flex: 1, fontSize: '12px', color: isTop ? '#0f1628' : '#6a7090',
                fontWeight: isTop ? '700' : '400', minWidth: '100px',
              }}>
                {name}
              </span>
              <div style={{ flex: 2, height: '5px', background: '#eef0f6', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  background: isTop ? (accent || '#1a5276') : '#b0bdd4',
                  width: `${pct2}%`, transition: 'width 0.4s',
                }} />
              </div>
              <span style={{
                width: '28px', textAlign: 'right', fontSize: '11px',
                color: '#b0b8cc', fontWeight: isTop ? '600' : '400',
              }}>
                {val}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
