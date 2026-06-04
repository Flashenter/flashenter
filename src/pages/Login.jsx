import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login({ onLogin }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function signInWithGoogle() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1' }}>
      <div style={{ width: 380, background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>
            <span style={{ color: '#534AB7' }}>Flash</span>enter
          </div>
          <div style={{ fontSize: 13, color: '#888780' }}>One platform · One team · One price</div>
        </div>

        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6, textAlign: 'center' }}>Sign in to your workspace</div>
        <div style={{ fontSize: 12, color: '#888780', marginBottom: 24, textAlign: 'center' }}>Use your Google account to sign in or register</div>

        {error && (
          <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#791F1F' }}>
            {error}
          </div>
        )}

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
          First time? You'll be registered automatically.<br />
          Access requires admin approval.
        </div>
      </div>
    </div>
  )
}