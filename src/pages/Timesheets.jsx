import { useState, useEffect } from 'react'
import { Clock, AlertTriangle, Wallet, Check, Plus } from 'lucide-react'
import { MetricCard, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

export default function Timesheets() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newTS, setNewTS] = useState({
    va_name: '', country: '', hours: 0, overtime: 0,
    pay: '', currency: 'USD', via: 'Wise', status: 'pending', notes: ''
  })

  useEffect(() => { fetchTimesheets() }, [])

  async function fetchTimesheets() {
    setLoading(true)
    const { data, error } = await supabase.from('timesheets').select('*').order('created_at', { ascending: false })
    if (error) console.error(error)
    setRows(data || [])
    setLoading(false)
  }

  async function addTimesheet() {
    if (!newTS.va_name) return alert('Please enter VA name')
    const initials = newTS.va_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const { error } = await supabase.from('timesheets').insert([{ ...newTS, va_initials: initials }])
    if (error) { alert('Error: ' + error.message) } else { setShowAdd(false); fetchTimesheets() }
  }

  async function updateStatus(id, status) {
    const { error } = await supabase.from('timesheets').update({ status }).eq('id', id)
    if (error) { alert('Error: ' + error.message) } else { fetchTimesheets() }
  }

  async function approveAll() {
    const pending = rows.filter(r => r.status === 'pending' || r.status === 'review')
    for (const r of pending) {
      await supabase.from('timesheets').update({ status: 'approved' }).eq('id', r.id)
    }
    fetchTimesheets()
  }

  const ready = rows.filter(r => r.status === 'approved').length

  return (
    <div>
      <PageHeader title="Timesheets" subtitle="Submit payroll by Wednesday 5:00pm DR time">
        <Button icon={Plus} variant="primary" onClick={() => setShowAdd(true)}>Add timesheet</Button>
      </PageHeader>

      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New timesheet entry</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'va_name', label: 'VA Full name *' },
              { key: 'country', label: 'Country flag (e.g. 🇵🇭)' },
              { key: 'hours', label: 'Regular hours', type: 'number' },
              { key: 'overtime', label: 'Overtime hours', type: 'number' },
              { key: 'pay', label: 'Pay amount (e.g. $480)' },
              { key: 'via', label: 'Payment via (e.g. Wise)' },
              { key: 'notes', label: 'Notes' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input type={f.type || 'text'} value={newTS[f.key]}
                  onChange={e => setNewTS(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Status</div>
              <select value={newTS.status} onChange={e => setNewTS(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="review">Review OT</option>
                <option value="missing">Missing</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addTimesheet} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
        <MetricCard icon={Clock} label="Total" value={rows.length} sub="Submitted" />
        <MetricCard icon={Check} label="Approved" value={ready} sub="Ready for payroll" subColor="var(--green-600)" />
        <MetricCard icon={AlertTriangle} label="Review" value={rows.filter(r => r.status === 'review').length} sub="Flagged" subColor="var(--amber-400)" />
        <MetricCard icon={Wallet} label="Missing" value={rows.filter(r => r.status === 'missing').length} sub="Not submitted" subColor="var(--red-600)" />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🕐</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No timesheets yet</div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Add first timesheet</button>
        </div>
      ) : (
        <>
          <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 60px 100px 90px 160px', gap: 8, padding: '8px 16px', background: '#F5F4F1', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
              {['VA Employee', 'Hours', 'OT', 'Pay', 'Via', 'Actions'].map(h => (
                <div key={h} style={{ fontSize: 10, color: '#888780', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {rows.map((row, i) => (
              <div key={row.id} style={{ display: 'grid', gridTemplateColumns: '1fr 70px 60px 100px 90px 160px', gap: 8, padding: '10px 16px', alignItems: 'center', borderBottom: i < rows.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none', background: i % 2 === 0 ? '#fff' : '#FAFAF9' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{row.va_name}</div>
                  <div style={{ fontSize: 10, color: '#888780' }}>{row.country}</div>
                </div>
                <div style={{ fontSize: 12 }}>{row.hours}h</div>
                <div style={{ fontSize: 12, color: row.overtime > 0 ? 'var(--amber-400)' : '#B4B2A9' }}>{row.overtime > 0 ? '+' + row.overtime + 'h' : '-'}</div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{row.pay}</div>
                <div style={{ fontSize: 11, color: '#888780' }}>{row.via}</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  {row.status === 'pending' || row.status === 'review' ? (
                    <>
                      <button
                        onClick={() => updateStatus(row.id, 'approved')}
                        style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', border: 'none', background: '#EAF3DE', color: '#3B6D11', fontFamily: 'var(--font-sans)', fontWeight: 500 }}>
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(row.id, 'missing')}
                        style={{ fontSize: 11, padding: '4px 10px', borderRadius: 8, cursor: 'pointer', border: 'none', background: '#FAEEDA', color: '#854F0B', fontFamily: 'var(--font-sans)' }}>
                        Flag
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: row.status === 'approved' ? '#EAF3DE' : '#FCEBEB', color: row.status === 'approved' ? '#3B6D11' : '#791F1F' }}>
                      {row.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {rows.filter(r => r.status === 'pending' || r.status === 'review').length > 0 && (
            <button
              onClick={approveAll}
              style={{ width: '100%', padding: '13px', borderRadius: 14, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: 8 }}>
              ✓ Approve all pending timesheets & run payroll
            </button>
          )}

          {ready > 0 && rows.filter(r => r.status === 'pending' || r.status === 'review').length === 0 && (
            <div style={{ textAlign: 'center', padding: 14, background: '#EAF3DE', borderRadius: 14, color: '#3B6D11', fontWeight: 600 }}>
              ✅ All {ready} timesheets approved — ready to run payroll!
            </div>
          )}
        </>
      )}
    </div>
  )
}