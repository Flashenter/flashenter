import { TrendingUp, Briefcase, Users, Clock, ArrowUpRight } from 'lucide-react'
import { MetricCard, Card, SectionTitle, PageHeader, Tag, Avatar, Button } from '../components/ui'
import { contacts, timesheets, reminders } from '../data'

const dotColor = { overdue: 'var(--red-400)', today: 'var(--amber-400)', upcoming: 'var(--purple-600)', done: '#B4B2A9' }

export default function Dashboard() {
  const hotReminders = reminders.filter(r => !r.done).slice(0, 4)
  const activeDeals = contacts.filter(c => c.status !== 'new').slice(0, 4)

  return (
    <div>
      <PageHeader
        title="Good morning, James"
        subtitle="Tuesday, Jun 3 · 7 active markets · Payroll due Wednesday 5:00pm"
      >
        <Button variant="primary" icon={ArrowUpRight}>New client</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}
        className="animate-fade-up delay-1">
        <MetricCard icon={TrendingUp} label="Revenue (MTD)" value="$284K" sub="↑ +12% vs last month" subColor="var(--green-600)" />
        <MetricCard icon={Briefcase} label="Open deals" value="47" sub="↑ +8 this week" subColor="var(--green-600)" />
        <MetricCard icon={Users} label="Active contacts" value="1,204" sub="↑ +34 new leads" subColor="var(--green-600)" />
        <MetricCard icon={Clock} label="Timesheets in" value="6/8" sub="2 not yet submitted" subColor="var(--amber-400)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 12 }} className="animate-fade-up delay-2">
        <Card>
          <SectionTitle action="View all →">Active deals</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {activeDeals.map(c => (
              <div key={c.id} style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 10px', background: '#F5F4F1', borderRadius: 10,
              }}>
                <span style={{ fontSize: 15 }}>{c.flag}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18' }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: '#888780' }}>{c.company} · {c.vas} VAs</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18' }}>{c.budget}</div>
                <Tag color={c.status === 'client' ? 'green' : c.status === 'hot' ? 'red' : 'purple'}>
                  {c.stage.split(' ')[0]}
                </Tag>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle action="All →">Reminders today</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {hotReminders.map(r => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '8px 10px', background: '#F5F4F1', borderRadius: 10,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor[r.urgency], flexShrink: 0, marginTop: 4 }} />
                <div style={{ fontSize: 12, color: '#1a1a18', flex: 1, lineHeight: 1.4 }}>{r.title}</div>
                <div style={{ fontSize: 10, color: '#888780', whiteSpace: 'nowrap' }}>
                  {r.urgency === 'overdue' ? 'Overdue' : r.urgency === 'today' ? '4:00pm' : r.when.split(',')[0]}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 12 }} className="animate-fade-up delay-3">
        <Card>
          <SectionTitle action="View all markets →">Market performance</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10 }}>
            {[
              { flag: '🇩🇴', name: 'Dom. Republic', pct: 88, clients: 8 },
              { flag: '🇿🇦', name: 'South Africa', pct: 72, clients: 5 },
              { flag: '🇵🇭', name: 'Philippines', pct: 65, clients: 6 },
              { flag: '🇨🇴', name: 'Colombia', pct: 58, clients: 4 },
              { flag: '🇵🇦', name: 'Panama', pct: 44, clients: 3 },
            ].map(m => (
              <div key={m.name} style={{ padding: '10px 12px', background: '#F5F4F1', borderRadius: 10 }}>
                <div style={{ fontSize: 18, marginBottom: 5 }}>{m.flag}</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: '#1a1a18', marginBottom: 2 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: '#888780', marginBottom: 6 }}>{m.clients} clients</div>
                <div style={{ height: 4, background: '#e8e7e4', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${m.pct}%`, background: 'var(--purple-600)', borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 10, color: 'var(--purple-600)', marginTop: 3, fontWeight: 500 }}>{m.pct}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
