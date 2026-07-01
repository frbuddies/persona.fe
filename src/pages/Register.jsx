import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Sparkles, Copy, Check, ExternalLink, LayoutDashboard } from 'lucide-react';
import { FieldInput } from '../components/ui/Common';
import { Button } from '../components/ui/Button';

const API_URL = `${import.meta.env.VITE_API_URL}` || 'https://persona-be-y9g7.onrender.com';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();

      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Failed to copy link');
    }
  };

  if (result) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: 'calc(100vh - 120px)',
      }}>
        <div style={{
          width: '100%', maxWidth: '480px',
          background: '#fff',
          border: '1.5px solid #dee6f0',
          borderRadius: '18px',
          padding: '40px 32px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
          borderLeft: '4px solid #27ae60',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: '#e8f8f0', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px',
              color: '#27ae60',
            }}>
              <Check size={28} />
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f1628', margin: '0 0 4px' }}>
              Registration Successful
            </h1>
            <p style={{ fontSize: '14px', color: '#9aa0b8', margin: 0 }}>
              Your account has been created
            </p>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f1628', marginBottom: '8px', display: 'block', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Client ID
            </label>
            <div style={{
              padding: '12px 16px', background: '#f8f9fc', borderRadius: '10px',
              border: '1.5px solid #e0e3ef', fontSize: '14px', color: '#0f1628',
              fontFamily: 'monospace', wordBreak: 'break-all',
            }}>
              {result.client_id}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#0f1628', marginBottom: '8px', display: 'block', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Assessment Link
            </label>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              <div style={{
                flex: 1, padding: '12px 16px', background: '#f8f9fc', borderRadius: '10px',
                border: '1.5px solid #e0e3ef', fontSize: '13px', color: '#1a5276',
                wordBreak: 'break-all', lineHeight: '1.5',
              }}>
                {result.link}
              </div>
              <button
                onClick={copyLink}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '44px', height: '44px', borderRadius: '10px', flexShrink: 0,
                  background: copied ? '#27ae60' : 'linear-gradient(135deg, #1a5276, #1e6a8a)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                title="Copy link"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
            {copied && (
              <p style={{ fontSize: '12px', color: '#27ae60', marginTop: '6px', fontWeight: '600' }}>
                Link copied to clipboard!
              </p>
            )}
          </div>

          <Button
            onClick={() => {
              localStorage.setItem('isAuth', 'true');
              localStorage.setItem('client_id', result.client_id);
              navigate(`/admin?client_id=${result.client_id}`);
            }}
            style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <LayoutDashboard size={18} /> Go to Admin Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
    }}>
      <form onSubmit={handleSubmit} style={{
        width: '100%', maxWidth: '420px',
        background: '#fff',
        border: '1.5px solid #dee6f0',
        borderRadius: '18px',
        padding: '40px 32px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
        borderLeft: '4px solid #1a5276',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #eaf1f8, #dce8f2)',
            color: '#1a5276', fontSize: '10px', fontWeight: '700',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '7px 16px', borderRadius: '20px',
            marginBottom: '16px',
          }}>
            <Sparkles size={14} />
            RedRock
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0f1628', margin: '0 0 4px' }}>
            Sign Up
          </h1>
          <p style={{ fontSize: '14px', color: '#9aa0b8', margin: 0 }}>
            Create an account to get your assessment link
          </p>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#2a2d44', marginBottom: '6px', display: 'block' }}>
            Email
          </label>
          <FieldInput
            value={email}
            onChange={setEmail}
            placeholder="you@company.com"
            type="email"
          />
        </div>

        <div style={{ marginBottom: '4px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: '#2a2d44', marginBottom: '6px', display: 'block' }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <FieldInput
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              type={showPw ? 'text' : 'password'}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#b0b8cc', padding: '4px',
              }}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            fontSize: '13px', color: '#d32f2f', marginTop: '14px',
            padding: '10px 14px', background: '#fef2f2', borderRadius: '8px',
            border: '1px solid #fecaca',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <Button
            disabled={!email.trim() || !password.trim() || loading}
            style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {loading ? 'Creating...' : <><UserPlus size={18} /> Sign Up</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
