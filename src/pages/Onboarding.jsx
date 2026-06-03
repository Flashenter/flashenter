import { useState, useEffect } from 'react'
import { Check, ChevronDown, ChevronUp, Calendar, Plus, FileText } from 'lucide-react'
import { Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

const stepLabels = ['Application received', 'Initial interview', 'Final interview', 'Docs & contracts', 'Client intro', 'First day']

export default function Onboarding() {
  const [onboardings, setOnboardings] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState({})
  const [showAdd, setShowAdd] = useState(false)
  const [newOB, setNewOB] = useState({ va_name: '', client_name: '', country: '', role: '', type: 'Full-time', start_date: '', rate: '', admin_name: '', current_step: 0, status: 'in-progress', contract: 'Not sent', bank: 'Pending' })

  useEffect(() => { fetchOnboardings() }, [])

  async function fetchOnboardings() {
    setLoading(true)
    const { data, error } = await supabase.from('onboardings').select('*').order('created_at', { ascending: false })
    if (error) alert('Error: ' + error.message)
    setOnboardings(data || [])
    setLoading(false)
  }

  async function addOnboarding() {
    if (!newOB.va_name) return alert('Please enter VA name')
    const initials = newOB.va_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const { error } = await supabase.from('onboardings').insert([{ ...newOB, va_initials: initials }])
    if (error) { alert('Error: ' + error.message) } else { setShowAdd(false); fetchOnboardings() }
  }

  async function advanceStep(id, currentStep) {
    if (currentStep >= 5) return
    await supabase.from('onboardings').update({ current_step: currentStep + 1 }).eq('id', id)
    fetchOnboardings()
  }

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  return (
    <div>
      <PageHeader title="VA onboarding" subtitle="Active placements being processed">
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Start new onboarding</Button>
      </PageHeader>

      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New onboarding</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'va_name', label: 'VA Full name *' },
              { key: 'client_name', label: 'Client name *' },
              { key: 'country', label: 'Country (e.g. 🇵🇭 Manila)' },
              { key: 'role', label: 'Role (e.g. Customer Support)' },
              { key: 'start_date', label: 'Start date' },
              { key: 'rate', label: 'Pay rate (e.g. $9.50/hr)' },
              { key: 'admin_name', label: 'Assigned admin' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input value={newOB[f.key]} onChange={e => setNewOB(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Type</div>
              <select value={newOB.type} onChange={e => setNewOB(p => ({ ...p, type: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option>Full-time</option>
                <option>Part-time</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addOnboarding} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
      ) : onboardings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎯</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No onboardings yet</div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Start first onboarding</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {onboardings.map((ob, i) => {
            const isOpen = expanded[ob.id] !== false
            return (
              <div key={ob.id} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: isOpen ? '0.5px solid rgba(0,0,0,0.06)' : 'none', cursor: 'pointer' }} onClick={() => toggleExpand(ob.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar initials={ob.va_initials || ob.va_name?.slice(0,2).toUpperCase()} size={38} colorIndex={i % 6} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        {ob.va_name}
                        <span style={{ fontSize: 11, color: '#888780', fontWeight: 400 }}> → {ob.client_name}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{ob.country} · {ob.role}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: ob.status === 'in-progress' ? 'var(--amber-50)' : 'var(--red-50)', color: ob.status === 'in-progress' ? 'var(--amber-600)' : 'var(--red-600)' }}>
                      {ob.status === 'in-progress' ? 'In progress' : 'Action needed'}
                    </div>
                    {isOpen ? <ChevronUp size={14} color="#888780" /> : <ChevronDown size={14} color="#888780" />}
                  </div>
                </div>

                {isOpen && (
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4, marginBottom: 14 }}>
                      {stepLabels.map((label, idx) => {
                        const done = idx < ob.current_step
                        const active = idx === ob.current_step
                        return (
                          <div key={label} style={{ textAlign: 'center' }}>
                            <div style={{ width: 24, height: 24, borderRadius: '50%', margin: '0 auto 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, background: done ? '#534AB7' : active ? '#EEEDFE' : '#F5F4F1', border: active ? '2px solid #534AB7' : '0.5px solid rgba(0,0,0,0.08)', color: done ? '#fff' : active ? '#534AB7' : '#B4B2A9' }}>
                              {done ? <Check size={10} /> : idx + 1}
                            </div>
                            <div style={{ fontSize: 9, color: active ? '#534AB7' : done ? '#1a1a18' : '#B4B2A9', fontWeight: active ? 600 : 400, lineHeight: 1.3 }}>{label}</div>
                          </div>
                        )
                      })}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                      {[
                        { label: 'Client', val: ob.client_name },
                        { label: 'Role', val: ob.role + ' · ' + ob.type },
                        { label: 'Start date', val: ob.start_date || 'TBD' },
                        { label: 'Pay rate', val: ob.rate },
                        { label: 'Contract', val: ob.contract, color: ob.contract?.includes('✓') ? 'var(--green-600)' : 'var(--amber-400)' },
                        { label: 'Bank details', val: ob.bank, color: ob.bank === 'Pending' ? 'var(--amber-400)' : 'var(--green-600)' },
                      ].map(item => (
                        <div key={item.label} style={{ padding: '9px 10px', background: '#F5F4F1', borderRadius: 10 }}>
                          <div style={{ fontSize: 10, color: '#888780', marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: item.color || '#1a1a18' }}>{item.val}</div>
                        </div>
                      ))}
                    </div>

                    {ob.admin_name && (
                      <div style={{ fontSize: 12, color: '#888780', marginBottom: 10 }}>
                        Assigned admin: <span style={{ fontWeight: 600, color: '#1a1a18' }}>{ob.admin_name}</span>
                      </div>
                    )}

                    {ob.current_step < 5 && (
                      <button onClick={() => advanceStep(ob.id, ob.current_step)} style={{ width: '100%', padding: '10px', borderRadius: 10, border: 'none', background: '#534AB7', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                        Complete step {ob.current_step + 1}: {stepLabels[ob.current_step]} →
                      </button>
                    )}
                    {ob.current_step === 5 && (
                      <div style={{ textAlign: 'center', padding: '10px', background: 'var(--green-50)', borderRadius: 10, color: 'var(--green-600)', fontWeight: 600, fontSize: 12 }}>
                        ✅ Onboarding complete!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}