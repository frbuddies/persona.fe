import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, RefreshCw, Calendar, Mail, LogIn, LogOut, Eye, EyeOff, Sparkles, Download, Share2, ExternalLink, Copy, Check, GitCompare, MoreVertical, X } from 'lucide-react';
import { useBreakpoints } from '../hooks/useMediaQuery';
import { fetchAllResults, loginUser, setUserPassword } from '../data/api';
import { PERSONAS } from '../data/personas';
import { ROLES } from '../data/roles';
import { getPersonaIcon } from '../utils/icons';
import { getSortedPersonas, getSortedRoles } from '../utils/scoring';
import { buildEmailHTML } from '../utils/email';
import { FieldInput } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import html2pdf from 'html2pdf.js';

export default function AdminPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(localStorage.getItem('isAuth') === 'true');
  const [clientId, setClientId] = useState(localStorage.getItem('client_id') || null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(localStorage.getItem('isSuperAdmin') === 'true');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const { isDesktop } = useBreakpoints();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwChangeLoading, setPwChangeLoading] = useState(false);
  const [pwChangeError, setPwChangeError] = useState('');
  const [pwChangeSuccess, setPwChangeSuccess] = useState('');

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const assessmentLink = clientId ? `${window.location.origin}/?client_id=${clientId}` : '';

  const load = () => {
    setLoading(true);
    setError(null);
    const query = isSuperAdmin ? 'isSuperAdmin=true' : `client_id=${clientId}`;
    fetchAllResults(query)
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

  useEffect(() => { if (authed) load(); }, [authed]);

  if (!authed) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: 'calc(100vh - 120px)',
      }}>
        <form onSubmit={async (e) => {
          e.preventDefault();
          setLoginError('');
          setLoginLoading(true);
          const res = await loginUser(loginEmail, loginPassword);
          setLoginLoading(false);
          if (res.success) {
            if (res.client_id) {
              setClientId(res.client_id);
              localStorage.setItem('client_id', res.client_id);
            } else {
              setIsSuperAdmin(true);
              localStorage.setItem('isSuperAdmin', 'true');
            }
            setAuthed(true);
            localStorage.setItem('isAuth', 'true');
            window.dispatchEvent(new Event('auth-change'));
          } else {
            setLoginError(res.message || 'Invalid email or password');
          }
        }} style={{
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
              color: '#1a5276', fontSize: '15px', fontWeight: '700',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '7px 16px', borderRadius: '20px',
              marginBottom: '16px',
            }}>
              <Sparkles size={14} />
              RedRock
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0f1628', margin: '0 0 4px' }}>
              Admin Login
            </h1>
            <p style={{ fontSize: '18px', color: '#4a5070', margin: 0 }}>
              Sign in to access the assessment dashboard
            </p>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '18px', fontWeight: '600', color: '#2a2d44', marginBottom: '6px', display: 'block' }}>
              Email
            </label>
            <FieldInput
              value={loginEmail}
              onChange={setLoginEmail}
              placeholder="admin@persona.com"
              type="email"
              autoComplete="new-password"
            />
          </div>

          <div style={{ marginBottom: '4px' }}>
            <label style={{ fontSize: '18px', fontWeight: '600', color: '#2a2d44', marginBottom: '6px', display: 'block' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FieldInput
                value={loginPassword}
                onChange={setLoginPassword}
                placeholder="Enter your password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#4a5070', padding: '4px',
                }}
              >
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {loginError && (
            <div style={{
              fontSize: '18px', color: '#d32f2f', marginTop: '14px',
              padding: '10px 14px', background: '#fef2f2', borderRadius: '8px',
              border: '1px solid #fecaca',
            }}>
              {loginError}
            </div>
          )}

          <div style={{ marginTop: '24px' }}>
            <Button
              disabled={!loginEmail.trim() || !loginPassword.trim() || loginLoading}
              style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <LogIn size={18} /> Sign In
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: '32px', gap: '16px', flexWrap: 'wrap',
      }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'linear-gradient(135deg, #eaf1f8, #dce8f2)',
            color: '#1a5276', fontSize: '15px', fontWeight: '700',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            padding: '7px 16px', borderRadius: '20px', marginBottom: '12px',
          }}>
            <BarChart3 size={14} />
            Admin Dashboard
          </div>
          <h1 style={{
            fontSize: 'clamp(27px, 4.5vw, 41px)', fontWeight: '800',
            color: '#0f1628', letterSpacing: '-0.5px', marginBottom: '4px',
          }}>
            All Submitted Results
          </h1>
          <p style={{ fontSize: '16px', color: '#4a5070' }}>
            {data ? `${data.length} result${data.length !== 1 ? 's' : ''}` : 'Loading...'}
          </p>
          {!isSuperAdmin && clientId && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#0f1628', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                Assessment Link
              </div>
              <p style={{ fontSize: '16px', color: '#4a5070', margin: '0 0 10px', lineHeight: '1.7' }}>
                Share this link with anyone you want to take the assessment. Their responses will appear in your dashboard below once completed.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  flex: 1, padding: '8px 12px', background: '#f8f9fc', borderRadius: '8px',
                  border: '1.5px solid #e0e3ef', fontSize: '15px', color: '#1a5276',
                  wordBreak: 'break-all', fontFamily: 'monospace', lineHeight: '1.5',
                }}>
                  {assessmentLink}
                </div>
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(assessmentLink);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {}
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px', borderRadius: '8px', flexShrink: 0,
                    background: copied ? '#27ae60' : 'linear-gradient(135deg, #1a5276, #1e6a8a)',
                    color: '#fff', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  title="Copy link"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              {copied && (
                <p style={{ fontSize: '18px', color: '#27ae60', marginTop: '4px', fontWeight: '600' }}>
                  Link copied to clipboard!
                </p>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <button
            onClick={load}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#fff', border: '1.5px solid #e4e9f2',
              borderRadius: '10px', padding: '10px 20px',
              fontSize: '15px', fontWeight: '600', color: '#4a5070',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = '#1a5276'; e.target.style.color = '#1a5276'; }}
            onMouseLeave={(e) => { e.target.style.borderColor = '#e4e9f2'; e.target.style.color = '#4a5070'; }}
          >
            <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '40px', height: '40px',
                background: '#fff', border: '1.5px solid #e4e9f2',
                borderRadius: '10px',
                cursor: 'pointer', fontFamily: 'inherit', color: '#4a5070',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = '#1a5276'; e.target.style.color = '#1a5276'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#e4e9f2'; e.target.style.color = '#4a5070'; }}
            >
              <MoreVertical size={18} />
            </button>
            {menuOpen && (
              <>
                <div
                  onClick={() => setMenuOpen(false)}
                  style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                />
                <div style={{
                  position: 'absolute', right: 0, top: '44px', zIndex: 100,
                  background: '#fff', border: '1.5px solid #e4e9f2',
                  borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                  minWidth: '180px', overflow: 'hidden',
                }}>
                  <button
                    onClick={() => { setMenuOpen(false); setShowChangePw(true); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '12px 16px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: '15px', fontWeight: '600',
                      color: '#0f1628', transition: 'all 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#f5f7fb'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    <LogOut size={15} style={{ transform: 'rotate(90deg)' }} />
                    Change Password
                  </button>
                  <div style={{ height: '1px', background: '#eef0f6', margin: '0 8px' }} />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      localStorage.removeItem('isAuth');
                      localStorage.removeItem('client_id');
                      localStorage.removeItem('isSuperAdmin');
                      setLoginEmail('');
                      setLoginPassword('');
                      setAuthed(false);
                      setClientId(null);
                      setIsSuperAdmin(false);
                      setData(null);
                      window.dispatchEvent(new Event('auth-change'));
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      width: '100%', padding: '12px 16px',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontSize: '15px', fontWeight: '600',
                      color: '#d32f2f', transition: 'all 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.target.style.background = 'none'}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {loading && !data && (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4a5070' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #eef0f6',
            borderTopColor: '#1a5276', borderRadius: '50%',
            margin: '0 auto 16px', animation: 'spin 0.8s linear infinite',
          }} />
          Loading results...
        </div>
      )}

      {error && !loading && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#fff5f5', border: '1.5px solid #f5c6cb',
          borderRadius: '14px', color: '#721c24',
        }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⚠</div>
          <div style={{ fontWeight: '700', marginBottom: '6px' }}>Failed to load results</div>
          <div style={{ fontSize: '15px', color: '#a05858' }}>{error}</div>
          <button
            onClick={load}
            style={{
              marginTop: '16px', padding: '8px 24px',
              background: '#1a5276', color: '#fff', border: 'none',
              borderRadius: '8px', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: '15px', fontWeight: '600',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {data && data.length === 0 && !loading && (
        <div style={{
          textAlign: 'center', padding: '80px 20px',
          background: '#fff', border: '1.5px solid #e4e9f2',
          borderRadius: '14px', color: '#4a5070',
        }}>
          <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
          <div style={{ fontWeight: '700', fontSize: '15px', color: '#0f1628', marginBottom: '6px' }}>
            No results yet
          </div>
          <div style={{ fontSize: '15px' }}>
            Complete the assessment to see your results here.
          </div>
        </div>
      )}

      {data && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map((item) => (
            <ResultCard key={item._id} item={item} isDesktop={isDesktop} selected={selectedIds.includes(item._id)} onToggle={() => toggleSelect(item._id)} />
          ))}
        </div>
      )}

      {selectedIds.length >= 2 && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 1000,
        }}>
          <button
            onClick={() => {
              const selectedItems = data.filter((d) => selectedIds.includes(d._id));
              setSelectedIds([]);
              navigate('/admin/compare', { state: selectedItems });
            }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 28px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #1a5276, #1e6a8a)',
              color: '#fff', border: 'none', fontSize: '16px', fontWeight: '700',
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em',
              boxShadow: '0 8px 32px rgba(26,82,118,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            <GitCompare size={18} />
            Compare Selected ({selectedIds.length})
          </button>
        </div>
      )}

      {showChangePw && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)', padding: '20px',
        }}>
          <div style={{
            background: '#fff', borderRadius: '18px',
            width: '100%', maxWidth: '400px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            borderLeft: '4px solid #1a5276',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px 24px 0',
            }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0f1628' }}>
                Change Password
              </h3>
              <button
                onClick={() => { setShowChangePw(false); setNewPassword(''); setConfirmPassword(''); setShowNewPw(false); setShowConfirmPw(false); setPwChangeError(''); setPwChangeSuccess(''); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4a5070', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '20px 24px 24px' }}>
              {pwChangeSuccess ? (
                <div>
                  <div style={{
                    fontSize: '15px', color: '#27ae60', marginBottom: '16px',
                    padding: '10px 14px', background: '#f0faf4', borderRadius: '8px',
                    border: '1px solid #b8e6c8',
                  }}>
                    {pwChangeSuccess}
                  </div>
                  <button
                    onClick={() => { setShowChangePw(false); setNewPassword(''); setConfirmPassword(''); setShowNewPw(false); setShowConfirmPw(false); setPwChangeSuccess(''); }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      width: '100%', padding: '10px', borderRadius: '10px',
                      background: '#1a5276', color: '#fff', border: 'none',
                      fontSize: '15px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
                    }}
                  >
                    Done
                  </button>
                </div>
              ) : (
        <form autoComplete="off" onSubmit={async (e) => {
                  e.preventDefault();
                  setPwChangeError('');
                  setPwChangeSuccess('');
                  if (!newPassword.trim()) { setPwChangeError('Please enter a new password'); return; }
                  if (!confirmPassword.trim()) { setPwChangeError('Please confirm your new password'); return; }
                  if (newPassword !== confirmPassword) { setPwChangeError('Passwords do not match'); return; }
                  setPwChangeLoading(true);
                  const res = await setUserPassword(clientId, newPassword);
                  setPwChangeLoading(false);
                  if (res.success) {
                    setPwChangeSuccess(res.message || 'Password updated successfully');
                  } else {
                    setPwChangeError(res.message || 'Failed to update password');
                  }
                }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '15px', fontWeight: '600', color: '#2a2d44', marginBottom: '6px', display: 'block' }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: '10px',
                          border: '1.5px solid #dee6f0', fontSize: '16px',
                          fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1a5276'}
                        onBlur={(e) => e.target.style.borderColor = '#dee6f0'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#4a5070', padding: '4px',
                        }}
                      >
                        {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '15px', fontWeight: '600', color: '#2a2d44', marginBottom: '6px', display: 'block' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        style={{
                          width: '100%', padding: '10px 14px', borderRadius: '10px',
                          border: '1.5px solid #dee6f0', fontSize: '16px',
                          fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#1a5276'}
                        onBlur={(e) => e.target.style.borderColor = '#dee6f0'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        style={{
                          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', cursor: 'pointer', color: '#4a5070', padding: '4px',
                        }}
                      >
                        {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  {pwChangeError && (
                    <div style={{
                      fontSize: '15px', color: '#d32f2f', marginBottom: '14px',
                      padding: '10px 14px', background: '#fef2f2', borderRadius: '8px',
                      border: '1px solid #fecaca',
                    }}>
                      {pwChangeError}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={!newPassword.trim() || !confirmPassword.trim() || pwChangeLoading}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      width: '100%', padding: '10px', borderRadius: '10px',
                      background: !newPassword.trim() || !confirmPassword.trim() || pwChangeLoading ? '#4a5070' : '#1a5276',
                      color: '#fff', border: 'none',
                      fontSize: '15px', fontWeight: '700', cursor: !newPassword.trim() || !confirmPassword.trim() || pwChangeLoading ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.2s',
                    }}
                  >
                    {pwChangeLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ResultCard({ item, isDesktop, selected, onToggle }) {
  const navigate = useNavigate();
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

  const generatePDF = (mode) => {
    const sortedP = getSortedPersonas(scores);
    const maxP = sortedP[0]?.score || 1;
    const pri = sortedP[0];
    const sortedR = getSortedRoles(roleScores);
    const maxR = sortedR[0]?.score || 1;
    const priRole = sortedR[0];
    if (!pri || !priRole) return;
    const html = buildEmailHTML({ sortedP, maxP, pri, sortedR, maxR, priRole, S: { userName: item.name, userEmail: item.email, filledFor: item.filledFor } });
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
    const filename = `RedRock-Results-${item.name.replace(/\s+/g, '-')}.pdf`;
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
          const cleanup = () => {
            if (iframe.parentNode) document.body.removeChild(iframe);
          };
          if (mode === 'download') {
            pdf.save(filename);
            cleanup();
          } else if (mode === 'share') {
            const blob = pdf.output('blob');
            if (navigator.share) {
              const file = new File([blob], filename, { type: 'application/pdf' });
              navigator.share({
                files: [file],
                title: 'RedRock Assessment Results',
                text: `Assessment results for ${item.name}`,
              }).catch(() => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
              }).finally(cleanup);
            } else {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = filename;
              a.click();
              URL.revokeObjectURL(url);
              cleanup();
            }
          }
        })
        .catch(() => {
          if (iframe.parentNode) document.body.removeChild(iframe);
        });
    };
  };

  return (
    <div className="result-card" style={{
      background: '#fff',
      border: '1.5px solid #dee6f0',
      borderRadius: '16px',
      padding: isDesktop ? '24px 28px' : '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      borderLeft: `4px solid ${topPersonaData?.accent || '#2a2d44'}`,
    }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: '16px', marginBottom: '18px', flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggle}
              style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#1a5276' }}
            />
          </label>
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
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#0f1628' }}>
                {item.name}
              </span>
              <span style={{
                fontSize: '15px', background: topPersonaData?.accent || '#2a2d44',
                color: '#fff', borderRadius: '6px', padding: '3px 10px',
                fontWeight: '700', letterSpacing: '0.03em',
              }}>
                {topPersonaName}
              </span>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap',
              marginTop: '4px', fontSize: '15px', color: '#4a5070',
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} /> {item.email}
              </span>
              {item.role && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={12} /> {item.role}
                </span>
              )}
              {item.filledFor && (
                <span style={{
                  display: 'inline-block', fontSize: '16px', fontWeight: '700',
                  borderRadius: '6px', padding: '2px 8px',
                  background: '#eaf1f8', color: '#1a5276',
                  textTransform: 'capitalize',
                }}>
                  {item.filledFor}
                </span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={12} /> {added}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: '8px', marginBottom: '18px', flexWrap: 'wrap',
      }}>
        <button
          onClick={() => generatePDF('download')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #1a5276',
            background: '#fff', color: '#1a5276', fontSize: '15px',
            fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#eaf1f8'; }}
          onMouseLeave={(e) => { e.target.style.background = '#fff'; }}
        >
          <Download size={14} /> PDF
        </button>
        <button
          onClick={() => generatePDF('share')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #1a5276',
            background: '#fff', color: '#1a5276', fontSize: '15px',
            fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#eaf1f8'; }}
          onMouseLeave={(e) => { e.target.style.background = '#fff'; }}
        >
          <Share2 size={14} /> Share
        </button>
        <button
          onClick={() => navigate('/admin/result', { state: item })}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            padding: '7px 14px', borderRadius: '8px', border: '1.5px solid #4a5070',
            background: '#fff', color: '#4a5070', fontSize: '15px',
            fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => { e.target.style.background = '#f5f7fb'; }}
          onMouseLeave={(e) => { e.target.style.background = '#fff'; }}
        >
          <ExternalLink size={14} /> View
        </button>
      </div>

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
        fontSize: '15px', letterSpacing: '0.16em', textTransform: 'uppercase',
        color: '#0f1628', fontWeight: '700', marginBottom: '10px',
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
              <span style={{ width: '20px', textAlign: 'center', fontSize: '16px', flexShrink: 0 }}>{emoji}</span>
              <span style={{
                flex: 1, fontSize: '15px', color: isTop ? '#0f1628' : '#2a2d44',
                fontWeight: isTop ? '700' : '400', minWidth: '100px',
              }}>
                {name}
              </span>
              <div style={{ flex: 2, height: '5px', background: '#eef0f6', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: '3px',
                  background: isTop ? (accent || '#1a5276') : '#2a2d44',
                  width: `${pct2}%`, transition: 'width 0.4s',
                }} />
              </div>
              <span style={{
                width: '28px', textAlign: 'right', fontSize: '15px',
                color: '#4a5070', fontWeight: isTop ? '600' : '400',
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
