export function RadarChart({ items, maxScore, accent }) {
  const W = 380, H = 340, cx = W / 2, cy = H / 2, r = 96;
  const n = items.length;

  const vals = items.map((it) =>
    maxScore > 0 ? Math.max(it.score / maxScore, 0.04) : 0.04
  );

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

  const dataPts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    dataPts.push(`${(cx + Math.cos(a) * r * vals[i]).toFixed(1)},${(cy + Math.sin(a) * r * vals[i]).toFixed(1)}`);
  }

  const labels = items.map((it, i) => {
    const a = (i / n) * 2 * Math.PI - Math.PI / 2;
    const lr = r + 44;
    const lx = cx + Math.cos(a) * lr;
    const ly = cy + Math.sin(a) * lr;
    const anchor = lx < cx - 10 ? 'end' : lx > cx + 10 ? 'start' : 'middle';
    return { lx, ly, anchor, emoji: it.emoji, short: it.short };
  });

  return (
    <div style={{
      textAlign: 'center',
      padding: '24px 16px',
      background: '#fff',
      border: '1.5px solid #e4e9f2',
      borderRadius: '14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', margin: '0 auto', overflow: 'visible', maxWidth: '100%' }}>
        {gridLayers.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="#e8eaf0" strokeWidth="1" />
        ))}
        {spokes.map((s, i) => (
          <line key={i} {...s} stroke="#e8eaf0" strokeWidth="1" />
        ))}
        <polygon points={dataPts.join(' ')} fill={accent} fillOpacity="0.15" stroke={accent} strokeWidth="2.5" strokeLinejoin="round" />
        {vals.map((v, i) => {
          const a = (i / n) * 2 * Math.PI - Math.PI / 2;
          const cx2 = cx + Math.cos(a) * r * v;
          const cy2 = cy + Math.sin(a) * r * v;
          return (
            <g key={i}>
              <circle cx={cx2.toFixed(1)} cy={cy2.toFixed(1)} r="5" fill={accent} stroke="#fff" strokeWidth="2.5" />
              <circle cx={cx2.toFixed(1)} cy={cy2.toFixed(1)} r="2" fill="#fff" opacity="0.8" />
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
    </div>
  );
}
