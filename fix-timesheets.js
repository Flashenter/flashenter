const fs = require('fs')
const code = `import { useState, useEffect } from 'react'
import { Clock, Users, AlertTriangle, Wallet, Check, Eye, Send, Download, Plus } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader, SectionTitle } from '../components/ui'
import { supabase } from '../lib/supabase'

export default function Timesheets() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newTS, setNewTS] = useState({ va_name: '', va_initials: '', country: '', hours: 0, overtime: 0, pay: '', currency: 'USD', via: 'Wise', status: 'pending', notes: '' })

  useEffect(() => { fetchTimesheets() }, [])

  async function fetchTimesheets() {
    setLoading(true)
    const { data, error } = await supabase.from('timesheets').select('*').order('created_at', { ascending: false })
    if (error) alert('Error: ' + error.message)
    setRows(data || [])
    setLoading(false)
  }

  async function addTimesheet() {
    if (!newTS.va_name) return alert('Please enter VA name')
    const initials = newTS.va_name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    const { error } = await supabase.from('timesheets').insert([{ ...newTS, va_initials: initials }])
    if (error) { alert('Error: ' + error.message) } else { setShowAdd(false); fetchTimesheets() }
  }

  async function updateStatus(id, status) {
    await supabase.from('timesheets').update({ status }).eq('id', id)
    fetchTimesheets()
  }

  const ready = rows.filter(r => r.status === 'approved').length
  const review = rows.filter(r => r.status === 'review').length
  const missing = rows.filter(r => r.status === 'missing').length

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
              { key: 'pay', label: 'Pay amount (e.g. $480 USD)' },
              { key: 'currency', label: 'Currency' },
              { key: 'via', label: 'Payment via (e.g. Wise)' },
              { key: 'notes', label: 'Notes' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input type={f.type || 'text'} value={newTS[f.key]} onChange={e => setNewTS(p => ({ ...p, [f.key]: e.target.value }))}
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
            <button onClick={addTimesheet} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save timesheet</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>