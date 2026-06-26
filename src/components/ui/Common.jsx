const styles = {
  card: {
    background: '#fff',
    border: '1.5px solid var(--border, #e4e9f2)',
    borderRadius: 'var(--radius-md, 12px)',
    padding: '24px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  overline: {
    fontSize: '10px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#9aa0b8',
    fontWeight: '600',
    marginBottom: '14px',
  },
  divider: {
    borderTop: '1.5px solid #eef0f6',
    margin: '44px 0 36px',
  },
  fieldInput: {
    width: '100%',
    padding: '12px 16px',
    border: '1.5px solid #e0e3ef',
    borderRadius: '10px',
    fontSize: '15px',
    fontFamily: 'inherit',
    color: '#0f1628',
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  scoreRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
};

export function Card({ borderLeft, accent, children, style, ...props }) {
  return (
    <div style={{
      ...styles.card,
      borderLeft: borderLeft ? `3px solid ${borderLeft}` : undefined,
      ...style,
    }} {...props}>
      {children}
    </div>
  );
}

export function Overline({ children }) {
  return <div style={styles.overline}>{children}</div>;
}

export function Divider() {
  return <div style={styles.divider} />;
}

export function FieldInput({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={styles.fieldInput}
      onFocus={(e) => {
        e.target.style.borderColor = '#1a5276';
        e.target.style.boxShadow = '0 0 0 3px rgba(26,82,118,0.08)';
      }}
      onBlur={(e) => {
        e.target.style.borderColor = '#e0e3ef';
        e.target.style.boxShadow = 'none';
      }}
    />
  );
}

export function ScoreBar({ Icon, name, pct: pctVal, accent, isPrimary, isLow }) {
  const labelColor = isPrimary ? '#0f1628' : isLow ? '#c8cce0' : '#6a7090';
  const barColor = isPrimary ? accent : isLow ? '#dde2ef' : '#b0bdd4';
  return (
    <div style={styles.scoreRow}>
      <div style={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {Icon ? <Icon size={16} color={isPrimary ? accent : '#b0b8cc'} /> : null}
      </div>
      <div style={{
        minWidth: '140px',
        fontSize: '12px',
        color: labelColor,
        fontWeight: isPrimary ? '700' : '400',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        {name}
        {isPrimary && (
          <span style={{
            fontSize: '8px',
            background: accent,
            color: '#fff',
            borderRadius: '4px',
            padding: '2px 6px',
            fontWeight: '700',
            letterSpacing: '0.05em',
          }}>
            PRIMARY
          </span>
        )}
      </div>
      <div style={{ flex: 1, height: '6px', background: '#eef0f6', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          borderRadius: '4px',
          background: barColor,
          width: `${pctVal}%`,
          transition: 'width 0.6s ease',
        }} />
      </div>
      <div style={{
        width: '32px',
        textAlign: 'right',
        fontSize: '11px',
        color: '#b0b8cc',
        flexShrink: 0,
        fontWeight: isPrimary ? '600' : '400',
      }}>
        {pctVal}%
      </div>
    </div>
  );
}

export function Grid2({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px 20px',
    }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, subtitle }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <Overline>{children}</Overline>
      {subtitle && (
        <p style={{ fontSize: '13px', color: '#9aa0b8', marginTop: '-6px', lineHeight: '1.65' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
