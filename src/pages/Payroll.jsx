import { useState, useEffect } from 'react'
import { DollarSign, Clock, AlertTriangle, Check, Play } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader, SectionTitle } from '../components/ui'
import { supabase } from '../lib/supabase'

const cycle = [
  { label: 'Mon-Sun',   sub: 'May 26-Jun 1', sub2: 'Hours locked', done: true },
  { label: 'Monday',    sub: 'Jun 2',        sub2: 'Calculated',   done: true },
  { label: 'Tuesday',   sub: 'Jun 3',        sub2: 'You are here', active: true },
  { label: 'Wednesday', sub: 'Jun 4',        sub2: 'Submit 5pm',   todo: true },
  { label: 'Thu-Fri',   sub: 'Jun 5-6',      sub2: 'Processing',   todo: true },
  { label: 'Friday',    sub: 'Jun 6',        sub2: 'Payday!',      payday: true },
]

const payrollByMarket = [
  { flag: '🇩🇴', name: 'Dom. Republic', employees: 8,  amount: '$18,400', status: 'pending',    via: 'Local bank' },
  { flag: '🇿🇦', name: 'South Africa',  employees: 6,  amount: '$22,100', status: 'paid',       via: 'Wise'       },
  { flag: '🇵🇭', name: 'Philippines',   employees: 5,  amount: '$14,700', status: 'processing', via: 'Payoneer'   },
  { flag: '🇨🇴', name: 'Colombia',      employees: 7,  amount: '$21,600', status: 'pending',    via: 'Deel'       },
  { flag: '🇵🇦', name: 'Panama',        employees: 4,  amount: '$17,400', status: 'paid',       via: 'Wise'       },
]

const statusColors = { paid: 'green', pending: 'amber', processing: 'purple' }

export default function Payroll() {
  const [timesheets, setTimesheets] = useState([])
  const [running, setRunning] = useState(false)  // NEW: tracks if payroll is being processed

  useEffect(() => { fetchTimesheets() }, [])

  async function fetchTimesheets() {
    const { data } = await supabase.from('timesheets').select('*').order('created_at', { ascending: false })
    if (data) setTimesheets(data)
  }

  // NEW: This function runs when you click the button
  // It finds all approved timesheets and marks them as 'paid' in Supabase
  async function runPayroll() {
    setRunning(true) // disables the button so you can't click twice

    const { error } = await supabase
      .from('timesheets')
      .update({ status: 'paid' })       // change status to 'paid'
      .eq('status', 'approved')         // but only for approved timesheets

    if (error) {
      alert('Something went wrong: ' + error.message)
    } else {
      alert('Payroll approved! Workers will be paid by Friday Jun 6.')
      fetchTimesheets() // refresh the list so the screen updates
    }

    setRunning(false) // re-enable the button
  }

  const ready   = timesheets.filter(r => r.status === 'approved').length
  const flagged = timesheets.filter(r => r.status !== 'approved').length

  return (
    <div>
      <PageHeader title="Weekly payroll run" subtitle="Pay week: May 26-Jun 1 · Due in accounts: Friday Jun 6, 2026">
        <Button icon={Check}>Export</Button>
        <Button icon={Clock}>Past runs</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }} className="animate-fade-up delay-1">
        <MetricCard icon={DollarSign}    label="Total payout (USD)" value="$94.2K"  sub="This pay period" />
        <MetricCard icon={Check}         label="Ready to pay"       value={ready}   sub="Workers approved"     subColor="var(--green-600)" />
        <MetricCard icon={AlertTriangle} label="Needs attention"    value={flagged} sub="OT review + missing"  subColor="var(--amber-400)" />
        <MetricCard icon={Clock}         label="Submit deadline"    value="Wed 5pm" sub="Jun 4 · DR time (AST)" subColor="var(--amber-400)" />
      </div>

      <Card className="animate-fade-up delay-1" style={{ marginBottom: 14 }}>
        <SectionTitle>Pay cycle - week of May 26</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
          {cycle.map((c, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%', margin: '0 auto 6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11,
                background: c.payday ? 'var(--purple-600)' : c.done ? 'var(--purple-600)' : c.active ? 'var(--purple-50)' : '#F5F4F1',
                border: c.active ? '2px solid var(--purple-600)' : '0.5px solid rgba(0,0,0,0.08)',
                color: c.done || c.payday ? '#fff' : c.active ? 'var(--purple-600)' : '#B4B2A9',
              }}>
                {c.done ? <Check size={12} /> : i + 1}
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: c.active ? 'var(--purple-600)' : '#1a1a18' }}>{c.label}</div>
              <div style={{ fontSize: 10, color: '#888780', marginTop: 1 }}>{c.sub}</div>
              <div style={{
                fontSize: 9, marginTop: 3, padding: '1px 6px', borderRadius: 20, display: 'inline-block',
                background: c.done ? 'var(--green-50)' : c.active ? 'var(--purple-50)' : c.payday ? 'var(--purple-600)' : '#F5F4F1',
                color: c.done ? 'var(--green-600)' : c.active ? 'var(--purple-600)' : c.payday ? '#fff' : '#888780',
              }}>{c.sub2}</div>
            </div>
          ))}
        </div>
      </Card><div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }} className="animate-fade-up delay-2">
        <Card>
          <SectionTitle action="View all">Workers this week</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {timesheets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: 13 }}>No data yet.</div>
            ) : timesheets.map((row, i) => (
              <div key={row.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', background: '#F5F4F1', borderRadius: 10,
              }}>
                <Avatar initials={row.va_initials} size={30} colorIndex={i % 6} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18' }}>{row.va_name}</div>
                  <div style={{ fontSize: 10, color: '#888780' }}>{row.country} · {row.hours}h{row.overtime > 0 ? ` +${row.overtime}h OT` : ''}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{row.pay}</div>
                <div style={{ fontSize: 10, color: '#888780' }}>{row.via}</div>
                <Tag color={statusConfig(row.status)}>{labelFor(row.status)}</Tag>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <SectionTitle action="Export">Payroll by market</SectionTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {payrollByMarket.map(m => (
                <div key={m.name} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 10px', background: '#F5F4F1', borderRadius: 10,
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
                  }}>{m.flag}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: '#888780' }}>{m.employees} employees · via {m.via}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.amount}</div>
                    <Tag color={statusColors[m.status]}>{m.status.charAt(0).toUpperCase() + m.status.slice(1)}</Tag>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* FIXED: added onClick={runPayroll} and disabled while running */}
          <button
            onClick={runPayroll}
            disabled={running || ready === 0}
            style={{
              width: '100%', padding: '13px', borderRadius: 14, border: 'none',
              background: running || ready === 0 ? '#ccc' : 'var(--purple-600)',
              color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: running || ready === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
            <Play size={14} />
            {running ? 'Processing...' : `Approve and run payroll for ${ready} ready workers`}
          </button>
          <div style={{ fontSize: 11, color: '#888780', textAlign: 'center', marginTop: -8 }}>
            Funds arrive Friday Jun 6 · Invoices auto-sent to clients
          </div>
        </div>
      </div>
    </div>
  )
}

function statusConfig(s) {
  return s === 'approved' ? 'green' : s === 'review' ? 'amber' : 'red'
}
function labelFor(s) {
  return s === 'approved' ? 'Ready' : s === 'review' ? 'Review' : 'Missing'
}
