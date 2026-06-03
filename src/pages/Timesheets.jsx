import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, Wallet, Check, Eye, Send, Download } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

const statusConfig = {
  approved: { label: 'Approved',  color: 'green' },
  review:   { label: 'Review OT', color: 'amber' },
  missing:  { label: 'Missing',   color: 'red'   },
}

export default function Timesheets() {
  const [rows, setRows] = useState([])

  useEffect(() => { fetchTimesheets() }, [])

  async function fetchTimesheets() {
    const { data } = await supabase.from('timesheets').select('*').order('created_at', { ascending: false })
    if (data) setRows(data)
  }

  async function approve(id) {
    await supabase.from('timesheets').update({ status: 'approved' }).eq('id', id)
    setRows(r => r.map(row => row.id === id ? { ...row, status: 'approved' } : row))
  }

  async function flag(id) {
    await supabase.from('timesheets').update({ status: 'missing' }).eq('id', id)
    setRows(r => r.map(row => row.id === id ? { ...row, status: 'missing' } : row))
  }

  const ready   = rows.filter(r => r.status === 'approved').length
  const review  = rows.filter(r => r.status === 'review').length
  const missing = rows.filter(r => r.status === 'missing').length

  return (
    <div>
      <PageHeader title="Timesheets & invoices" subtitle="Week of May 26 - Jun 1 · Submit payroll by Wed Jun 4, 5:00pm DR time">
        <Button icon={Download}>Export all</Button>
        <Button variant="primary" icon={Send}>Send missing links</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }} className="animate-fade-up delay-1">
        <MetricCard icon={Clock}         label="Timesheets in"  value={`${rows.filter(r=>r.status!=='missing').length} / ${rows.length}`} sub="submitted" />
        <MetricCard icon={Check}         label="Approved"       value={ready}   sub="Ready for payroll"  subColor="var(--green-600)" />
        <MetricCard icon={AlertTriangle} label="Needs review"   value={review}  sub="Flagged hours"       subColor="var(--amber-400)" />
        <MetricCard icon={Wallet}        label="Missing"        value={missing} sub="Not yet submitted"   subColor="var(--red-600)"   />
      </div>

      <div className="animate-fade-up delay-1" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--amber-50)', border: '0.5px solid #EF9F27',
        borderRadius: 12, padding: '10px 16px', marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <AlertTriangle size={16} color="var(--amber-600)" />
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber-600)' }}>Payroll deadline: Wednesday Jun 4 at 5:00pm DR time. </span>
            <span style={{ fontSize: 12, color: '#633806' }}>Approve all timesheets before then - VA employees need funds by Friday Jun 6.</span>
          </div>
        </div>
        <button style={{
          background: 'var(--amber-600)', color: '#fff', border: 'none',
          borderRadius: 10, padding: '7px 16px', fontSize: 12, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
        }}>Approve all and run</button>
      </div><Card className="animate-fade-up delay-2" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '32px 1fr 90px 70px 80px 90px 110px 120px',
          gap: 8, padding: '8px 16px', background: '#F5F4F1',
          borderBottom: '0.5px solid rgba(0,0,0,0.06)',
        }}>
          {['', 'VA Employee', 'Client', 'Hours', 'OT', 'Pay amount', 'Status', 'Actions'].map(h => (
            <div key={h} style={{ fontSize: 10, color: '#888780', textTransform: 'uppercase', letterSpacing: 0.4 }}>{h}</div>
          ))}
        </div>
        {rows.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No timesheets yet.</div>
        ) : rows.map((row, i) => (
          <div key={row.id} style={{
            display: 'grid', gridTemplateColumns: '32px 1fr 90px 70px 80px 90px 110px 120px',
            gap: 8, padding: '10px 16px', alignItems: 'center',
            borderBottom: i < rows.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none',
            background: i % 2 === 0 ? '#fff' : '#FAFAF9',
          }}>
            <Avatar initials={row.va_initials} size={28} colorIndex={i % 6} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a18' }}>{row.va_name}</div>
              <div style={{ fontSize: 10, color: '#888780' }}>{row.country}</div>
            </div>
            <div style={{ fontSize: 11, color: '#5F5E5A' }}>-</div>
            <div style={{ fontSize: 12, color: '#1a1a18' }}>{row.hours}h</div>
            <div style={{ fontSize: 12, color: row.overtime > 0 ? 'var(--amber-400)' : '#B4B2A9', fontWeight: row.overtime > 0 ? 600 : 400 }}>
              {row.overtime > 0 ? `+${row.overtime}h OT` : '-'}
            </div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18' }}>{row.pay}</div>
            <div><Tag color={statusConfig[row.status]?.color ?? 'green'}>{statusConfig[row.status]?.label ?? row.status}</Tag></div>
            <div style={{ display: 'flex', gap: 5 }}>
              {row.status === 'review' ? (
                <>
                  <button onClick={() => approve(row.id)} style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 8, cursor: 'pointer', border: 'none',
                    background: 'var(--green-50)', color: 'var(--green-600)', fontFamily: 'var(--font-sans)', fontWeight: 500,
                  }}>Approve</button>
                  <button onClick={() => flag(row.id)} style={{
                    fontSize: 11, padding: '3px 9px', borderRadius: 8, cursor: 'pointer', border: 'none',
                    background: 'var(--amber-50)', color: 'var(--amber-600)', fontFamily: 'var(--font-sans)',
                  }}>Flag</button>
                </>
              ) : row.status === 'missing' ? (
                <button style={{
                  fontSize: 11, padding: '3px 9px', borderRadius: 8, cursor: 'pointer', border: 'none',
                  background: 'var(--red-50)', color: 'var(--red-600)', fontFamily: 'var(--font-sans)',
                }}>Resend link</button>
              ) : (
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 11, padding: '3px 9px', borderRadius: 8, cursor: 'pointer',
                  border: '0.5px solid rgba(0,0,0,0.08)', background: '#F5F4F1',
                  color: '#5F5E5A', fontFamily: 'var(--font-sans)',
                }}>
                  <Eye size={11} /> View
                </button>
              )}
            </div>
          </div>
        ))}
      </Card>

      <div className="animate-fade-up delay-3" style={{ marginTop: 14 }}>
        <button style={{
          width: '100%', padding: '13px', borderRadius: 14, border: 'none',
          background: 'var(--purple-600)', color: '#fff', fontSize: 14, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-sans)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Check size={16} /> Approve {ready} ready timesheets and run payroll
        </button>
        <div style={{ fontSize: 11, color: '#888780', textAlign: 'center', marginTop: 5 }}>
          {review + missing} workers need attention · Funds will arrive Friday Jun 6
        </div>
      </div>
    </div>
  )
}