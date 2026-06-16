import { useNavigate } from 'react-router-dom'
import { TrendingUp, Briefcase, Users, Clock, ArrowUpRight, Bell } from 'lucide-react'
import { MetricCard, Card, SectionTitle, PageHeader, Tag, Avatar, Button } from '../components/ui'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [reminders, setReminders] = useState([])
  const [timesheets, setTimesheets] = useState([])

  useEffect(() => {
    supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5).then(({ data }) => setContacts(data || []))
    supabase.from('reminders').select('*').eq('done', false).limit(4).then(({ data }) => setReminders(data || []))
    supabase.from('timesheets').select('*').eq('status', 'pending').limit(5).then(({ data }) => setTimesheets(data || []))
  }, [])

  const urgencyStyle = {
    overdue:  { bg: '#FCEBEB', border: '#F09595', titleColor: '#791F1F', timeColor: '#A32D2D' },
    today:    { bg: '#FEF3E2', border: '#EF9F27', titleColor: '#633806', timeColor: '#854F0B' },
    upcoming: { bg: '#fff',    border: 'rgba(0,0,0,0.08)', titleColor: '#1a1a18', timeColor: '#888780' },
  }

  return (
    <div>
      <PageHeader
        title={"Good morning, " + (user?.name?.split(' ')[0] || 'there')}
        subtitle="Tuesday Jun 3 · 7 active markets · Payroll due Wednesday 5:00pm">
        <Button variant="primary" icon={ArrowUpRight} onClick={() => navigate('/contacts')}>New client</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        <MetricCard icon={TrendingUp} label="Revenue (MRR)" value="$0" sub="Add clients to track" />
        <MetricCard icon={Briefcase} label="Open deals" value={contacts.length} sub="Total contacts" />
        <MetricCard icon={Users} label="Active contacts" value={contacts.filter(c => c.status === 'client').length} sub="Paying clients" subColor="var(--green-600)" />
        <MetricCard icon={Clock} label="Timesheets in" value={`${timesheets.length}/0`} sub="Pending approval" subColor={timesheets.length > 0 ? 'var(--amber-400)' : undefined} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <SectionTitle action={{ label: 'View all →', onClick: () => navigate('/contacts') }}>Active deals</SectionTitle>
          {contacts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#888780', fontSize: 13 }}>
              No contacts yet — <span style={{ color: '#534AB7', cursor: 'pointer' }} onClick={() => navigate('/contacts')}>add your first client</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {contacts.map((c, i) => (
                <div key={c.id} onClick={() => navigate(`/contacts/${c.id}`)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 10, background: '#F5F4F1', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar initials={c.name?.slice(0,2).toUpperCase()} size={30} colorIndex={i % 6} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 10, color: '#888780' }}>{c.company}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{c.budget}</div>
                    <Tag color={c.status === 'client' ? 'green' : c.status === 'hot' ? 'red' : 'purple'}>{c.stage || c.status}</Tag>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle action={{ label: 'All →', onClick: () => navigate('/contacts') }}>Reminders today</SectionTitle>
          {reminders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px 0', color: '#888780', fontSize: 13 }}>No reminders — go to a client and add one</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {reminders.map(r => {
                const us = urgencyStyle[r.urgency] || urgencyStyle.upcoming
                return (
                  <div key={r.id} style={{ padding: '9px 10px', borderRadius: 10, background: us.bg, border: `0.5px solid ${us.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: us.titleColor }}>{r.title}</div>
                    {r.sub && <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{r.sub}</div>}
                    {r.when_text && <div style={{ fontSize: 10, color: us.timeColor, marginTop: 3 }}>{r.when_text}</div>}
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <SectionTitle>Market performance</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
          {[
            { flag: '🇩🇴', name: 'Dom. Republic', clients: contacts.filter(c => c.country?.includes('Dominican') || c.country?.includes('DR')).length },
            { flag: '🇿🇦', name: 'South Africa', clients: contacts.filter(c => c.country?.includes('South Africa')).length },
            { flag: '🇵🇭', name: 'Philippines', clients: contacts.filter(c => c.country?.includes('Philippines')).length },
            { flag: '🇨🇴', name: 'Colombia', clients: contacts.filter(c => c.country?.includes('Colombia')).length },
            { flag: '🇵🇦', name: 'Panama', clients: contacts.filter(c => c.country?.includes('Panama')).length },
          ].map(m => (
            <div key={m.name} style={{ padding: '12px', background: '#F5F4F1', borderRadius: 12 }}>
              <div style={{ fontSize: 22, marginBottom: 5 }}>{m.flag}</div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{m.name}</div>
              <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{m.clients} clients</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}