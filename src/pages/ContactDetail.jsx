import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Globe, Clock, Users, DollarSign, Bell, Check, Send, Phone as PhoneIcon, FileText, UserPlus } from 'lucide-react'
import { Card, Tag, Avatar, Button, SectionTitle } from '../components/ui'
import { contacts, reminders, notes } from '../data'

const stages = ['New inquiry', 'First contact', 'Qualified', 'Proposal sent', 'Negotiation', 'Closed — client']

const typeColors = { 'Call': 'blue', 'Email': 'purple', 'Follow-up': 'amber', 'Meeting': 'teal' }
const urgencyStyle = {
  overdue:  { bg: 'var(--red-50)',   border: 'var(--red-400)',   titleColor: '#791F1F', timeColor: '#A32D2D' },
  today:    { bg: 'var(--amber-50)', border: '#EF9F27',          titleColor: '#633806', timeColor: '#854F0B' },
  upcoming: { bg: '#fff',            border: 'rgba(0,0,0,0.08)', titleColor: '#1a1a18', timeColor: '#888780' },
  done:     { bg: '#F5F4F1',         border: 'rgba(0,0,0,0.06)', titleColor: '#1a1a18', timeColor: '#B4B2A9' },
}

const timelineItems = [
  { icon: Send,     bg: 'var(--amber-50)',   color: 'var(--amber-600)', title: 'Proposal sent', sub: '3 VA package · $1,200/mo · PDF emailed', time: 'Jun 1, 2026 · 11:45am' },
  { icon: PhoneIcon,bg: '#E6F1FB',           color: '#185FA5',          title: 'Call logged — 28 min', sub: 'Budget confirmed, roles discussed, proposal agreed', time: 'Jun 1, 2026 · 11:04am' },
  { icon: FileText, bg: 'var(--purple-50)',  color: 'var(--purple-600)',title: 'Qualification note added', sub: 'Confirmed need, budget, and decision maker', time: 'May 20, 2026 · 3:14pm' },
  { icon: PhoneIcon,bg: '#E6F1FB',           color: '#185FA5',          title: 'First call — 15 min', sub: 'Warm intro via Carlos Peña · Interested in 1–3 VAs', time: 'May 16, 2026 · 10:05am' },
  { icon: UserPlus, bg: 'var(--teal-50)',    color: 'var(--teal-600)',  title: 'Contact created', sub: 'Referred by Carlos Peña · Nexora LLC', time: 'May 14, 2026 · 8:31am' },
]

