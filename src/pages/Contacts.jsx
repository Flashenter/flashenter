import { useState } from 'react'
import { Mail, Phone, Edit, Users, Flame, Building, Clock, Plus, Search } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader, SectionTitle } from '../components/ui'
import { contacts } from '../data'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
  hot:    { label: 'Hot',    color: 'red'    },
  warm:   { label: 'Warm',   color: 'amber'  },
  new:    { label: 'New',    color: 'purple' },
  client: { label: 'Client', color: 'green'  },
}

const stageColors = {
  'Active client':   '#639922',
  'Proposal sent':   '#534AB7',
  'Qualified':       '#BA7517',
  'New inquiry':     '#888780',
  'Demo scheduled':  '#185FA5',
}

const filters = ['All', '🇩🇴 DR', '🇿🇦 South Africa', '🇵🇭 Philippines', '🇨🇴 Colombia', '🇵🇦 Panama', 'Hot leads', 'Active clients']

export default function Contacts() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = contacts.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.company.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilter === 'Hot leads') return c.status === 'hot'
    if (activeFilter === 'Active clients') return c.status === 'client'
    return true
  })

  return (
    <div>
      <PageHeader title="Contacts & leads" subtitle={`${contacts.length} contacts · ${contacts.filter(c=>c.status==='hot').length} hot leads · 5 markets`}>
        <Button icon={Plus} variant="primary">Add contact</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }} className="animate-fade-up delay-1">
        <MetricCard icon={Users} label="All contacts" value="48" sub="+6 this month" />
        <MetricCard icon={Flame} label="Hot leads" value="7" sub="Need follow-up" subColor="var(--red-600)" />
        <MetricCard icon={Building} label="Active clients" value="24" sub="Paying this week" subColor="var(--green-600)" />
        <MetricCard icon={Clock} label="Avg response time" value="2.4h" sub="Last 7 days" />
      </div>

      <div style={{ marginBottom: 12 }} className="animate-fade-up delay-1">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)',
          borderRadius: 40, padding: '8px 14px', marginBottom: 10,
        }}>
          <Search size={14} color="#888780" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, company, country..."
            style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', flex: 1, fontFamily: 'var(--font-sans)', color: '#1a1a18' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                fontSize: 11, padding: '4px 12px', borderRadius: 20, cursor: 'pointer', border: 'none',
                background: activeFilter === f ? 'var(--purple-50)' : '#fff',
                color: activeFilter === f ? 'var(--purple-600)' : '#5F5E5A',
                border: activeFilter === f ? '0.5px solid var(--purple-200)' : '0.5px solid rgba(0,0,0,0.08)',
                fontWeight: activeFilter === f ? 600 : 400,
                fontFamily: 'var(--font-sans)',
              }}
            >{f}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }} className="animate-fade-up delay-2">
        {filtered.map(c => {
          const sc = statusConfig[c.status]
          return (
            <Card key={c.id} style={{ cursor: 'pointer' }}
              className="animate-fade-up"
              onClick={() => navigate(`/contacts/${c.id}`)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <Avatar initials={c.initials} size={38} colorIndex={c.colorIndex} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18' }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>{c.title} · {c.company}</div>
                  </div>
                </div>
                <Tag color={sc.color}>{sc.label}</Tag>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5F5E5A' }}>
                  <span>{c.flag}</span> {c.country}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5F5E5A' }}>
                  <Mail size={11} color="#B4B2A9" /> {c.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#5F5E5A' }}>
                  <Users size={11} color="#B4B2A9" />
                  {c.vas} VA{c.vas !== 1 ? 's' : ''} · {c.budget}
                </div>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 10, borderTop: '0.5px solid rgba(0,0,0,0.06)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888780' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: stageColors[c.stage] || '#888780', display: 'inline-block' }} />
                  {c.stage}
                </div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {[Mail, Phone, Edit].map((Icon, i) => (
                    <div key={i} onClick={e => e.stopPropagation()} style={{
                      width: 26, height: 26, borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.08)',
                      background: '#F5F4F1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>
                      <Icon size={12} color="#888780" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
