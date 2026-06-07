import { useState, useEffect } from 'react'
import { DollarSign, Clock, AlertTriangle, Check, Play, Plus } from 'lucide-react'
import { MetricCard, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

const cycle = [
  { label: 'Mon-Sun', sub: 'Hours locked', done: true },
  { label: 'Monday', sub: 'Calculated', done: true },
  { label: 'Tuesday', sub: 'You are here', active: true },
  { label: 'Wednesday', sub: 'Submit 5pm', todo: true },
  { label: 'Thu-Fri', sub: 'Processing', todo: true },
  { label: 'Friday', sub: 'Payday!', payday: true },
]

export default function Payroll() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newP, setNewP] = useState({ va_name: '', country: '', flag: '', hours: 0, overtime: 0, amount: '', currency: 'USD', via: 'Wise', status: 'pending' })

  useEffect(() => { fetchPayroll() }, [])

  async function fetchPayroll() {
    setLoading(true)
    const { data, error } = await supabase.from('payroll').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    setRecords(data || [])
    setLoading(false)
  }

  async function addPayroll() {
    if (!newP.va_name) return alert('Please enter VA name')
    const { error } = await supabase.from('payroll').insert([newP])
    if (error) { alert('Error: ' + error.message) } else { setShowAdd(false); fetchPayroll() }
  }

  async function updateStatus(id, status) {
    await supabase.from('payroll').update({ status }).eq('id', id)
    fetchPayroll()
  }

  async function runPayroll() {
    const approved = records.filter(r => r.status === 'approved')
    for (const r of approved) {
      await supabase.from('payroll').update({ status: 'paid' }).eq('id', r.id)
    }
    fetchPayroll()
  }

  const ready = records.filter(r => r.status === 'approved').length
  const total = records.reduce((sum, r) => {
    const num = parseFloat(r.amount?.replace(/[^0-9.]/g, '') || 0)
    return sum + num
  }, 0)

  return (
    <div>
      <PageHeader title="Weekly payroll run" subtitle="Pay week: Mon-Sun · Due in accounts: Friday">
        <Button icon={Plus} variant="primary" onClick={() => setShowAdd(true)}>Add record</Button>
      </PageHeader>

      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New payroll record</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'va_name', label: 'VA Full name *' },
              { key: 'country', label: 'Country' },
              { key: 'flag', label: 'Flag emoji' },
              { key: 'hours', label: 'Hours', type: 'number' },
              { key: 'overtime', label: 'Overtime', type: 'number' },
              { key: 'amount', label: 'Amount (e.g. $480)' },
              { key: 'via', label: 'Via (e.g. Wise)' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input type={f.type || 'text'} value={newP[f.key]}
                  onChange={e => setNewP(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Status</div>
              <select value={newP.status} onChange={e => setNewP(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addPayroll} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        <MetricCard icon={DollarSign} label="Total payout" value={'$' + total.toLocaleString()} sub="This pay period" />
        <MetricCard icon={Check} label="Approved" value={ready} sub="Ready to pay" subColor="var(--green-600)" />
        <MetricCard icon={AlertTriangle} label="Pending" value={records.filter(r => r.status === 'pending').length} sub="Needs review" subColor="var(--amber-400)" />
        <MetricCard icon={Clock} label="Paid" value={records.filter(r => r.status === 'paid').length} sub="Completed" subColor="#185FA5" />
      </div>

      <div style={{ background: '#F5F4F1', borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10 }}>Pay cycle</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
          {cycle.map((c, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', margin: '0 auto 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, background: c.payday ? '#534AB7' : c.done ? '#534AB7' : c.active ? '#EEEDFE' : '#fff', border: c.active ? '2px solid #534AB7' : '0.5px solid rgba(0,0,0,0.08)', color: c.done || c.payday ? '#fff' : c.active ? '#534AB7' : '#B4B2A9' }}>
                {c.done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 10, fontWeight: 600, color: c.active ? '#534AB7' : '#1a1a18' }}>{c.label}</div>
              <div style={{ fontSize: 9, color: '#888780' }}>{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
      ) : records.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💰</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No payroll records yet</div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Add first record</button>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px 100px 100px 120px', gap: 8, padding: '8px 16px', background: '#F5F4F1', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
              {['VA Employee', 'Hours', 'OT', 'Amount', 'Via', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 10, color: '#888780', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {records.map((row, i) => (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px 100px 100px 120px', gap: 8, padding: '10px 16px', alignItems: 'center', borderBottom: i < records.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{row.flag} {row.va_name}</div>
                  <div style={{ fontSize: 10, color: '#888780' }}>{row.country}</div>
                </div>
                <div style={{ fontSize: 12 }}>{row.hours}h</div>
                <div style={{ fontSize: 12, color: row.overtime > 0 ? 'var(--amber-400)' : '#B4B2A9' }}>{row.overtime > 0 ? '+' + row.overtime + 'h' : '-'}</div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{row.amount}</div>
                <div style={{ fontSize: 11, color: '#888780' }}>{row.via}</div>
                <div>
                  {row.status === 'pending' ? (
                    <button onClick={() => updateStatus(row.id, 'approved')} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', border: 'none', background: '#EAF3DE', color: '#3B6D11', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>Approve</button>
                  ) : (
                    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: row.status === 'paid' ? '#EAF3DE' : row.status === 'approved' ? '#EEEDFE' : '#FAEEDA', color: row.status === 'paid' ? '#3B6D11' : row.status === 'approved' ? '#534AB7' : '#854F0B' }}>{row.status}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {ready > 0 && (
            <button onClick={runPayroll} style={{ width: '100%', padding: '13px', borderRadius: 14, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Play size={14} /> Run payroll for {ready} approved workers
            </button>
          )}
        </>
      )}
    </div>
  )
}