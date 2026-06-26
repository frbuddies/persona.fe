import { useEffect, useMemo, useRef } from 'react';
import { Sparkles, Mail, Printer, Target, RotateCcw, BookOpen, BarChart3, Lightbulb, Users, Shield, TrendingUp } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import { getSortedPersonas, getSortedRoles, pct } from '../utils/scoring';
import { sendResultsToBackend } from '../data/api';
import { buildEmailHTML } from '../utils/email';
import { getPersonaIcon, getRoleIcon } from '../utils/icons';
import { Button, TipTab } from '../components/ui/Button';
import { Overline, Divider, Card, ScoreBar } from '../components/ui/Common';
import { RadarChart } from '../components/ui/RadarChart';
import { useBreakpoints } from '../hooks/useMediaQuery';

export default function ResultsPage() {
  const { state, dispatch } = useAssessment();
  const { isDesktop } = useBreakpoints();
  const sentRef = useRef(false);

  const sortedP = useMemo(() => getSortedPersonas(state.scores), [state.scores]);
  const maxP = sortedP[0]?.score || 1;
  const pri = sortedP[0];

  const sortedR = useMemo(() => getSortedRoles(state.roleScores), [state.roleScores]);
  const maxR = sortedR[0]?.score || 1;
  const priRole = sortedR[0];

  useEffect(() => {
    const keys = Object.keys(state.scores);
    if (state.userName && state.userEmail && keys.length > 0 && !sentRef.current) {
      sentRef.current = true;
      const topPersona = keys.reduce((a, b) => state.scores[a] > state.scores[b] ? a : b);
      sendResultsToBackend({
        name: state.userName,
        email: state.userEmail,
        personaScores: state.scores,
        roleScores: state.roleScores,
        topPersona,
      });
    }
  }, []);

  if (!pri || !priRole) return null;

  const lowP = sortedP.filter((prof) => pct(prof, maxP) < 20);

  const handleViewResults = () => {
    const html = buildEmailHTML({ sortedP, maxP, pri, sortedR, maxR, priRole, S: state });
    const win = window.open('', '_blank');
    if (!win) {
      dispatch({ type: 'SET_EMAIL_ERROR', payload: 'Pop-up blocked. Please allow pop-ups and try again.' });
      return;
    }
    win.document.write(html);
    win.document.close();
    dispatch({ type: 'SET_EMAIL_SENT' });
  };

  const handleEmail = () => {
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    const lines = [
      'DWEnterprise Sales Assessment Results',
      '=====================================',
      `Name: ${state.userName}`,
      `Date: ${date}`, '',
      `PRIMARY PERSONA: ${pri.emoji} ${pri.name} \u2014 ${pri.tagline}`, '',
      pri.desc, '',
      'CORE STRENGTHS',
      ...pri.strengths.map((s) => `  \u2022 ${s}`), '',
      'GROWTH OPPORTUNITIES',
      ...pri.growth.map((g) => `  \u2022 ${g}`), '',
      'DEVELOPMENT TIPS',
      ...pri.tips.flatMap((t, i) => [`  ${i + 1}. ${t.label}: ${t.text}`, '']),
      'PERSONA SCORES',
      ...sortedP.map((pp) => `  ${pp.emoji} ${pp.name}: ${pct(pp, maxP)}%`), '',
      `MOST LIKELY ROLE MATCH: ${priRole.emoji} ${priRole.name} \u2014 ${priRole.tagline}`, '',
      priRole.desc, '',
      'ROLE SCORES',
      ...sortedR.map((rr) => `  ${rr.emoji} ${rr.name}: ${pct(rr, maxR)}%`), '',
      'DWEnterprise Sales Assessment',
    ];
    const subj = encodeURIComponent(`Your DWEnterprise Sales Assessment Results \u2014 ${pri.name}`);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:${state.userEmail}?subject=${subj}&body=${body}`;
  };

  return (
    <div>
      {/* Progress bar */}
      <div style={{
        height: '4px', background: '#eef0f6', borderRadius: '3px',
        marginBottom: '32px', overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', background: 'linear-gradient(90deg, #1a5276, #2e86c1)',
          borderRadius: '3px', width: '100%',
        }} />
      </div>

      {state.userName && (
        <div style={{
          textAlign: 'center', marginBottom: '16px', fontSize: '13px', color: '#9aa0b8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        }}>
          <Users size={14} />
          Results for <strong style={{ color: '#4a5070' }}>{state.userName}</strong>
        </div>
      )}

      {/* ── Hero ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: isDesktop ? '40px' : '24px',
        marginBottom: '44px',
        alignItems: 'center',
      }}>
        <div style={{
          textAlign: isDesktop ? 'right' : 'center',
          display: 'flex', flexDirection: 'column',
          alignItems: isDesktop ? 'flex-end' : 'center',
        }}>
          <div style={{
            display: isDesktop ? 'none' : 'inline-block',
            background: '#eaf1f8', color: '#1a5276',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '6px 16px', borderRadius: '20px',
            marginBottom: '20px',
          }}>
            <Sparkles size={12} style={{ marginRight: '4px', display: 'inline' }} />
            Your Primary Seller Persona
          </div>
          <PersonaIconDisplay icon={getPersonaIcon(pri.id)} accent={pri.accent} size={isDesktop ? 64 : 56} />
          <h1 style={{
            fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: '800', color: '#0f1628',
            marginBottom: '4px', letterSpacing: '-0.5px', marginTop: '12px',
          }}>
            {pri.name}
          </h1>
          <div style={{
            fontSize: '10px', color: pri.accent, letterSpacing: '0.2em',
            textTransform: 'uppercase', fontWeight: '700',
          }}>
            {pri.tagline}
          </div>
        </div>
        <div>
          <div style={{
            display: isDesktop ? 'inline-block' : 'none',
            background: '#eaf1f8', color: '#1a5276',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '6px 16px', borderRadius: '20px',
            marginBottom: '16px',
          }}>
            <Sparkles size={12} style={{ marginRight: '4px', display: 'inline' }} />
            Your Primary Seller Persona
          </div>
          <p style={{
            fontSize: '15px', color: '#4a5070', lineHeight: '1.85',
          }}>
            {pri.desc}
          </p>
        </div>
      </div>

      {/* ── Strengths + Growth ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: '16px',
        marginBottom: '36px',
      }}>
        <Card borderLeft={pri.accent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Shield size={16} color={pri.accent} />
            <Overline>Core Strengths</Overline>
          </div>
          <BulletList items={pri.strengths} color={pri.accent} />
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <TrendingUp size={16} color="#b0b8cc" />
            <Overline>Growth Opportunities</Overline>
          </div>
          <BulletList items={pri.growth} color="#b0b8cc" dim />
        </Card>
      </div>

      {/* ── Tips ── */}
      <div style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Lightbulb size={16} color="#9aa0b8" />
          <Overline>Actionable Development Tips</Overline>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {pri.tips.map((tip, i) => (
            <TipTab key={i} active={state.activeTip === i} onClick={() => dispatch({ type: 'SET_ACTIVE_TIP', payload: i })}>
              {tip.label}
            </TipTab>
          ))}
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #eaf1f8, #f0f6fc)',
          border: '1.5px solid #b8cfe0', borderRadius: '14px',
          padding: isDesktop ? '24px 26px' : '20px',
        }}>
          <div style={{
            fontSize: '15px', fontWeight: '700', color: '#0f1628', marginBottom: '10px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            <Lightbulb size={18} color="#1a5276" />
            {pri.tips[state.activeTip].label}
          </div>
          <p style={{ fontSize: '14px', color: '#4a5070', lineHeight: '1.85', margin: 0 }}>
            {pri.tips[state.activeTip].text}
          </p>
        </div>
      </div>

      {/* ── Radar + Score bars side by side ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: isDesktop ? '32px' : '24px',
        marginBottom: '44px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BarChart3 size={16} color="#9aa0b8" />
            <Overline>Your Persona Fingerprint</Overline>
          </div>
          <p style={{ fontSize: '13px', color: '#9aa0b8', marginBottom: '16px', lineHeight: '1.65' }}>
            How strongly each of the 6 personas showed up in your answers
          </p>
          <RadarChart items={sortedP} maxScore={maxP} accent={pri.accent} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Target size={16} color="#9aa0b8" />
            <Overline>All Persona Scores</Overline>
          </div>
          <div style={{
            background: '#fff', border: '1.5px solid #e4e9f2',
            borderRadius: '12px', padding: '20px 22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            {sortedP.map((prof, i) => (
              <ScoreBar
                key={prof.id}
                Icon={getPersonaIcon(prof.id)}
                name={prof.short || prof.name}
                score={prof.score}
                pct={pct(prof, maxP)}
                accent={prof.accent || '#b0bdd4'}
                isPrimary={i === 0}
                isLow={pct(prof, maxP) < 20}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Role match ── */}
      <Divider />
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <BookOpen size={16} color="#9aa0b8" />
          <Overline>Your Most Likely Sales Role Match</Overline>
        </div>
        <p style={{ fontSize: '13px', color: '#9aa0b8', marginBottom: '18px', lineHeight: '1.65' }}>
          Based on your persona profile, here is how your natural style maps to the four sales role types — and which role is your best fit.
        </p>
        <div style={{
          borderRadius: '16px', padding: isDesktop ? '32px 36px' : '24px',
          border: `1.5px solid ${priRole.accent}`,
          borderLeft: `4px solid ${priRole.accent}`,
          background: 'linear-gradient(135deg, #fafbfc 0%, #f5f8fb 100%)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '9px', fontWeight: '700', letterSpacing: '0.15em',
            textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px',
            background: priRole.accent, color: '#fff', marginBottom: '18px',
          }}>
            <Target size={12} /> Best Role Match
          </span>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', marginBottom: '18px' }}>
            <PersonaIconDisplay icon={getRoleIcon(priRole.id)} accent={priRole.accent} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#0f1628', marginBottom: '4px' }}>{priRole.name}</div>
              <div style={{
                fontSize: '10px', color: priRole.accent, letterSpacing: '0.18em',
                textTransform: 'uppercase', fontWeight: '700', marginBottom: '10px',
              }}>
                {priRole.tagline}
              </div>
              <p style={{ fontSize: '14px', color: '#4a5070', lineHeight: '1.8', margin: 0 }}>{priRole.desc}</p>
            </div>
          </div>
          <div>
            <div style={{
              fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#b0b8cc', fontWeight: '600', marginBottom: '12px',
            }}>
              Key Characteristics
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
              gap: '10px 20px',
            }}>
              {priRole.characteristics.map((c, i) => (
                <div key={i} style={{
                  fontSize: '13px', color: '#2a2d44',
                  display: 'flex', gap: '8px', alignItems: 'flex-start',
                }}>
                  <span style={{ color: priRole.accent, fontSize: '8px', marginTop: '6px', flexShrink: 0 }}>◆</span>
                  {c}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: '#fff', borderRadius: '10px', padding: '14px 18px',
            border: '1px solid #dde8f0', marginTop: '18px',
          }}>
            <div style={{
              fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#b0b8cc', fontWeight: '600', marginBottom: '6px',
            }}>
              Role Impact
            </div>
            <p style={{ fontSize: '13px', color: '#4a5070', lineHeight: '1.7', margin: 0 }}>{priRole.impact}</p>
          </div>
        </div>
      </div>

      {/* ── Role Scores + Stretch edges ── */}
      <Divider />
      <div style={{
        display: 'grid',
        gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
        gap: isDesktop ? '32px' : '24px',
        marginBottom: '36px',
      }}>
        <div>
          {lowP.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Target size={16} color="#9aa0b8" />
                <Overline>Stretch Edges — Lower Alignment</Overline>
              </div>
              <p style={{ fontSize: '13px', color: '#9aa0b8', marginBottom: '14px', lineHeight: '1.65' }}>
                These personas showed little alignment. They may represent blind spots — or simply approaches outside your current style.
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {lowP.map((prof) => (
                  <div key={prof.id} style={{
                    background: '#fff', border: '1.5px solid #e4e9f2',
                    borderRadius: '10px', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                  }}>
                    <PersonaIconDisplay icon={getPersonaIcon(prof.id)} accent="#c8cce0" size={20} />
                    <div>
                      <div style={{ fontSize: '12px', color: '#9aa0b8' }}>{prof.name}</div>
                      <div style={{ fontSize: '10.5px', color: '#c8cce0', fontWeight: '500' }}>Stretch opportunity</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Target size={16} color="#9aa0b8" />
            <Overline>All Role Scores</Overline>
          </div>
          <div style={{
            background: '#fff', border: '1.5px solid #e4e9f2',
            borderRadius: '12px', padding: '20px 22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            {sortedR.map((role, i) => (
              <ScoreBar
                key={role.id}
                Icon={getRoleIcon(role.id)}
                name={role.name}
                score={role.score}
                pct={pct(role, maxR)}
                accent={role.accent || '#b0bdd4'}
                isPrimary={i === 0}
                primaryLabel="MATCH"
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Email section ── */}
      <Divider />
      <div style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Mail size={16} color="#9aa0b8" />
          <Overline>Save or Share Your Results</Overline>
        </div>
        {state.emailSent ? (
          <div style={{
            background: 'linear-gradient(135deg, #eafaf1, #f0fbf4)',
            border: '1.5px solid #a9dfbf', borderRadius: '14px',
            padding: '28px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '10px' }}>✅</div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e8449', marginBottom: '6px' }}>Results opened!</div>
            <p style={{ fontSize: '13px', color: '#5a6070', marginBottom: '18px' }}>
              Your formatted results are open in a new tab — print or save as PDF from there.
            </p>
            <Button variant="outline" onClick={handleEmail} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> Email to Myself
            </Button>
          </div>
        ) : (
          <div style={{
            background: '#fff', border: '1.5px solid #dee6f0', borderRadius: '14px',
            padding: isDesktop ? '28px 30px' : '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          }}>
            {state.emailError && (
              <p style={{ fontSize: '12px', color: '#c0392b', marginBottom: '12px' }}>{state.emailError}</p>
            )}
            <div style={{ fontSize: '14px', color: '#0f1628', fontWeight: '600', marginBottom: '4px' }}>
              Open a print-ready, formatted version of your full results.
            </div>
            <div style={{ fontSize: '13px', color: '#6a7090', marginBottom: '20px' }}>
              You can print it, save it as a PDF, or copy-paste it into an email to share with others.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Button onClick={handleViewResults} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Printer size={16} /> View Formatted Results
              </Button>
              <Button variant="outline" onClick={handleEmail} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} /> Email to Myself
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── All Personas reference ── */}
      <Divider />
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <BookOpen size={16} color="#9aa0b8" />
          <Overline>All Six Seller Personas — Reference Guide</Overline>
        </div>
        <p style={{ fontSize: '13px', color: '#9aa0b8', marginBottom: '18px', lineHeight: '1.65' }}>
          A summary of all six personas so you can see where you landed — and what each of the others represents.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: '14px',
        }}>
          {sortedP.map((prof) => (
            <PersonaRoleCard
              key={prof.id}
              item={prof}
              isMe={prof.id === pri.id}
              accent={prof.accent}
              tag="YOUR PROFILE"
              Icon={getPersonaIcon(prof.id)}
            />
          ))}
        </div>
      </div>

      {/* ── All Roles reference ── */}
      <Divider />
      <div style={{ marginBottom: '44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <BookOpen size={16} color="#9aa0b8" />
          <Overline>All Four Sales Roles — Reference Guide</Overline>
        </div>
        <p style={{ fontSize: '13px', color: '#9aa0b8', marginBottom: '18px', lineHeight: '1.65' }}>
          A summary of the four sales role types so you understand the full landscape of how seller responsibilities are defined.
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: '14px',
        }}>
          {sortedR.map((role) => (
            <PersonaRoleCard
              key={role.id}
              item={role}
              isMe={role.id === priRole.id}
              accent={role.accent}
              tag="YOUR MATCH"
              Icon={getRoleIcon(role.id)}
              characteristics={role.characteristics}
              impact={role.impact}
            />
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ textAlign: 'center', borderTop: '1.5px solid #eef0f6', paddingTop: '28px', marginTop: '8px' }}>
        <Button onClick={() => dispatch({ type: 'RETAKE' })} style={{ minWidth: '200px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <RotateCcw size={16} /> Retake Assessment
        </Button>
        <div style={{ fontSize: '11px', color: '#c0c6d8', marginTop: '12px', fontWeight: '500' }}>
          DWEnterprise Sales Assessment · 6 Personas · 4 Sales Roles
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function PersonaIconDisplay({ icon: Icon, accent, size }) {
  return (
    <div style={{
      width: size + 20, height: size + 20, borderRadius: '16px',
      background: `${accent}12`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', color: accent, flexShrink: 0,
    }}>
      <Icon size={size} />
    </div>
  );
}

function BulletList({ items, color, dim }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item, i) => (
        <li key={i} style={{
          fontSize: '13px', color: dim ? '#6a7090' : '#2a2d44',
          lineHeight: '1.65', marginBottom: '8px',
          paddingLeft: '16px', position: 'relative',
        }}>
          <span style={{
            position: 'absolute', left: 0, top: '7px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: dim ? '#dde2ef' : color,
          }} />
          {item}
        </li>
      ))}
    </ul>
  );
}

function PersonaRoleCard({ item, isMe, accent, tag, Icon, characteristics, impact }) {
  return (
    <div style={{
      borderRadius: '14px', padding: '24px', marginBottom: '0',
      border: `1.5px solid ${isMe ? accent : '#e4e9f2'}`,
      borderLeft: `4px solid ${accent}`,
      background: isMe ? '#f8fcff' : '#fff',
      boxShadow: isMe ? '0 2px 8px rgba(0,0,0,0.04)' : '0 1px 2px rgba(0,0,0,0.02)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
        <PersonaIconDisplay icon={Icon} accent={accent} size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f1628' }}>{item.name}</div>
          <div style={{
            fontSize: '10px', color: accent, letterSpacing: '0.17em',
            textTransform: 'uppercase', fontWeight: '600', marginTop: '2px',
          }}>
            {item.tagline}
          </div>
        </div>
        {isMe && (
          <span style={{
            fontSize: '9px', background: accent, color: '#fff',
            borderRadius: '6px', padding: '4px 10px', fontWeight: '700',
            flexShrink: 0, letterSpacing: '0.03em',
          }}>
            {tag}
          </span>
        )}
      </div>
      <p style={{
        fontSize: '14px', color: '#4a5070', lineHeight: '1.8',
        margin: '0 0 12px 0',
      }}>
        {item.desc}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
        {(characteristics || item.strengths).map((s, i) => (
          <span key={i} style={{
            display: 'inline-block', fontSize: '11px', borderRadius: '20px',
            padding: '4px 11px', fontWeight: '500', lineHeight: '1.5',
            color: accent, background: isMe ? '#fff' : '#f8f9fc',
            border: `1px solid ${accent}20`, margin: '2px 2px 2px 0',
          }}>
            {s}
          </span>
        ))}
      </div>
      {impact && (
        <div style={{
          background: '#f8f9fc', borderRadius: '10px', padding: '12px 16px',
          border: '1px solid #eef0f6', marginTop: '14px',
        }}>
          <div style={{
            fontSize: '10px', letterSpacing: '0.17em', textTransform: 'uppercase',
            color: '#b0b8cc', fontWeight: '600', marginBottom: '5px',
          }}>
            Role Impact
          </div>
          <p style={{ fontSize: '13px', color: '#4a5070', lineHeight: '1.7', margin: 0 }}>{impact}</p>
        </div>
      )}
    </div>
  );
}
