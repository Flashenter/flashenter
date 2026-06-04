import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PageHeader } from '../components/ui'
import { Check, X, Users } from 'lucide-react'

export default function TeamMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchMembers() }, [])

  async function fetchMembers() {
    setLoading(true)
    const { data } = await supabase.from('team_members').select('*').order('created_at', { ascending: false })
    setMembers(data || [])
    setLoading(false)
  }

  async function approve(id) {
    await supabase.from('team_members').update({ approved: true }).eq('id', id)
    fetchMembers()
  }

  async function reject(id) {
    if (!confirm('Remove this team member?')) return
    await supabase.from('team_members').delete().eq('id', id)
    fetchMembers()
  }

  const pending = members.filter(m => !m.approved)
  const approved = members.filter(m => m.approved)

  return (
    <div>
      <PageHeader title="Team members" subtitle={`${approved.length} active · ${pending.length} pending approval`} />

      {pending.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#854F0B', display: 'flex', alignItems: 'center', gap: 6 }}>
            ⏳ Pending approval ({pending.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pending.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#FEF3E2', border: '0.5px solid #EF9F27', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {m.avatar_url ? (
                    <img src={m.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#534AB7' }}>
                      {m.name?.slice(0,2).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name || 'Unknown'}</div>
                    <div style={{ fontSize: 11, color: '#888780' }}>{m.email}</div>
                    <div style={{ fontSize: 10, color: '#B4B2A9', marginTop: 2 }}>Registered {new Date(m.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => approve(m.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    <Check size={13} /> Approve
                  </button>
                  <button onClick={() => reject(m.id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.1)', background: '#fff', color: '#A32D2D', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    <X size={13} /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#3B6D11', display: 'flex', alignItems: 'center', gap: 6 }}>
          ✅ Active team members ({approved.length})
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
        ) : approved.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)', color: '#888780' }}>
            No approved members yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {approved.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {m.avatar_url ? (
                    <img src={m.avatar_url} style={{ width: 36, height: 36, borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#534AB7' }}>
                      {m.name?.slice(0,2).toUpperCase() || '?'}
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#888780' }}>{m.email}</div>
                    <div style={{ fontSize: 10, marginTop: 2, padding: '2px 7px', borderRadius: 20, display: 'inline-block', background: m.role === 'admin' ? '#EEEDFE' : '#F5F4F1', color: m.role === 'admin' ? '#534AB7' : '#888780' }}>
                      {m.role}
                    </div>
                  </div>
                </div>
                <button onClick={() => reject(m.id)}
                  style={{ padding: '6px 12px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.1)', background: '#fff', color: '#A32D2D', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}