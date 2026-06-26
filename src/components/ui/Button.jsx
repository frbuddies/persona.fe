const base = {
  fontFamily: 'inherit',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
};

export function Button({ variant = 'primary', disabled, onClick, children, style, ...props }) {
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #1a5276, #1e6a8a)',
      color: '#fff',
      border: 'none',
      borderRadius: '10px',
      padding: '14px 32px',
      fontSize: '15px',
      fontWeight: '600',
      boxShadow: '0 2px 8px rgba(26,82,118,0.2)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transform: disabled ? 'none' : undefined,
    },
    ghost: {
      background: 'none',
      border: 'none',
      color: '#9aa0b8',
      cursor: 'pointer',
      fontSize: '13px',
      padding: '8px 0',
      fontWeight: '500',
    },
    outline: {
      background: '#fff',
      color: '#1a5276',
      border: '1.5px solid #1a5276',
      borderRadius: '10px',
      padding: '13px 24px',
      fontSize: '15px',
      fontWeight: '600',
    },
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => {
        if (!disabled && variant !== 'ghost') {
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 6px 16px rgba(26,82,118,0.25)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        if (variant === 'primary') {
          e.target.style.boxShadow = '0 2px 8px rgba(26,82,118,0.2)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function OptionButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '16px 20px',
        marginBottom: '10px',
        borderRadius: '12px',
        border: `1.5px solid ${active ? '#1a5276' : '#e4e9f2'}`,
        background: active ? '#eaf1f8' : '#fff',
        color: active ? '#0f1628' : '#2a2d44',
        cursor: 'pointer',
        fontSize: '14px',
        lineHeight: '1.65',
        fontFamily: 'inherit',
        boxShadow: active
          ? '0 0 0 3px rgba(26,82,118,0.1), 0 2px 8px rgba(0,0,0,0.04)'
          : '0 1px 2px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.borderColor = '#b0c4d8';
          e.target.style.transform = 'translateY(-1px)';
          e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.borderColor = '#e4e9f2';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
        }
      }}
    >
      {active && (
        <span style={{
          position: 'absolute',
          right: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '16px',
          color: '#1a5276',
        }}>
          {'\u2713'}
        </span>
      )}
      {children}
    </button>
  );
}

export function TipTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '8px 16px',
        borderRadius: '24px',
        fontSize: '12px',
        fontWeight: '600',
        cursor: 'pointer',
        border: `1.5px solid ${active ? '#1a5276' : '#e4e9f2'}`,
        background: active ? '#1a5276' : '#fff',
        color: active ? '#fff' : '#6a7090',
        marginRight: '8px',
        marginBottom: '8px',
        fontFamily: 'inherit',
        boxShadow: active ? '0 2px 6px rgba(26,82,118,0.2)' : '0 1px 2px rgba(0,0,0,0.02)',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.target.style.borderColor = '#b0c4d8';
          e.target.style.color = '#1a5276';
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.target.style.borderColor = '#e4e9f2';
          e.target.style.color = '#6a7090';
        }
      }}
    >
      {children}
    </button>
  );
}
