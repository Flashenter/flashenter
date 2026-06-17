import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PageHeader, Avatar } from '../components/ui'
import { Mail, Check } from 'lucide-react'

export default function Inbox({ org }) {
  const [messages, setMessages] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('messages')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: msgs }, { data: subs }, { data: hols }] = await Promise.all([
      supabase.from('messages').select('*').eq('org_id', org?.id).order('created_at', { ascending: false }),
      supabase.from('va_submissions').select('*').eq('org_id', org?.id).order('created_at', { ascending: false }),
      supabase.from('client_holidays').select('*').eq('org_id', org?.id).order('date', { ascending: true }),
    ])
    setMessages(msgs || [])
    setSubmissions(subs || [])
    setHolidays(hols || [])
    setLoading(false)
  }

  async function markRead(id) {
    await supabase.from('messages').update({ read: true }).eq('id', id)
    fetchAll()
  }

  async function approveSubmission(id) {
    await supabase.from('va_submissions').update({ status: 'approved' }).eq('id', id)
    const sub = submissions.find(s => s.id === id)
    if (sub) {
      await supabase.from('timesheets').insert([{
        va_name: sub.va_name,
        hours: sub.hours,
        overtime: sub.overtime,
        notes: sub.notes,
        status: 'approved',
        via: 'VA Portal'
      }])
    }
    fetchAll()
  }

  async function approveHoliday(id) {
    await supabase.from('client_holidays').update({ status: 'approved' }).eq('id', id)
    fetchAll()
  }

  const unreadMessages = messages.filter(m => !m.read).length
  const pendingSubs = submissions.filter(s => s.status === 'pending').length
  const pendingHols = holidays.filter(h => h.status === 'pending').length

  const tabs = [
    { key: 'messages', label: `Messages ${unreadMessages > 0 ? `(${unreadMessages})` : ''}` },
    { key: 'timesheets', label: `VA Timesheets ${pendingSubs > 0 ? `(${pendingSubs})` : ''}` },
    { key: 'holidays', label: `Client Holidays ${pendingHols > 0 ? `(${pendingHols})` : ''}` },
  ]

  return (
    <div>
      <PageHeader title="Inbox" subtitle="Messages and submissions from your VAs and clients" />

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 16px', borderRadius: 40, border: 'none', cursor: 'pointer', fontSize: 12,
            fontWeight: tab === t.key ? 600 : 400,
            background: tab === t.key ? '#534AB7' : '#fff',
            color: tab === t.key ? '#fff' : '#5F5E5A',
            fontFamily: 'var(--font-sans)'
          }}>{t.label}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
      ) : (
        <>
          {tab === 'messages' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {messages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📬</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No messages yet</div>
                  <div style={{ fontSize: 13, color: '#888780' }}>Messages from VAs and clients will appear here</div>
                </div>
              ) : messages.map((m, i) => (
                <div key={m.id} style={{ padding: '14px 16px', background: m.read ? '#fff' : '#EEEDFE', border: `0.5px solid ${m.read ? 'rgba(0,0,0,0.08)' : '#AFA9EC'}`, borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: m.from_type === 'va' ? '#EAF3DE' : '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {m.from_type === 'va' ? '👩‍💼' : '🏢'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.from_name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 10, color: '#888780' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: m.from_type === 'va' ? '#EAF3DE' : '#EEEDFE', color: m.from_type === 'va' ? '#3B6D11' : '#534AB7' }}>
                          {m.from_type === 'va' ? 'VA' : 'Client'}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{m.subject}</div>
                    <div style={{ fontSize: 12, color: '#5F5E5A', lineHeight: 1.5 }}>{m.body}</div>
                    {!m.read && (
                      <button onClick={() => markRead(m.id)}
                        style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#534AB7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                        <Check size={11} /> Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'timesheets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {submissions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No timesheet submissions yet</div>
                  <div style={{ fontSize: 13, color: '#888780' }}>When VAs submit timesheets through their portal they appear here</div>
                </div>
              ) : submissions.map(s => (
                <div key={s.id} style={{ padding: '14px 16px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EAF3DE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: '#3B6D11' }}>
                        {s.va_name?.slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{s.va_name}</div>
                        <div style={{ fontSize: 11, color: '#888780' }}>Week of {s.week_start} · {s.hours}h regular · {s.overtime}h OT</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {s.file_url && (
                        <a href={s.file_url} target="_blank" rel="noreferrer"
                          style={{ fontSize: 11, color: '#534AB7', padding: '4px 10px', borderRadius: 8, border: '0.5px solid #AFA9EC', textDecoration: 'none' }}>
                          View file
                        </a>
                      )}
                      {s.status === 'pending' ? (
                        <button onClick={() => approveSubmission(s.id)}
                          style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, border: 'none', background: '#EAF3DE', color: '#3B6D11', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                          Approve
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: '#EAF3DE', color: '#3B6D11' }}>✅ Approved</span>
                      )}
                    </div>
                  </div>
                  {s.notes && <div style={{ fontSize: 12, color: '#888780', paddingLeft: 46 }}>{s.notes}</div>}
                </div>
              ))}
            </div>
          )}

          {tab === 'holidays' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {holidays.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No holiday requests yet</div>
                  <div style={{ fontSize: 13, color: '#888780' }}>When clients submit holidays through their portal they appear here</div>
                </div>
              ) : holidays.map(h => (
                <div key={h.id} style={{ padding: '14px 16px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 28 }}>📅</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{h.client_name}</div>
                      <div style={{ fontSize: 11, color: '#888780' }}>{h.date} · {h.reason}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {h.status === 'pending' ? (
                      <>
                        <button onClick={() => approveHoliday(h.id)}
                          style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, border: 'none', background: '#EAF3DE', color: '#3B6D11', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                          Approve
                        </button>
                        <button onClick={() => supabase.from('client_holidays').update({ status: 'rejected' }).eq('id', h.id).then(fetchAll)}
                          style={{ fontSize: 11, padding: '4px 12px', borderRadius: 8, border: 'none', background: '#FCEBEB', color: '#A32D2D', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                          Reject
                        </button>
                      </>
                    ) : (
                      <span style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, background: h.status === 'approved' ? '#EAF3DE' : '#FCEBEB', color: h.status === 'approved' ? '#3B6D11' : '#A32D2D' }}>
                        {h.status === 'approved' ? '✅ Approved' : '❌ Rejected'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}