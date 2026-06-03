import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Globe, Clock, Users, DollarSign, Bell, Check, Send, Phone as PhoneIcon, FileText, UserPlus, Plus, Trash2 } from 'lucide-react'
import { Card, Tag, Avatar, Button, SectionTitle } from '../components/ui'
import { supabase } from '../lib/supabase'

const stages = ['New inquiry', 'First contact', 'Qualified', 'Proposal sent', 'Negotiation', 'Closed — client']

const urgencyStyle = {
  overdue:  { bg: 'var(--red-50)',   border: '#F09595',          titleColor: '#791F1F', timeColor: '#A32D2D' },
  today:    { bg: 'var(--amber-50)', border: '#EF9F27',          titleColor: '#633806', timeColor: '#854F0B' },
  upcoming: { bg: '#fff',            border: 'rgba(0,0,0,0.08)', titleColor: '#1a1a18', timeColor: '#888780' },
  done:     { bg: '#F5F4F1',         border: 'rgba(0,0,0,0.06)', titleColor: '#1a1a18', timeColor: '#B4B2A9' },
}

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [notes, setNotes] = useState([])
  const [reminders, setReminders] = useState([])
  const [noteText, setNoteText] = useState('')
  const [noteType, setNoteType] = useState('Note')
  const [showReminder, setShowReminder] = useState(false)
  const [newReminder, setNewReminder] = useState({ title: '', sub: '', when_text: '', type: 'Follow-up', urgency: 'upcoming' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [id])

  async function fetchAll() {
    setLoading(true)
    const [{ data: c }, { data: n }, { data: r }] = await Promise.all([
      supabase.from('contacts').select('*').eq('id', id).single(),
      supabase.from('notes').select('*').eq('contact_id', id).order('created_at', { ascending: false }),
      supabase.from('reminders').select('*').eq('contact_id', id).order('created_at', { ascending: false }),
    ])
    setContact(c)
    setNotes(n || [])
    setReminders(r || [])
    setLoading(false)
  }

  async function saveNote() {
    if (!noteText.trim()) return
    await supabase.from('notes').insert([{ contact_id: id, author: 'Admin', text: noteText, type: noteType }])
    setNoteText('')
    fetchAll()
  }

  async function saveReminder() {
    if (!newReminder.title) return alert('Please enter a title')
    await supabase.from('reminders').insert([{ ...newReminder, contact_id: id }])
    setShowReminder(false)
    setNewReminder({ title: '', sub: '', when_text: '', type: 'Follow-up', urgency: 'upcoming' })
    fetchAll()
  }

  async function toggleReminder(rid, done) {
    await supabase.from('reminders').update({ done: !done }).eq('id', rid)
    fetchAll()
  }

  async function deleteNote(nid) {
    await supabase.from('notes').delete().eq('id', nid)
    fetchAll()
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60, color: '#888780' }}>Loading...</div>
  if (!contact) return <div style={{ textAlign: 'center', padding: 60 }}>Contact not found</div>

  const currentStageIdx = stages.findIndex(s => s === contact.stage) || 0

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <button onClick={() => navigate('/contacts')} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 6, fontFamily: 'var(--font-sans)' }}>
            <ArrowLeft size={13} /> Back to contacts
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.3px' }}>{contact.name}</h1>
          <p style={{ fontSize: 12, color: '#888780', marginTop: 3 }}>{contact.title} · {contact.company} · {contact.country}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={Mail}>Email</Button>
          <Button icon={Phone}>Call</Button>
          <Button variant="primary" icon={Bell} onClick={() => setShowReminder(true)}>Add reminder</Button>
        </div>
      </div>

      {showReminder && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New reminder</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'title', label: 'Title *' },
              { key: 'sub', label: 'Details' },
              { key: 'when_text', label: 'When (e.g. Today 4pm)' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input value={newReminder[f.key]} onChange={e => setNewReminder(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Urgency</div>
              <select value={newReminder.urgency} onChange={e => setNewReminder(p => ({ ...p, urgency: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option value="overdue">Overdue</option>
                <option value="today">Today</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Type</div>
              <select value={newReminder.type} onChange={e => setNewReminder(p => ({ ...p, type: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option>Follow-up</option>
                <option>Call</option>
                <option>Email</option>
                <option>Meeting</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={saveReminder} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save reminder</button>
            <button onClick={() => setShowReminder(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ textAlign: 'center', padding: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EEEDFE', color: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, margin: '0 auto 10px' }}>
              {contact.name?.slice(0,2).toUpperCase()}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{contact.name}</div>
            <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>{contact.title} · {contact.company}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: contact.status === 'hot' ? 'var(--red-50)' : contact.status === 'client' ? 'var(--green-50)' : '#EEEDFE', color: contact.status === 'hot' ? 'var(--red-600)' : contact.status === 'client' ? 'var(--green-600)' : '#534AB7' }}>
                {contact.status}
              </span>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 10, color: '#888780', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Contact info</div>
            {[
              { Icon: Mail, val: contact.email },
              { Icon: Phone, val: contact.phone },
              { Icon: Globe, val: contact.country },
              { Icon: Users, val: contact.vas ? contact.vas + ' VAs · ' + contact.budget : contact.budget },
            ].filter(r => r.val).map(({ Icon, val }) => (
              <div key={val} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Icon size={13} color="#B4B2A9" style={{ flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontSize: 12, color: '#1a1a18' }}>{val}</div>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontSize: 10, color: '#888780', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Deal stage</div>
            {stages.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', position: 'relative' }}>
                {i < stages.length - 1 && <div style={{ position: 'absolute', left: 9, top: 24, width: 1.5, height: 14, background: 'rgba(0,0,0,0.08)' }} />}
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, background: i < currentStageIdx ? '#534AB7' : i === currentStageIdx ? '#EEEDFE' : '#F5F4F1', border: i === currentStageIdx ? '2px solid #534AB7' : '0.5px solid rgba(0,0,0,0.1)', color: i < currentStageIdx ? '#fff' : i === currentStageIdx ? '#534AB7' : '#B4B2A9' }}>
                  {i < currentStageIdx ? <Check size={9} /> : i + 1}
                </div>
                <span style={{ fontSize: 12, color: i === currentStageIdx ? '#534AB7' : i < currentStageIdx ? '#1a1a18' : '#B4B2A9', fontWeight: i === currentStageIdx ? 600 : 400 }}>{s}</span>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <SectionTitle>Reminders</SectionTitle>
            {reminders.length === 0 && <div style={{ fontSize: 12, color: '#888780', padding: '8px 0' }}>No reminders yet — click "Add reminder" above</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {reminders.map(r => {
                const us = urgencyStyle[r.done ? 'done' : r.urgency] || urgencyStyle.upcoming
                return (
                  <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 10px', borderRadius: 10, background: us.bg, border: `0.5px solid ${us.border}`, opacity: r.done ? 0.6 : 1 }}>
                    <button onClick={() => toggleReminder(r.id, r.done)} style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1, border: `0.5px solid ${r.done ? 'var(--green-400)' : 'rgba(0,0,0,0.15)'}`, background: r.done ? 'var(--green-400)' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      {r.done && <Check size={10} color="#fff" />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: us.titleColor }}>{r.title}</div>
                      {r.sub && <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{r.sub}</div>}
                      {r.when_text && <div style={{ fontSize: 10, marginTop: 3, color: us.timeColor }}>{r.when_text}</div>}
                    </div>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#EEEDFE', color: '#534AB7' }}>{r.type}</span>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <SectionTitle>Notes</SectionTitle>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, background: '#F5F4F1', borderRadius: 10, padding: 10 }}>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a note, call summary, or update..." rows={2}
                style={{ flex: 1, border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '7px 10px', fontSize: 12, fontFamily: 'var(--font-sans)', resize: 'none', background: '#fff', color: '#1a1a18', outline: 'none' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <select value={noteType} onChange={e => setNoteType(e.target.value)}
                  style={{ padding: '5px 8px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 11, fontFamily: 'var(--font-sans)' }}>
                  <option>Note</option>
                  <option>Call summary</option>
                  <option>Meeting</option>
                  <option>Email</option>
                </select>
                <button onClick={saveNote} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save</button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notes.map(n => (
                <div key={n.id} style={{ padding: '10px 12px', borderRadius: 10, background: '#F5F4F1', borderLeft: '3px solid #534AB7', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{n.author}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 10, color: '#888780' }}>{new Date(n.created_at).toLocaleDateString()}</span>
                      <button onClick={() => deleteNote(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#B4B2A9', fontSize: 11 }}>✕</button>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: '#444441', lineHeight: 1.5 }}>{n.text}</div>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: '#EEEDFE', color: '#534AB7', marginTop: 5, display: 'inline-block' }}>{n.type}</span>
                </div>
              ))}
              {notes.length === 0 && <div style={{ fontSize: 12, color: '#888780' }}>No notes yet — add your first note above</div>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}