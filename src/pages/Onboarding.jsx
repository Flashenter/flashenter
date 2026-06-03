import { useState, useEffect } from 'react'
import { Plus, ChevronDown, ChevronUp, Check, Calendar, FileText } from 'lucide-react'
import { Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

const stepLabels = ['Application received', 'Initial interview', 'Final interview', 'Docs & contracts', 'Client intro', 'First day']
const adminColors = {
  'SR': { bg: 'var(--purple-600)', color: '#fff' },
  'AR': { bg: 'var(--teal-400)', color: '#fff' },
  'JR': { bg: 'var(--amber-400)', color: '#fff' },
}

export default function Onboarding() {
  const [expanded, setExpanded] = useState({})
  const [onboardings, setOnboardings] = useState([])

  useEffect(() => { fetchOnboardings() }, [])

  async function fetchOnboardings() {
    const { data } = await supabase.from('onboardings').select('*').order('created_at', { ascending: false })
    if (data) {
      setOnboardings(data)
      const exp = {}
      data.forEach(ob => { exp[ob.id] = true })
      setExpanded(exp)
    }
  }

  async function advanceStep(ob) {
    const nextStep = (onboardings.find(o => o.id === ob.id)?..current_step || 0) + 1
    await supabase.from('onboardings').update({ current_step: nextStep, status: nextStep >= 5 ? 'complete' : 'in-progress' }).eq('id', ob.id)
    fetchOnboardings()
  }

  async function markActionNeeded(id) {
    await supabase.from('onboardings').update({ status: 'action-needed' }).eq('id', id)
    fetchOnboardings()
  }

  const toggleExpand = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }))

  return (
    <div>
      <PageHeader title="VA onboarding" subtitle="Active placements being processed">
        <Button variant="primary" icon={Plus}>Start new onboarding</Button>
      </PageHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="animate-fade-up">
        {onboardings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: 13 }}>No onboardings yet.</div>
        ) : onboardings.map(ob => {
          const isOpen = expanded[ob.id]
          const ac = adminColors[ob.admin_initials] || { bg: 'var(--purple-600)', color: '#fff' }
          const interviews = ob.interviews || []
          return (
            <Card key={ob.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: isOpen ? '0.5px solid rgba(0,0,0,0.06)' : 'none', cursor: 'pointer' }} onClick={() => toggleExpand(ob.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar initials={ob.va_initials} size={38} colorIndex={ob.color_index || 0} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{ob.va_name}<span style={{ fontSize: 11, color: '#888780', fontWeight: 400 }}> to {ob.client_name}</span></div>
                    <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{ob.country} · {ob.role} · Started {ob.start_date}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 20, padding: '3px 10px 3px 3px' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: ac.bg, color: ac.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 600 }}>{ob.admin_initials}</div>
                    <span style={{ fontSize: 10, color: '#5F5E5A' }}>Admin: {ob.admin_name}</span>
                  </div>
                  <Tag color={ob.status === 'in-progress' ? 'amber' : ob.status === 'complete' ? 'green' : 'red'}>{ob.status === 'in-progress' ? 'In progress' : ob.status === 'complete' ? 'Complete' : 'Action needed'}</Tag>
                  {isOpen ? <ChevronUp size={14} color="#888780" /> : <ChevronDown size={14} color="#888780" />}
                </div>
              </div>
              {isOpen && (
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 4, marginBottom: 14 }}>
                    {stepLabels.map((label, i) => {
                      const done = i < ob.current_step
                      const active = i === ob.current_step
                      return (
                        <div key={label} style={{ textAlign: 'center' }}>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', margin: '0 auto 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, background: done ? 'var(--purple-600)' : active ? 'var(--purple-50)' : '#F5F4F1', border: active ? '2px solid var(--purple-600)' : '0.5px solid rgba(0,0,0,0.08)', color: done ? '#fff' : active ? 'var(--purple-600)' : '#B4B2A9' }}>
                            {done ? <Check size={10} /> : i + 1}
                          </div>
                          <div style={{ fontSize: 9, lineHeight: 1.3, color: active ? 'var(--purple-600)' : done ? '#1a1a18' : '#B4B2A9', fontWeight: active ? 600 : 400 }}>{label}</div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                    {[
                      { label: 'Client', val: ob.client_name, sub: ob.client_contact },
                      { label: 'Role', val: ob.role, sub: ob.type },
                      { label: 'Start date', val: ob.start_date, sub: ob.start_date !== 'TBD' ? '9:00am local' : 'Pending' },
                      { label: 'Pay rate', val: ob.rate, sub: 'Paid every Friday' },
                      { label: 'Contract', val: ob.contract, sub: ob.contract?.includes('✓') ? 'Signed' : 'Not sent', valColor: ob.contract?.includes('✓') ? 'var(--green-600)' : 'var(--amber-400)' },
                      { label: 'Bank', val: ob.bank, sub: ob.bank === 'Pending' ? 'Setup needed' : 'On file', valColor: ob.bank === 'Pending' ? 'var(--amber-400)' : 'var(--green-600)' },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '9px 10px', background: '#F5F4F1', borderRadius: 10 }}>
                        <div style={{ fontSize: 10, color: '#888780', marginBottom: 3 }}>{item.label}</div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: item.valColor || '#1a1a18' }}>{item.val}</div>
                        <div style={{ fontSize: 10, color: '#888780', marginTop: 1 }}>{item.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 12 }}>
                    {interviews.map((int, i) => (
                      <div key={i} style={{ padding: '9px 10px', borderRadius: 10, background: int.done ? 'var(--green-50)' : int.active ? 'var(--purple-50)' : '#F5F4F1', border: `0.5px solid ${int.done ? '#97C459' : int.active ? 'var(--purple-200)' : 'rgba(0,0,0,0.06)'}` }}>
                        <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 3, color: int.done ? 'var(--green-600)' : int.active ? 'var(--purple-600)' : '#888780' }}>{int.label}</div>
                        <div style={{ fontSize: 11, color: '#5F5E5A' }}>{int.date}</div>
                        {int.done && <div style={{ fontSize: 10, marginTop: 5, color: 'var(--green-600)', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 3 }}><FileText size={10} /> View notes</div>}
                        {int.active && <div style={{ fontSize: 10, marginTop: 5, color: 'var(--purple-600)', cursor: 'pointer', fontWeight: 500 }}>Complete now</div>}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
                    {interviews.filter(i => i.done && i.notes).map((int, i) => (
                      <div key={i} style={{ padding: '9px 12px', borderRadius: 10, background: '#F5F4F1', borderLeft: `3px solid ${i === 0 ? 'var(--purple-600)' : 'var(--red-400)'}` }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a18', marginBottom: 4 }}>{int.label} · {ob.admin_name}</div>
                        <div style={{ fontSize: 12, color: '#444441', lineHeight: 1.5 }}>{int.notes}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => advanceStep(ob)} style={{ flex: 1, padding: '8px', borderRadius: 10, background: 'var(--purple-600)', color: '#fff', border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Advance to next step</button>
                    <button onClick={() => markActionNeeded(ob.id)} style={{ padding: '8px 16px', borderRadius: 10, background: 'var(--amber-50)', color: 'var(--amber-600)', border: '0.5px solid var(--amber-200)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Flag</button>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}