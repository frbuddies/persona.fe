import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCompare, Download } from 'lucide-react';
import { PERSONAS } from '../data/personas';
import { ROLES } from '../data/roles';
import { getPersonaIcon, getRoleIcon } from '../utils/icons';
import { useBreakpoints } from '../hooks/useMediaQuery';
import { getSortedPersonas, getSortedRoles, pct } from '../utils/scoring';
import html2pdf from 'html2pdf.js';

const FALLBACK_COLORS = ['#c0392b', '#27ae60', '#2980b9', '#8e44ad', '#d35400', '#16a085', '#2c3e50', '#7f8c8d'];

function getColorForUser(userTopAccent, idx) {
  return userTopAccent || FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

function radarPoints(scoreMap, maxScore, personaIds, cx, cy, r) {
  const n = personaIds.length;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    const val = maxScore > 0 ? Math.max((scoreMap[personaIds[i]] || 0) / maxScore, 0.04) : 0.04;
    pts.push(`${(cx + Math.cos(a) * r * val).toFixed(1)},${(cy + Math.sin(a) * r * val).toFixed(1)}`);
  }
  return pts.join(' ');
}

function radarDots(scoreMap, maxScore, personaIds, cx, cy, r) {
  const n = personaIds.length;
  const dots = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    const val = maxScore > 0 ? Math.max((scoreMap[personaIds[i]] || 0) / maxScore, 0.04) : 0.04;
    dots.push({
      x: (cx + Math.cos(a) * r * val).toFixed(1),
      y: (cy + Math.sin(a) * r * val).toFixed(1),
    });
  }
  return dots;
}

function getDiffStyle(scores, pid, items, isRole) {
  const vals = items.map((item) => (isRole ? item.roleScores?.[pid] : item.personaScores?.[pid]) || 0);
  const max = Math.max(...vals);
  const min = Math.min(...vals);
  if (max === min) return {};
  const score = (isRole ? scores[pid] : scores[pid]) || 0;
  if (score === max) return { background: '#eafaf1' };
  if (score === min) return { background: '#fef2f2' };
  return {};
}

