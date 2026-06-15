import { useState, useEffect } from 'react'
import { Plus, Download, Send, FileText } from 'lucide-react'
import { PageHeader, Button, MetricCard } from '../components/ui'
import { supabase } from '../lib/supabase'
import { sendEmail } from '../lib/email'

const ADMIN_EMAIL = 'info@nexbridgeva.com'

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({
    client_id: '', client_name: '', client_email: '', client_company: '',
    invoice_number: 'INV-' + Date.now().toString().slice(-6),
    due_date: '', notes: '',
    items: [{ description: '', quantity: 1, rate: '', amount: 0 }]
  })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: invs }, { data: conts }] = await Promise.all([
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('contacts').select('*').order('name'),
    ])
    setInvoices(invs || [])
    setContacts(conts || [])
    setLoading(false)
  }

  function selectClient(id) {
    const client = contacts.find(c => c.id === id)
    if (client) {
      setForm(p => ({ ...p, client_id: id, client_name: client.name, client_email: client.email || '', client_company: client.company || '' }))
    }
  }

  function updateItem(index, field, value) {
    const items = [...form.items]
    items[index][field] = value
    if (field === 'quantity' || field === 'rate') {
      items[index].amount = parseFloat(items[index].quantity || 0) * parseFloat(items[index].rate || 0)
    }
    setForm(p => ({ ...p, items }))
  }

  function addItem() {
    setForm(p => ({ ...p, items: [...p.items, { description: '', quantity: 1, rate: '', amount: 0 }] }))
  }

  function removeItem(index) {
    setForm(p => ({ ...p, items: p.items.filter((_, i) => i !== index) }))
  }

  const subtotal = form.items.reduce((sum, item) => sum + (item.amount || 0), 0)
  const tax = 0
  const total = subtotal + tax

  async function saveInvoice(status = 'draft') {
    if (!form.client_name) return alert('Please select a client')
    const { data, error } = await supabase.from('invoices').insert([{
      ...form, subtotal, total, status,
      items: JSON.stringify(form.items)
    }]).select().single()
    if (error) { alert('Error: ' + error.message) } else {
      setShowCreate(false)
      fetchAll()
      if (status === 'sent') {
        await sendEmail({
          to: form.client_email,
          subject: 'Invoice ' + form.invoice_number + ' from Flashenter',
          html: generateEmailHTML(data)
        })
      }
    }
  }

  async function updateStatus(id, status) {
    await supabase.from('invoices').update({ status }).eq('id', id)
    fetchAll()
  }

  function generateEmailHTML(inv) {
    const items = typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items
    return `
      <div style="font-family: DM Sans, sans-serif; max-width: 700px; margin: 0 auto; padding: 40px 20px;">
        <div style="font-size: 28px; font-weight: 700; margin-bottom: 30px;">
          <span style="color: #534AB7;">Flash</span>enter
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
          <div>
            <div style="font-size: 24px; font-weight: 700; color: #534AB7;">INVOICE</div>
            <div style="font-size: 14px; color: #888780; margin-top: 4px;">${inv.invoice_number}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 13px; color: #888780;">Due date</div>
            <div style="font-size: 16px; font-weight: 600;">${inv.due_date || 'Upon receipt'}</div>
          </div>
        </div>
        <div style="margin-bottom: 30px;">
          <div style="font-size: 11px; color: #888780; margin-bottom: 4px;">BILL TO</div>
          <div style="font-size: 16px; font-weight: 600;">${inv.client_name}</div>
          <div style="font-size: 13px; color: #5F5E5A;">${inv.client_company}</div>
          <div style="font-size: 13px; color: #5F5E5A;">${inv.client_email}</div>
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #F5F4F1;">
            <th style="padding: 10px; text-align: left; font-size: 11px; color: #888780;">DESCRIPTION</th>
            <th style="padding: 10px; text-align: right; font-size: 11px; color: #888780;">QTY</th>
            <th style="padding: 10px; text-align: right; font-size: 11px; color: #888780;">RATE</th>
            <th style="padding: 10px; text-align: right; font-size: 11px; color: #888780;">AMOUNT</th>
          </tr>
          ${items.map(item => `
            <tr style="border-bottom: 0.5px solid rgba(0,0,0,0.08);">
              <td style="padding: 12px 10px; font-size: 13px;">${item.description}</td>
              <td style="padding: 12px 10px; text-align: right; font-size: 13px;">${item.quantity}</td>
              <td style="padding: 12px 10px; text-align: right; font-size: 13px;">$${parseFloat(item.rate).toFixed(2)}</td>
              <td style="padding: 12px 10px; text-align: right; font-size: 13px; font-weight: 600;">$${parseFloat(item.amount).toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>
        <div style="text-align: right; margin-bottom: 30px;">
          <div style="font-size: 20px; font-weight: 700; color: #534AB7;">Total: $${parseFloat(inv.total).toFixed(2)}</div>
        </div>
        ${inv.notes ? `<div style="background: #F5F4F1; border-radius: 8px; padding: 16px; font-size: 13px; color: #5F5E5A;">${inv.notes}</div>` : ''}
      </div>
    `
  }

  function printInvoice(inv) {
    const items = typeof inv.items === 'string' ? JSON.parse(inv.items) : inv.items
    const html = `<!DOCTYPE html><html><head><title>Invoice ${inv.invoice_number}</title><style>
      body { font-family: 'DM Sans', sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1a1a18; }
      .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
      .logo { font-size: 28px; font-weight: 700; }
      .logo span { color: #534AB7; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th { background: #F5F4F1; padding: 10px; text-align: left; font-size: 11px; color: #888780; text-transform: uppercase; }
      td { padding: 12px 10px; border-bottom: 0.5px solid rgba(0,0,0,0.08); font-size: 13px; }
      .total { text-align: right; font-size: 20px; font-weight: 700; color: #534AB7; margin-top: 20px; }
      @media print { body { margin: 0; } }
    </style></head><body>
      <div class="header">
        <div class="logo"><span>Flash</span>enter</div>
        <div style="text-align:right">
          <div style="font-size:24px;font-weight:700;color:#534AB7">INVOICE</div>
          <div style="color:#888780">${inv.invoice_number}</div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:30px">
        <div>
          <div style="font-size:11px;color:#888780;margin-bottom:4px">BILL TO</div>
          <div style="font-size:16px;font-weight:600">${inv.client_name}</div>
          <div style="color:#5F5E5A">${inv.client_company || ''}</div>
          <div style="color:#5F5E5A">${inv.client_email || ''}</div>
        </div>
        <div style="text-align:right">
          <div style="font-size:11px;color:#888780">DUE DATE</div>
          <div style="font-weight:600">${inv.due_date || 'Upon receipt'}</div>
        </div>
      </div>
      <table>
        <tr><th>Description</th><th style="text-align:right">Qty</th><th style="text-align:right">Rate</th><th style="text-align:right">Amount</th></tr>
        ${items.map(item => `<tr><td>${item.description}</td><td style="text-align:right">${item.quantity}</td><td style="text-align:right">$${parseFloat(item.rate || 0).toFixed(2)}</td><td style="text-align:right;font-weight:600">$${parseFloat(item.amount || 0).toFixed(2)}</td></tr>`).join('')}
      </table>
      <div class="total">Total: $${parseFloat(inv.total || 0).toFixed(2)}</div>
      ${inv.notes ? `<div style="margin-top:20px;background:#F5F4F1;padding:16px;border-radius:8px;font-size:13px">${inv.notes}</div>` : ''}
      <script>window.onload = () => window.print()</script>
    </body></html>`
    const w = window.open('', '_blank')
    w.document.write(html)
    w.document.close()
  }

  return (
    <div>
      <PageHeader title="Invoices" subtitle={invoices.length + ' total invoices'}>
        <Button variant="primary" icon={Plus} onClick={() => setShowCreate(true)}>Create invoice</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        <MetricCard icon={FileText} label="Total invoices" value={invoices.length} sub="All time" />
        <MetricCard icon={FileText} label="Unpaid" value={invoices.filter(i => i.status === 'sent').length} sub="Awaiting payment" subColor="var(--amber-400)" />
        <MetricCard icon={FileText} label="Paid" value={invoices.filter(i => i.status === 'paid').length} sub="Completed" subColor="var(--green-600)" />
        <MetricCard icon={FileText} label="Total revenue" value={'$' + invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.total || 0), 0).toLocaleString()} sub="Collected" subColor="var(--purple-600)" />
      </div>

      {showCreate && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>New Invoice</div>
            <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888780' }}>×</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Client *</div>
              <select value={form.client_id} onChange={e => selectClient(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, fontFamily: 'var(--font-sans)', outline: 'none' }}>
                <option value="">Select client...</option>
                {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? '· ' + c.company : ''}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Invoice number</div>
              <input value={form.invoice_number} onChange={e => setForm(p => ({ ...p, invoice_number: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Due date</div>
              <input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ background: '#F5F4F1', borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 32px', gap: 8, marginBottom: 8 }}>
              {['Description', 'Qty', 'Rate ($)', 'Amount', ''].map(h => (
                <div key={h} style={{ fontSize: 10, color: '#888780', textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {form.items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 100px 100px 32px', gap: 8, marginBottom: 8 }}>
                <input value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                  placeholder="e.g. VA services - Week of June 1"
                  style={{ padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
                <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)}
                  style={{ padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, outline: 'none' }} />
                <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)}
                  placeholder="0.00"
                  style={{ padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, outline: 'none' }} />
                <div style={{ padding: '7px 10px', borderRadius: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontWeight: 600 }}>
                  ${(item.amount || 0).toFixed(2)}
                </div>
                <button onClick={() => removeItem(i)} style={{ background: '#FCEBEB', border: 'none', borderRadius: 8, cursor: 'pointer', color: '#A32D2D', fontSize: 16 }}>×</button>
              </div>
            ))}
            <button onClick={addItem} style={{ fontSize: 12, color: '#534AB7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginTop: 4 }}>
              + Add line item
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, color: '#888780', marginBottom: 4 }}>Subtotal: <strong>${subtotal.toFixed(2)}</strong></div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#534AB7' }}>Total: ${total.toFixed(2)}</div>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Notes (optional)</div>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
              placeholder="Payment instructions, thank you note, etc."
              rows={2}
              style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'var(--font-sans)' }} />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => saveInvoice('draft')} style={{ padding: '9px 18px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.1)', background: '#F5F4F1', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              Save as draft
            </button>
            <button onClick={() => saveInvoice('sent')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
              <Send size={12} /> Send to client
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
      ) : invoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧾</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No invoices yet</div>
          <div style={{ fontSize: 13, color: '#888780', marginBottom: 20 }}>Create your first invoice to get paid</div>
          <button onClick={() => setShowCreate(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Create first invoice
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px 140px', gap: 8, padding: '8px 16px', background: '#F5F4F1', borderBottom: '0.5px solid rgba(0,0,0,0.06)' }}>
            {['Client', 'Invoice #', 'Due date', 'Amount', 'Status'].map(h => (
              <div key={h} style={{ fontSize: 10, color: '#888780', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>
          {invoices.map((inv, i) => (
            <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px 140px', gap: 8, padding: '12px 16px', alignItems: 'center', borderBottom: i < invoices.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{inv.client_name}</div>
                <div style={{ fontSize: 11, color: '#888780' }}>{inv.client_company}</div>
              </div>
              <div style={{ fontSize: 12, color: '#534AB7', fontWeight: 500 }}>{inv.invoice_number}</div>
              <div style={{ fontSize: 12, color: '#888780' }}>{inv.due_date || 'On receipt'}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>${parseFloat(inv.total || 0).toFixed(2)}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, background: inv.status === 'paid' ? '#EAF3DE' : inv.status === 'sent' ? '#FAEEDA' : '#F5F4F1', color: inv.status === 'paid' ? '#3B6D11' : inv.status === 'sent' ? '#854F0B' : '#888780' }}>
                  {inv.status}
                </span>
                <button onClick={() => printInvoice(inv)} title="Download/Print" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#534AB7' }}>
                  <Download size={13} />
                </button>
                {inv.status === 'sent' && (
                  <button onClick={() => updateStatus(inv.id, 'paid')} style={{ fontSize: 10, padding: '3px 9px', borderRadius: 20, border: 'none', background: '#EAF3DE', color: '#3B6D11', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    Mark paid
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}