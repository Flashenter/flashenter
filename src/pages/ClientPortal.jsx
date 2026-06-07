import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ClientPortal() {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [tab, setTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [signed, setSigned] = useState(false)
  const [holidays, setHolidays] = useState([])
  const [success, setSuccess] = useState('')

  const [msgForm, setMsgForm] = useState({ subject: '', body: '' })
  const [holidayForm, setHolidayForm] = useState({ date: '', reason: '' })
  const [otForm, setOtForm] = useState({ va_name: '', hours: '', reason: '' })

  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSig, setHasSig] = useState(false)

  useEffect(() => { fetchClient() }, [id])

  async function fetchClient() {
    setLoading(true)
    const { data } = await supabase.from('contacts').select('*').eq('id', id).single()
    setClient(data)
    if (data) {
      const [{ data: msgs }, { data: sigs }, { data: hols }] = await Promise.all([
        supabase.from('messages').select('*').eq('contact_id', id).order('created_at', { ascending: false }),
        supabase.from('signatures').select('*').eq('contact_id', id),
        supabase.from('client_holidays').select('*').eq('contact_id', id).order('date'),
      ])
      setMessages(msgs || [])
      setSigned((sigs || []).length > 0)
      setHolidays(hols || [])
    }
    setLoading(false)
  }

  async function sendMessage() {
    if (!msgForm.subject || !msgForm.body) return alert('Please fill in all fields')
    const { error } = await supabase.from('messages').insert([{
      from_name: client.name, from_type: 'client', org_id: client.org_id,
      to_name: 'Flashenter Admin',
      subject: msgForm.subject, body: msgForm.body,
      contact_id: id
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setSuccess('Message sent!')
      setMsgForm({ subject: '', body: '' })
      fetchClient()
    }
    setTimeout(() => setSuccess(''), 4000)
  }

  async function saveSignature() {
    const canvas = canvasRef.current
    if (!hasSig) return alert('Please sign before submitting')
    const signature_data = canvas.toDataURL()
    const { error } = await supabase.from('signatures').insert([{
      signer_name: client.name, signer_type: 'client',
      document_name: 'Service Agreement',
      signature_data, contact_id: id
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setSigned(true)
      setSuccess('Contract signed!')
    }
    setTimeout(() => setSuccess(''), 4000)
  }

  async function addHoliday() {
    if (!holidayForm.date) return alert('Please select a date')
    const { error } = await supabase.from('client_holidays').insert([{
      contact_id: id, client_name: client.name, org_id: client.org_id,
      date: holidayForm.date, reason: holidayForm.reason
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setSuccess('Holiday added!')
      setHolidayForm({ date: '', reason: '' })
      fetchClient()
    }
    setTimeout(() => setSuccess(''), 4000)
  }

  async function approveOT() {
    if (!otForm.va_name || !otForm.hours) return alert('Please fill in VA name and hours')
    const { error } = await supabase.from('messages').insert([{
      from_name: client.name, from_type: 'client', org_id: client.org_id,
      to_name: 'Flashenter Admin',
      subject: `OT Approval: ${otForm.va_name}`,
      body: `I approve ${otForm.hours} overtime hours for ${otForm.va_name}. Reason: ${otForm.reason}`,
      contact_id: id
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setSuccess('OT approved and sent to admin!')
      setOtForm({ va_name: '', hours: '', reason: '' })
    }
    setTimeout(() => setSuccess(''), 4000)
  }

  function startDraw(e) {
    setDrawing(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function draw(e) {
    if (!drawing) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1a1a18'
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSig(true)
  }

  function clearSig() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSig(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1' }}>
      <div style={{ fontSize: 14, color: '#888780' }}>Loading your portal...</div>
    </div>
  )

  if (!client) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1' }}>
      <div style={{ fontSize: 14, color: '#A32D2D' }}>Portal not found. Please contact your administrator.</div>
    </div>
  )

  const tabs = [
    { key: 'overview', label: '🏠 Overview' },
    { key: 'contract', label: '✍️ Contract' },
    { key: 'holidays', label: '📅 Holidays' },
    { key: 'overtime', label: '⏱ Approve OT' },
    { key: 'messages', label: '💬 Messages' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F1', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>
          <span style={{ color: '#534AB7' }}>Flash</span>enter
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{client.name}</div>
          <div style={{ fontSize: 11, color: '#888780' }}>{client.company} · {client.country}</div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
        {success && (
          <div style={{ background: '#EAF3DE', border: '0.5px solid #7CB342', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#3B6D11', fontWeight: 500, fontSize: 13 }}>
            ✅ {success}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: '8px 16px', borderRadius: 40, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: tab === t.key ? 600 : 400,
              background: tab === t.key ? '#534AB7' : '#fff',
              color: tab === t.key ? '#fff' : '#5F5E5A',
              fontFamily: 'DM Sans, sans-serif'
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Welcome, {client.name}!</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { label: 'Company', val: client.company },
                  { label: 'Country', val: client.country },
                  { label: 'Email', val: client.email },
                  { label: 'Phone', val: client.phone },
                  { label: 'Package', val: client.budget },
                  { label: 'Contract', val: signed ? '✅ Signed' : '⚠️ Pending signature' },
                ].filter(i => i.val).map(item => (
                  <div key={item.label} style={{ padding: '10px 12px', background: '#F5F4F1', borderRadius: 10 }}>
                    <div style={{ fontSize: 10, color: '#888780', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
            {!signed && (
              <div style={{ background: '#FEF3E2', border: '0.5px solid #EF9F27', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#633806' }}>Contract pending signature</div>
                  <div style={{ fontSize: 12, color: '#854F0B', marginTop: 2 }}>Please sign your service agreement</div>
                </div>
                <button onClick={() => setTab('contract')} style={{ padding: '8px 16px', borderRadius: 40, border: 'none', background: '#EF9F27', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                  Sign now →
                </button>
              </div>
            )}
          </div>
        )}

        {tab === 'contract' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Service Agreement</div>
            <div style={{ fontSize: 12, color: '#888780', marginBottom: 20 }}>Please read and sign your service agreement below</div>
            <div style={{ background: '#F5F4F1', borderRadius: 12, padding: 20, marginBottom: 20, fontSize: 13, lineHeight: 1.8, color: '#1a1a18' }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>VIRTUAL ASSISTANT SERVICE AGREEMENT</div>
              <p>This agreement is between <strong>Flashenter</strong> ("Service Provider") and <strong>{client.name}</strong> / <strong>{client.company}</strong> ("Client").</p>
              <p><strong>Services:</strong> Flashenter will provide virtual assistant services as agreed upon.</p>
              <p><strong>Payment:</strong> {client.budget || 'As agreed upon with Flashenter administration.'}</p>
              <p><strong>Confidentiality:</strong> All information shared between parties remains strictly confidential.</p>
              <p><strong>Communication:</strong> All requests and changes must go through the Flashenter platform.</p>
              <p><strong>Overtime:</strong> Any overtime must be approved through the client portal before being worked.</p>
              <p><strong>Holidays:</strong> Client must submit holiday dates at least 2 weeks in advance.</p>
              <p>By signing below, you agree to all terms and conditions of this service agreement.</p>
            </div>
            {signed ? (
              <div style={{ textAlign: 'center', padding: 20, background: '#EAF3DE', borderRadius: 12, color: '#3B6D11', fontWeight: 600 }}>
                ✅ Contract signed successfully!
              </div>
            ) : (
              <>
                <div style={{ fontSize: 12, color: '#888780', marginBottom: 8 }}>Sign below using your mouse or finger:</div>
                <canvas ref={canvasRef} width={650} height={150}
                  style={{ border: '1px solid rgba(0,0,0,0.15)', borderRadius: 12, background: '#FAFAF9', touchAction: 'none', width: '100%', cursor: 'crosshair' }}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={() => setDrawing(false)}
                  onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={() => setDrawing(false)} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button onClick={saveSignature} style={{ flex: 1, padding: '11px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    ✍️ Sign Agreement
                  </button>
                  <button onClick={clearSig} style={{ padding: '11px 20px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.1)', background: '#F5F4F1', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'holidays' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Holiday Calendar</div>
              <div style={{ fontSize: 12, color: '#888780', marginBottom: 16 }}>Submit holiday dates at least 2 weeks in advance</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Date *</div>
                  <input type="date" value={holidayForm.date} onChange={e => setHolidayForm(p => ({ ...p, date: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Reason</div>
                  <input value={holidayForm.reason} onChange={e => setHolidayForm(p => ({ ...p, reason: e.target.value }))}
                    placeholder="e.g. National holiday"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <button onClick={addHoliday} style={{ width: '100%', padding: '11px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Add Holiday
              </button>
            </div>
            {holidays.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Submitted Holidays</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {holidays.map(h => (
                    <div key={h.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F5F4F1', borderRadius: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>📅 {h.date}</div>
                      <div style={{ fontSize: 12, color: '#888780' }}>{h.reason}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'overtime' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Approve Overtime</div>
            <div style={{ fontSize: 12, color: '#888780', marginBottom: 20 }}>Authorize overtime hours for your VA before they are worked</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>VA Name *</div>
                <input value={otForm.va_name} onChange={e => setOtForm(p => ({ ...p, va_name: e.target.value }))}
                  placeholder="e.g. Maria Santos"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Overtime hours *</div>
                <input type="number" value={otForm.hours} onChange={e => setOtForm(p => ({ ...p, hours: e.target.value }))}
                  placeholder="e.g. 5"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Reason</div>
                <textarea value={otForm.reason} onChange={e => setOtForm(p => ({ ...p, reason: e.target.value }))}
                  placeholder="e.g. Product launch this week requires extra support" rows={3}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'DM Sans, sans-serif' }} />
              </div>
            </div>
            <button onClick={approveOT} style={{ width: '100%', padding: '12px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
              ✅ Approve Overtime
            </button>
          </div>
        )}

        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Send a Message</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Subject</div>
                <input value={msgForm.subject} onChange={e => setMsgForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Question about my VA"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Message</div>
                <textarea value={msgForm.body} onChange={e => setMsgForm(p => ({ ...p, body: e.target.value }))}
                  placeholder="Write your message here..." rows={4}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'DM Sans, sans-serif' }} />
              </div>
              <button onClick={sendMessage} style={{ width: '100%', padding: '11px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Send Message
              </button>
            </div>
            {messages.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Message History</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {messages.map(m => (
                    <div key={m.id} style={{ padding: '12px 14px', background: '#F5F4F1', borderRadius: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{m.subject}</div>
                      <div style={{ fontSize: 12, color: '#5F5E5A', marginTop: 4, lineHeight: 1.5 }}>{m.body}</div>
                      <div style={{ fontSize: 10, color: '#B4B2A9', marginTop: 6 }}>{new Date(m.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}