export default function ContactDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const contact = contacts.find(c => c.id === Number(id)) || contacts[0]
  const [noteText, setNoteText] = useState('')
  const [localReminders, setLocalReminders] = useState(reminders)

  const currentStageIdx = stages.findIndex(s => s.toLowerCase().includes(contact.stage.toLowerCase().split(' ')[0])) || 3

  const toggleReminder = (rid) => {
    setLocalReminders(r => r.map(rem => rem.id === rid ? { ...rem, done: !rem.done } : rem))
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <button onClick={() => navigate('/contacts')} style={{
            display: 'flex', alignItems: 'center', gap: 5, fontSize: 12,
            color: '#888780', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 6,
            fontFamily: 'var(--font-sans)',
          }}>
            <ArrowLeft size={13} /> Back to contacts
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.3px' }}>{contact.name}</h1>
          <p style={{ fontSize: 12, color: '#888780', marginTop: 3 }}>{contact.title} · {contact.company} · {contact.flag} {contact.country}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button icon={Mail}>Email</Button>
          <Button icon={Phone}>Call</Button>
          <Button variant="primary" icon={Bell}>Add reminder</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 14 }}>

        {/* Left panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card style={{ textAlign: 'center', padding: '16px' }}>
            <Avatar initials={contact.initials} size={52} colorIndex={contact.colorIndex} />
            <div style={{ margin: '0 auto', width: 52 }}></div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 10 }}>{contact.name}</div>
            <div style={{ fontSize: 12, color: '#888780', marginTop: 2 }}>{contact.title} · {contact.company}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 8, flexWrap: 'wrap' }}>
              <Tag color={contact.status === 'hot' ? 'red' : contact.status === 'client' ? 'green' : 'amber'}>
                {contact.status === 'hot' ? 'Hot lead' : contact.status === 'client' ? 'Active client' : 'Warm lead'}
              </Tag>
              <Tag color="teal">{contact.flag} {contact.country.split(' ')[0]}</Tag>
            </div>
          </Card>

          <Card>
            <div style={{ fontSize: 10, color: '#888780', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Contact info</div>
            {[
              { Icon: Mail,  val: contact.email },
              { Icon: Phone, val: contact.phone },
              { Icon: Globe, val: contact.company.toLowerCase().replace(' ','')+'.com' },
              { Icon: Clock, val: contact.timezone, sub: 'Current time: 2:14pm' },
            ].map(({ Icon, val, sub }) => (
              <div key={val} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Icon size={13} color="#B4B2A9" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, color: '#1a1a18' }}>{val}</div>
                  {sub && <div style={{ fontSize: 10, color: '#888780' }}>{sub}</div>}
                </div>
              </div>
            ))}

            <div style={{ height: 0.5, background: 'rgba(0,0,0,0.06)', margin: '10px 0' }} />
            <div style={{ fontSize: 10, color: '#888780', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Deal info</div>
            {[
              { Icon: Users,      val: `${contact.vas} VAs requested`, sub: 'Customer support roles' },
              { Icon: DollarSign, val: contact.budget, sub: 'Budget confirmed' },
            ].map(({ Icon, val, sub }) => (
              <div key={val} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <Icon size={13} color="#B4B2A9" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 12, color: '#1a1a18' }}>{val}</div>
                  <div style={{ fontSize: 10, color: '#888780' }}>{sub}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontSize: 10, color: '#888780', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>Deal stage</div>
            {stages.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', position: 'relative' }}>
                {i < stages.length - 1 && (
                  <div style={{ position: 'absolute', left: 9, top: 24, width: 1.5, height: 14, background: 'rgba(0,0,0,0.08)' }} />
                )}
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
                  background: i < currentStageIdx ? 'var(--purple-600)' : i === currentStageIdx ? 'var(--purple-50)' : '#F5F4F1',
                  border: i === currentStageIdx ? '2px solid var(--purple-600)' : '0.5px solid rgba(0,0,0,0.1)',
                  color: i < currentStageIdx ? '#fff' : i === currentStageIdx ? 'var(--purple-600)' : '#B4B2A9',
                }}>
                  {i < currentStageIdx ? <Check size={9} /> : i + 1}
                </div>
                <span style={{
                  fontSize: 12,
                  color: i === currentStageIdx ? 'var(--purple-600)' : i < currentStageIdx ? '#1a1a18' : '#B4B2A9',
                  fontWeight: i === currentStageIdx ? 600 : 400,
                }}>{s}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <SectionTitle action="+ Add">Reminders</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {localReminders.map(r => {
                const us = urgencyStyle[r.done ? 'done' : r.urgency]
                return (
                  <div key={r.id} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8, padding: '9px 10px',
                    borderRadius: 10, background: us.bg, border: `0.5px solid ${us.border}`,
                    opacity: r.done ? 0.5 : 1,
                  }}>
                    <button onClick={() => toggleReminder(r.id)} style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                      border: `0.5px solid ${r.done ? 'var(--green-400)' : 'rgba(0,0,0,0.15)'}`,
                      background: r.done ? 'var(--green-400)' : '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                      {r.done && <Check size={10} color="#fff" />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: us.titleColor }}>{r.title}</div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{r.sub}</div>
                      <div style={{ fontSize: 10, marginTop: 3, color: us.timeColor }}>{r.when}</div>
                    </div>
                    <Tag color={typeColors[r.type] || 'gray'}>{r.type}</Tag>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <SectionTitle action="+ Add note">Notes</SectionTitle>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10, background: '#F5F4F1', borderRadius: 10, padding: 10 }}>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Add a note, call summary, or update..."
                rows={2}
                style={{
                  flex: 1, border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 8, padding: '7px 10px',
                  fontSize: 12, fontFamily: 'var(--font-sans)', resize: 'none', background: '#fff', color: '#1a1a18', outline: 'none',
                }}
              />
              <Button variant="primary" style={{ alignSelf: 'flex-end', borderRadius: 10 }}>Save</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {notes.map(n => (
                <div key={n.id} style={{
                  padding: '10px 12px', borderRadius: 10, background: '#F5F4F1',
                  borderLeft: `3px solid ${n.important ? 'var(--red-400)' : n.positive ? 'var(--teal-400)' : 'var(--purple-600)'}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{n.author}</span>
                    <span style={{ fontSize: 10, color: '#888780' }}>{n.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#444441', lineHeight: 1.5 }}>{n.text}</div>
                  <Tag color={n.type === 'Call summary' ? 'blue' : n.type === 'First call' ? 'teal' : 'purple'} style={{ marginTop: 5 }}>{n.type}</Tag>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionTitle>Activity timeline</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {timelineItems.map((item, i) => {
                const Icon = item.icon
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < timelineItems.length - 1 ? '0.5px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={12} />
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18' }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{item.sub}</div>
                      <div style={{ fontSize: 10, color: '#B4B2A9', marginTop: 2 }}>{item.time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