export default function AdminCompare() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDesktop } = useBreakpoints();
  const items = location.state || [];

  const generateComparisonPDF = () => {
    if (!items.length) return;
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const allPersonaRows = PERSONAS.map((persona) => {
      const scores = items.map((item) => item.personaScores?.[persona.id] || 0);
      const isTopForAny = items.some((item) => item.topPersona === persona.id);
      const barColor = isTopForAny ? persona.accent : '#2a2d44';
      const headerCells = items.map((item) => {
        const s = item.personaScores?.[persona.id] || 0;
        const topId = item.topPersona || Object.entries(item.personaScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
        const isTop = topId === persona.id;
        return `<td style="padding:8px 10px;text-align:center;border-bottom:1px solid #eef0f6;${isTop ? 'background:#eafaf1;' : ''}">
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="width:100%;max-width:120px;height:6px;background:#eef0f6;border-radius:3px;overflow:hidden;"><div style="height:100%;border-radius:3px;background:${isTop ? persona.accent : '#2a2d44'};width:${items.length > 0 ? Math.round((s / Math.max(...items.flatMap((it) => Object.values(it.personaScores || {})))) * 100) : 0}%;"></div></div>
            <span style="font-weight:${isTop ? '700' : '400'};color:${isTop ? '#0f1628' : '#2a2d44'}; font-size:15px;">${s}</span>
            ${isTop ? `<span style="font-size:15px;font-weight:700;letter-spacing:0.05em;color:#fff;background:${persona.accent};border-radius:4px;padding:2px 6px;line-height:1.3;">TOP</span>` : ''}
          </div>
        </td>`;
      }).join('');
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eef0f6;font-weight:600;color:#2a2d44;white-space:nowrap;">
          <span style="margin-right:6px;">${persona.emoji}</span>${persona.name}
        </td>
        ${headerCells}
      </tr>`;
    }).join('');

    const allRoleRows = ROLES.map((role) => {
      const headerCells = items.map((item) => {
        const scores = item.roleScores || {};
        const s = scores[role.id] || 0;
        const topRoleId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
        const isTop = topRoleId === role.id;
        const maxRoleScore = Math.max(...items.flatMap((it) => Object.values(it.roleScores || {})));
        return `<td style="padding:8px 10px;text-align:center;border-bottom:1px solid #eef0f6;${isTop ? 'background:#fef2f2;' : ''}">
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
            <div style="width:100%;max-width:120px;height:6px;background:#eef0f6;border-radius:3px;overflow:hidden;"><div style="height:100%;border-radius:3px;background:${isTop ? role.accent : '#2a2d44'};width:${maxRoleScore > 0 ? Math.round((s / maxRoleScore) * 100) : 0}%;"></div></div>
            <span style="font-weight:${isTop ? '700' : '400'};color:${isTop ? '#0f1628' : '#2a2d44'}; font-size:15px;">${s}</span>
            ${isTop ? `<span style="font-size:15px;font-weight:700;letter-spacing:0.05em;color:#fff;background:${role.accent};border-radius:4px;padding:2px 6px;line-height:1.3;">MATCH</span>` : ''}
          </div>
        </td>`;
      }).join('');
      return `<tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eef0f6;font-weight:600;color:#2a2d44;white-space:nowrap;">
          <span style="margin-right:6px;">${role.emoji}</span>${role.name}
        </td>
        ${headerCells}
      </tr>`;
    }).join('');

    const summaryCards = items.map((item) => {
      const sortedP = getSortedPersonas(item.personaScores || {});
      const topP = sortedP[0] || null;
      const sortedR = getSortedRoles(item.roleScores || {});
      const topR = sortedR[0] || null;
      return `<div style="flex:1;min-width:180px;background:#fff;border:1.5px solid ${topP?.accent || '#dee6f0'}40;border-radius:10px;padding:16px 18px;border-left:4px solid ${topP?.accent || '#dee6f0'};">
        <div style="font-size:16px;font-weight:700;color:#0f1628;margin-bottom:6px;">${item.name}</div>
        <div style="font-size:15px;color:#4a5070;margin-bottom:8px;">${item.email}</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${topP ? `<span style="font-size:15px;font-weight:700;letter-spacing:0.03em;background:${topP.accent};color:#fff;border-radius:6px;padding:3px 10px;">TOP: ${topP.short || topP.name}</span>` : ''}
          ${topR ? `<span style="font-size:15px;font-weight:700;letter-spacing:0.03em;background:${topR.accent};color:#fff;border-radius:6px;padding:3px 10px;">MATCH: ${topR.name}</span>` : ''}
          ${item.filledFor ? `<span style="font-size:15px;font-weight:700;letter-spacing:0.03em;background:#eaf1f8;color:#1a5276;border-radius:6px;padding:3px 10px;text-transform:capitalize;">${item.filledFor}</span>` : ''}
        </div>
      </div>`;
    }).join('');

    const thCells = items.map((item) => `<th style="text-align:center;padding:10px 12px;font-size:15px;white-space:nowrap;font-weight:700;border-bottom:2px solid #eef0f6;">${item.name}</th>`).join('');

    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>RedRock Comparison</title><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:system-ui,-apple-system,sans-serif;background:#f4f6fa;color:#1a1a2e;}
      @media print{body{background:#fff;}.page-wrap{box-shadow:none!important;max-width:100%!important;}}
    </style></head><body>
    <div class="page-wrap" style="max-width:780px;margin:0 auto;background:#fff;padding:40px 36px 60px;box-shadow:0 2px 24px rgba(0,0,0,0.07);">
      <div style="text-align:center;margin-bottom:32px;padding-bottom:24px;border-bottom:2px solid #eef0f6;">
        <div style="font-size:15px;letter-spacing:0.22em;text-transform:uppercase;color:#4a5070;font-weight:600;margin-bottom:10px;">RedRock Sales Assessment</div>
        <div style="font-size:28px;font-weight:800;color:#0f1628;letter-spacing:-0.5px;margin-bottom:6px;">Comparing ${items.length} Results</div>
        <div style="font-size:15px;color:#4a5070;">${date}</div>
      </div>

      <div style="margin-bottom:32px;">
        <div style="font-size:15px;letter-spacing:0.22em;text-transform:uppercase;color:#4a5070;font-weight:600;margin-bottom:14px;">Summary</div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">${summaryCards}</div>
      </div>

      <div style="margin-bottom:32px;">
        <div style="font-size:15px;letter-spacing:0.22em;text-transform:uppercase;color:#4a5070;font-weight:600;margin-bottom:14px;">Persona Scores</div>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px;">
          <thead><tr>
            <th style="text-align:left;padding:10px 12px;color:#2a2d44;font-weight:700;border-bottom:2px solid #eef0f6;font-size:15px;letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;">Persona</th>
            ${thCells}
          </tr></thead>
          <tbody>${allPersonaRows}</tbody>
        </table>
      </div>

      <div style="border-top:2px solid #eef0f6;margin:32px 0 24px;"></div>

      <div style="margin-bottom:32px;">
        <div style="font-size:15px;letter-spacing:0.22em;text-transform:uppercase;color:#4a5070;font-weight:600;margin-bottom:14px;">Role Scores</div>
        <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px;">
          <thead><tr>
            <th style="text-align:left;padding:10px 12px;color:#2a2d44;font-weight:700;border-bottom:2px solid #eef0f6;font-size:15px;letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;">Role</th>
            ${thCells}
          </tr></thead>
          <tbody>${allRoleRows}</tbody>
        </table>
      </div>

      <div style="border-top:1.5px solid #eef0f6;padding-top:22px;margin-top:20px;text-align:center;">
        <div style="font-size:15px;color:#2a2d44;">RedRock Sales Assessment &middot; 6 Personas &middot; 4 Sales Roles</div>
      </div>
    </div></body></html>`;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '800px';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);
    const idoc = iframe.contentDocument || iframe.contentWindow.document;
    idoc.open();
    idoc.write(html);
    idoc.close();
    const names = items.map((it) => it.name.replace(/\s+/g, '-')).join('-vs-');
    const filename = `RedRock-Comparison-${names}.pdf`;
    iframe.onload = () => {
      html2pdf()
        .set({
          margin: [0.4, 0.4, 0.4, 0.4],
          filename,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(iframe.contentDocument.body)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          pdf.save(filename);
          if (iframe.parentNode) document.body.removeChild(iframe);
        })
        .catch(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        });
    };
  };

  if (!items.length) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4a5070' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚠</div>
        <div style={{ fontWeight: '700', marginBottom: '6px' }}>No results to compare</div>
        <button onClick={() => navigate('/admin')} style={{
          marginTop: '16px', padding: '10px 24px',
          background: '#1a5276', color: '#fff', border: 'none',
          borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
          fontSize: '15px', fontWeight: '600',
        }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const personaIds = PERSONAS.map((p) => p.id);
  const roleIds = ROLES.map((r) => r.id);

  const maxPersonaScore = Math.max(
    ...items.flatMap((item) => Object.values(item.personaScores || {}))
  );
  const maxRoleScore = Math.max(
    ...items.flatMap((item) => Object.values(item.roleScores || {}))
  );

  const userTopPersona = useMemo(() => items.map((item) => {
    const topId = item.topPersona || Object.entries(item.personaScores || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
    return PERSONAS.find((p) => p.id === topId) || null;
  }), [items]);

  const userTopRole = useMemo(() => items.map((item) => {
    const scores = item.roleScores || {};
    const topId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    return ROLES.find((r) => r.id === topId) || null;
  }), [items]);

  const W = 380, H = 340, cx = W / 2, cy = H / 2, r = 96;
  const n = personaIds.length;

  const gridLayers = [0.25, 0.5, 0.75, 1].map((f) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI - Math.PI / 2;
      pts.push(`${(cx + Math.cos(a) * r * f).toFixed(1)},${(cy + Math.sin(a) * r * f).toFixed(1)}`);
    }
    return pts.join(' ');
  });

  const spokes = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    spokes.push({ x1: cx, y1: cy, x2: (cx + Math.cos(a) * r).toFixed(1), y2: (cy + Math.sin(a) * r).toFixed(1) });
  }

  const labels = personaIds.map((pid, i) => {
    const persona = PERSONAS.find((p) => p.id === pid);
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    const lr = r + 44;
    const lx = cx + Math.cos(a) * lr;
    const ly = cy + Math.sin(a) * lr;
    const anchor = lx < cx - 10 ? 'end' : lx > cx + 10 ? 'start' : 'middle';
    return { lx, ly, anchor, emoji: persona?.emoji || '', short: persona?.short || pid };
  });

  return (
    <div>
      <button
        onClick={() => navigate('/admin')}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '15px', fontWeight: '600', color: '#4a5070',
          fontFamily: 'inherit', marginBottom: '24px', padding: '4px 0',
        }}
        onMouseEnter={(e) => e.target.style.color = '#1a5276'}
        onMouseLeave={(e) => e.target.style.color = '#4a5070'}
      >
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      <button
        onClick={generateComparisonPDF}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 16px', borderRadius: '8px', border: '1.5px solid #1a5276',
          background: '#fff', color: '#1a5276', fontSize: '15px',
          fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
          marginLeft: '12px', verticalAlign: 'middle',
        }}
        onMouseEnter={(e) => e.target.style.background = '#eaf1f8'}
        onMouseLeave={(e) => e.target.style.background = '#fff'}
      >
        <Download size={14} /> Download PDF
      </button>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: 'linear-gradient(135deg, #eaf1f8, #dce8f2)',
        color: '#1a5276', fontSize: '15px', fontWeight: '700',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        padding: '7px 16px', borderRadius: '20px', marginBottom: '12px',
      }}>
        <GitCompare size={14} />
        Compare Results
      </div>
      <h1 style={{
        fontSize: 'clamp(27px, 4.5vw, 41px)', fontWeight: '800',
        color: '#0f1628', letterSpacing: '-0.5px', marginBottom: '4px',
      }}>
        Comparing {items.length} Results
      </h1>
      <p style={{ fontSize: '16px', color: '#4a5070', marginBottom: '36px' }}>
        Side-by-side persona and role scores for selected users
      </p>

      {/* ── Summary Strip ── */}
      <div style={{
        display: 'flex', gap: '14px', marginBottom: '36px',
        flexWrap: 'wrap',
      }}>
        {items.map((item, idx) => {
          const topP = userTopPersona[idx];
          const topR = userTopRole[idx];
          const color = getColorForUser(topP?.accent, idx);
          const Icon = topP ? getPersonaIcon(topP.id) : null;
          return (
            <div key={item._id} style={{
              flex: '1', minWidth: isDesktop ? '0' : '200px',
              background: '#fff', border: `1.5px solid ${color}40`,
              borderRadius: '14px', padding: '18px 20px',
              borderLeft: `4px solid ${color}`,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                {Icon && (
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${color}18`, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color, flexShrink: 0,
                  }}>
                    <Icon size={20} />
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#0f1628' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '15px', color: '#4a5070', wordBreak: 'break-all' }}>
                    {item.email}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {topP && (
                  <span style={{
                    fontSize: '15px', fontWeight: '700', letterSpacing: '0.03em',
                    background: color, color: '#fff',
                    borderRadius: '6px', padding: '3px 10px',
                  }}>
                    TOP: {topP.short || topP.name}
                  </span>
                )}
                {topR && (
                  <span style={{
                    fontSize: '15px', fontWeight: '700', letterSpacing: '0.03em',
                    background: topR.accent, color: '#fff',
                    borderRadius: '6px', padding: '3px 10px',
                  }}>
                    MATCH: {topR.name}
                  </span>
                )}
                {item.filledFor && (
                  <span style={{
                    fontSize: '15px', fontWeight: '700', letterSpacing: '0.03em',
                    background: '#eaf1f8', color: '#1a5276',
                    borderRadius: '6px', padding: '3px 10px',
                    textTransform: 'capitalize',
                  }}>
                    {item.filledFor}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Multi-User Radar Chart ── */}
      <div style={{
        background: '#fff', border: '1.5px solid #dee6f0',
        borderRadius: '16px', padding: isDesktop ? '28px' : '20px',
        marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '15px', fontWeight: '700', color: '#0f1628',
          margin: '0 0 20px 0', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px',
        }}>
          Persona Radar Overlay
        </h2>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{
          display: 'block', margin: '0 auto', overflow: 'visible', maxWidth: '100%',
        }}>
          {gridLayers.map((pts, i) => (
            <polygon key={i} points={pts} fill="none" stroke="#e8eaf0" strokeWidth="1" />
          ))}
          {spokes.map((s, i) => (
            <line key={i} {...s} stroke="#e8eaf0" strokeWidth="1" />
          ))}
          {items.map((item, idx) => {
            const topP = userTopPersona[idx];
            const color = getColorForUser(topP?.accent, idx);
            const scores = item.personaScores || {};
            const pts = radarPoints(scores, maxPersonaScore, personaIds, cx, cy, r);
            const dots = radarDots(scores, maxPersonaScore, personaIds, cx, cy, r);
            return (
              <g key={item._id}>
                <polygon points={pts} fill={color} fillOpacity="0.08" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeDasharray={idx > 0 ? '4,3' : 'none'} />
                {dots.map((d, di) => (
                  <g key={di}>
                    <circle cx={d.x} cy={d.y} r="5" fill={color} stroke="#fff" strokeWidth="2.5" />
                    <circle cx={d.x} cy={d.y} r="2" fill="#fff" opacity="0.8" />
                  </g>
                ))}
              </g>
            );
          })}
          {labels.map((l, i) => (
            <g key={i}>
              <text x={l.lx.toFixed(1)} y={(l.ly - 8).toFixed(1)} textAnchor={l.anchor} fontSize="15" fill="#4a5070">
                {l.emoji}
              </text>
              <text x={l.lx.toFixed(1)} y={(l.ly + 10).toFixed(1)} textAnchor={l.anchor} fontSize="9.5" fill="#7a8099" fontFamily="system-ui,sans-serif" fontWeight="500">
                {l.short}
              </text>
            </g>
          ))}
        </svg>
        {/* Legend */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '16px',
          flexWrap: 'wrap', marginTop: '16px',
        }}>
          {items.map((item, idx) => {
            const topP = userTopPersona[idx];
            const color = getColorForUser(topP?.accent, idx);
            return (
              <div key={item._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '15px', color: '#4a5070' }}>
                <svg width="12" height="12">
                  <line x1="1" y1="6" x2="11" y2="6" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={idx > 0 ? '4,3' : 'none'} />
                  <circle cx="6" cy="6" r="3" fill={color} />
                </svg>
                <span style={{ fontWeight: idx === 0 ? '600' : '400' }}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Persona comparison ── */}
      <div style={{
        background: '#fff', border: '1.5px solid #dee6f0',
        borderRadius: '16px', padding: isDesktop ? '28px' : '20px',
        marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <h2 style={{
          fontSize: '15px', fontWeight: '700', color: '#0f1628',
          margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          Persona Scores
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse', fontSize: '15px',
            minWidth: items.length * 180,
          }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#2a2d44', fontWeight: '700', borderBottom: '2px solid #eef0f6', fontSize: '15px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Persona
                </th>
                {items.map((item, idx) => {
                  const topP = userTopPersona[idx];
                  return (
                    <th key={item._id} style={{
                      textAlign: 'center', padding: '10px 12px', color: topP?.accent || '#1a5276',
                      fontWeight: '700', borderBottom: `2px solid ${topP?.accent || '#1a5276'}`,
                      fontSize: '15px', whiteSpace: 'nowrap',
                    }}>
                      {item.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {personaIds.map((pid) => {
                const persona = PERSONAS.find((p) => p.id === pid);
                const Icon = getPersonaIcon(pid);
                return (
                  <tr key={pid}>
                    <td style={{
                      padding: '12px 12px', borderBottom: '1px solid #eef0f6',
                      fontWeight: '600', color: '#2a2d44', whiteSpace: 'nowrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={16} color={persona?.accent || '#2a2d44'} />
                        {persona?.name || pid}
                      </div>
                    </td>
                    {items.map((item) => {
                      const scores = item.personaScores || {};
                      const score = scores[pid] || 0;
                      const pct2 = maxPersonaScore > 0 ? Math.round((score / maxPersonaScore) * 100) : 0;
                      const isTop = item.topPersona === pid;
                      const diffStyle = getDiffStyle(scores, pid, items, false);
                      return (
                        <td key={item._id} style={{
                          padding: '12px 12px', borderBottom: '1px solid #eef0f6',
                          textAlign: 'center', ...diffStyle,
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                              width: '100%', maxWidth: '140px', height: '6px',
                              background: '#eef0f6', borderRadius: '3px', overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%', borderRadius: '3px',
                                background: isTop ? (persona?.accent || '#1a5276') : '#2a2d44',
                                width: `${pct2}%`, transition: 'width 0.4s',
                              }} />
                            </div>
                            <span style={{
                              fontWeight: isTop ? '700' : '400',
                              color: isTop ? '#0f1628' : '#2a2d44',
                            }}>
                              {score}
                            </span>
                            {isTop && (
                              <span style={{
                                fontSize: '15px', fontWeight: '700', letterSpacing: '0.05em',
                                color: '#fff', background: persona?.accent || '#1a5276',
                                borderRadius: '4px', padding: '2px 6px', lineHeight: '1.3',
                              }}>
                                TOP
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Role comparison ── */}
      <div style={{
        background: '#fff', border: '1.5px solid #dee6f0',
        borderRadius: '16px', padding: isDesktop ? '28px' : '20px',
        marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <h2 style={{
          fontSize: '15px', fontWeight: '700', color: '#0f1628',
          margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          Role Scores
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse', fontSize: '15px',
            minWidth: items.length * 180,
          }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#2a2d44', fontWeight: '700', borderBottom: '2px solid #eef0f6', fontSize: '15px', letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                  Role
                </th>
                {items.map((item, idx) => {
                  const topR = userTopRole[idx];
                  return (
                    <th key={item._id} style={{
                      textAlign: 'center', padding: '10px 12px', color: topR?.accent || '#8e44ad',
                      fontWeight: '700', borderBottom: `2px solid ${topR?.accent || '#8e44ad'}`,
                      fontSize: '15px', whiteSpace: 'nowrap',
                    }}>
                      {item.name}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {roleIds.map((rid) => {
                const role = ROLES.find((r) => r.id === rid);
                const Icon = getRoleIcon(rid);
                return (
                  <tr key={rid}>
                    <td style={{
                      padding: '12px 12px', borderBottom: '1px solid #eef0f6',
                      fontWeight: '600', color: '#2a2d44', whiteSpace: 'nowrap',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={16} color={role?.accent || '#2a2d44'} />
                        {role?.name || rid}
                      </div>
                    </td>
                    {items.map((item) => {
                      const scores = item.roleScores || {};
                      const score = scores[rid] || 0;
                      const topRoleId = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
                      const pct2 = maxRoleScore > 0 ? Math.round((score / maxRoleScore) * 100) : 0;
                      const isTop = topRoleId === rid;
                      const diffStyle = getDiffStyle(scores, rid, items, true);
                      return (
                        <td key={item._id} style={{
                          padding: '12px 12px', borderBottom: '1px solid #eef0f6',
                          textAlign: 'center', ...diffStyle,
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                              width: '100%', maxWidth: '140px', height: '6px',
                              background: '#eef0f6', borderRadius: '3px', overflow: 'hidden',
                            }}>
                              <div style={{
                                height: '100%', borderRadius: '3px',
                                background: isTop ? (role?.accent || '#8e44ad') : '#2a2d44',
                                width: `${pct2}%`, transition: 'width 0.4s',
                              }} />
                            </div>
                            <span style={{
                              fontWeight: isTop ? '700' : '400',
                              color: isTop ? '#0f1628' : '#2a2d44',
                            }}>
                              {score}
                            </span>
                            {isTop && (
                              <span style={{
                                fontSize: '15px', fontWeight: '700', letterSpacing: '0.05em',
                                color: '#fff', background: role?.accent || '#8e44ad',
                                borderRadius: '4px', padding: '2px 6px', lineHeight: '1.3',
                              }}>
                                MATCH
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}