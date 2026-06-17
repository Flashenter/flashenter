import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [mode, setMode] = useState('google')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function signInWithGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  async function signInWithEmail() {
    if (!email || !password) return setError('Please fill in all fields')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
  }

  async function signUpWithEmail() {
    if (!email || !password) return setError('Please fill in all fields')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message) } else {
      setError('')
      alert('Check your email for a confirmation link!')
    }
    setLoading(false)
  }

  async function resetPassword() {
    if (!email) return setError('Please enter your email first')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    })
    if (error) { setError(error.message) } else { setResetSent(true) }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: 400, background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: '#534AB7' }}>Flash</span>enter
          </div>
          <div style={{ fontSize: 13, color: '#888780' }}>One platform · One team · One price</div>
        </div>

        {resetSent ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Check your email</div>
            <div style={{ fontSize: 13, color: '#888780', marginBottom: 20 }}>We sent a password reset link to {email}</div>
            <button onClick={() => { setResetSent(false); setShowReset(false) }} style={{ fontSize: 13, color: '#534AB7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', background: '#F5F4F1', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
              <button onClick={() => { setMode('google'); setError('') }}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: mode === 'google' ? 600 : 400, background: mode === 'google' ? '#fff' : 'transparent', color: mode === 'google' ? '#534AB7' : '#888780', fontFamily: 'DM Sans, sans-serif', boxShadow: mode === 'google' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                Google
              </button>
              <button onClick={() => { setMode('email'); setError('') }}
                style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: mode === 'email' ? 600 : 400, background: mode === 'email' ? '#fff' : 'transparent', color: mode === 'email' ? '#534AB7' : '#888780', fontFamily: 'DM Sans, sans-serif', boxShadow: mode === 'email' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                Email
              </button>
            </div>

            {error && (
              <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#791F1F' }}>
                {error}
              </div>
            )}

            {mode === 'google' && (
              <div>
                <button onClick={signInWithGoogle} disabled={loading}
                  style={{ width: '100%', padding: '12px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.7 : 1 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.17z"/>
                    <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                    <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                    <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
                  </svg>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </button>
                <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#B4B2A9' }}>
                  First time? You will be registered automatically.<br />
                  Access requires admin approval.
                </div>
              </div>
            )}

            {mode === 'email' && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Email address</div>
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com" type="email"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif' }} />
                </div>
                {!showReset && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Password</div>
                    <input value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••" type="password"
                      onKeyDown={e => e.key === 'Enter' && signInWithEmail()}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif' }} />
                  </div>
                )}

                {showReset ? (
                  <div>
                    <button onClick={resetPassword} disabled={loading}
                      style={{ width: '100%', padding: '11px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginBottom: 12, opacity: loading ? 0.7 : 1 }}>
                      Send reset link
                    </button>
                    <button onClick={() => setShowReset(false)} style={{ width: '100%', fontSize: 12, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                      Back to sign in
                    </button>
                  </div>
                ) : (
                  <div>
                    <button onClick={signInWithEmail} disabled={loading}
                      style={{ width: '100%', padding: '11px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', marginBottom: 10, opacity: loading ? 0.7 : 1 }}>
                      {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                      <button onClick={() => setShowReset(true)} style={{ fontSize: 11, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                        Forgot password?
                      </button>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: 12, color: '#888780', marginBottom: 10 }}>— or —</div>
                    <button onClick={signUpWithEmail} disabled={loading}
                      style={{ width: '100%', padding: '11px', borderRadius: 40, border: '0.5px solid #534AB7', background: '#fff', color: '#534AB7', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.7 : 1 }}>
                      Create account
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}