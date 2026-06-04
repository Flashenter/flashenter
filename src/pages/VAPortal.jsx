import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function VAPortal() {
  const { id } = useParams()
  const [va, setVa] = useState(null)
  const [tab, setTab] = useState('timesheet')
  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [messages, setMessages] = useState([])
  const [signed, setSigned] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const [tsForm, setTsForm] = useState({ week_start: '', hours: '', overtime: 0, notes: '', file: null })
  const [msgForm, setMsgForm] = useState({ subject: '', body: '' })

  const canvasRef = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSig, setHasSig] = useState(false)

  useEffect(() => { fetchVA() }, [id])

  async function fetchVA() {
    setLoading(true)
    const { data } = await supabase.from('vas').select('*').eq('id', id).single()
    setVa(data)
    if (data) {
      const [{ data: subs }, { data: msgs }, { data: sigs }] = await Promise.all([
        supabase.from('va_submissions').select('*').eq('va_id', id).order('created_at', { ascending: false }),
        supabase.from('messages').select('*').eq('va_id', id).order('created_at', { ascending: false }),
        supabase.from('signatures').select('*').eq('va_id', id),
      ])
      setSubmissions(subs || [])
      setMessages(msgs || [])
      setSigned((sigs || []).length > 0)
    }
    setLoading(false)
  }

  async function submitTimesheet() {
    if (!tsForm.week_start || !tsForm.hours) return alert('Please fill in week and hours')
    setSubmitting(true)
    let file_url = null
    if (tsForm.file) {
      const ext = tsForm.file.name.split('.').pop()
      const path = `timesheets/${id}-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('uploads').upload(path, tsForm.file)
      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(path)
        file_url = urlData.publicUrl
      }
    }
    const { error } = await supabase.from('va_submissions').insert([{
      va_id: id, va_name: va.name,
      week_start: tsForm.week_start,
      hours: parseInt(tsForm.hours),
      overtime: parseInt(tsForm.overtime) || 0,
      notes: tsForm.notes,
      file_url
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setSuccess('Timesheet submitted successfully!')
      setTsForm({ week_start: '', hours: '', overtime: 0, notes: '', file: null })
      fetchVA()
    }
    setSubmitting(false)
    setTimeout(() => setSuccess(''), 4000)
  }

  async function sendMessage() {
    if (!msgForm.subject || !msgForm.body) return alert('Please fill in all fields')
    const { error } = await supabase.from('messages').insert([{
      from_name: va.name, from_type: 'va',
      to_name: 'Flashenter Admin',
      subject: msgForm.subject, body: msgForm.body,
      va_id: id
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setSuccess('Message sent!')
      setMsgForm({ subject: '', body: '' })
      fetchVA()
    }
    setTimeout(() => setSuccess(''), 4000)
  }

  async function saveSignature() {
    const canvas = canvasRef.current
    if (!hasSig) return alert('Please sign before submitting')
    const signature_data = canvas.toDataURL()
    const { error } = await supabase.from('signatures').insert([{
      signer_name: va.name, signer_type: 'va',
      document_name: 'Employment Contract',
      signature_data, va_id: id
    }])
    if (error) { alert('Error: ' + error.message) } else {
      setSigned(true)
      setSuccess('Contract signed successfully!')
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

  if (!va) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1' }}>
      <div style={{ fontSize: 14, color: '#A32D2D' }}>Portal not found. Please contact your administrator.</div>
    </div>
  )

  const tabs = [
    { key: 'timesheet', label: '📋 Submit Hours' },
    { key: 'history', label: '📊 My History' },
    { key: 'contract', label: '✍️ Contract' },
    { key: 'messages', label: '💬 Messages' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F1', fontFamily: 'DM Sans, sans-serif' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>
          <span style={{ color: '#534AB7' }}>Flash</span>enter
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{va.name}</div>
          <div style={{ fontSize: 11, color: '#888780' }}>{va.role} · {va.country}</div>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 16px' }}>
        {success && (
          <div style={{ background: '#EAF3DE', border: '0.5px solid #7CB342', borderRadius: 12, padding: '12px 16px', marginBottom: 16, color: '#3B6D11', fontWeight: 500, fontSize: 13 }}>
            ✅ {success}
          </div>
        )}

        {/* Tabs */}
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

        {/* Submit Hours */}
        {tab === 'timesheet' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Submit Weekly Hours</div>
            <div style={{ fontSize: 12, color: '#888780', marginBottom: 20 }}>Submit your timesheet every Monday before 5pm DR time</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Week starting *</div>
                <input type="date" value={tsForm.week_start} onChange={e => setTsForm(p => ({ ...p, week_start: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Regular hours *</div>
                <input type="number" value={tsForm.hours} onChange={e => setTsForm(p => ({ ...p, hours: e.target.value }))}
                  placeholder="e.g. 40"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Overtime hours</div>
                <input type="number" value={tsForm.overtime} onChange={e => setTsForm(p => ({ ...p, overtime: e.target.value }))}
                  placeholder="e.g. 0"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Upload screenshot/file</div>
                <input type="file" accept="image/*,.pdf" onChange={e => setTsForm(p => ({ ...p, file: e.target.files[0] }))}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 12, boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Notes (optional)</div>
              <textarea value={tsForm.notes} onChange={e => setTsForm(p => ({ ...p, notes: e.target.value }))}
                placeholder="Any notes about this week..." rows={3}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'DM Sans, sans-serif' }} />
            </div>
            <button onClick={submitTimesheet} disabled={submitting}
              style={{ width: '100%', padding: '12px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: submitting ? 0.7 : 1 }}>
              {submitting ? 'Submitting...' : 'Submit Timesheet'}
            </button>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>My Submission History</div>
            {submissions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>No submissions yet</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {submissions.map(s => (
                  <div key={s.id} style={{ padding: '12px 14px', background: '#F5F4F1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>Week of {s.week_start}</div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{s.hours}h regular · {s.overtime}h OT</div>
                      {s.notes && <div style={{ fontSize: 11, color: '#5F5E5A', marginTop: 3 }}>{s.notes}</div>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {s.file_url && <a href={s.file_url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#534AB7' }}>View file</a>}
                      <span style={{ fontSize: 11, padding: '3px 9px', borderRadius: 20, background: s.status === 'approved' ? '#EAF3DE' : '#FAEEDA', color: s.status === 'approved' ? '#3B6D11' : '#854F0B' }}>{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contract */}
        {tab === 'contract' && (
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Employment Contract</div>
            <div style={{ fontSize: 12, color: '#888780', marginBottom: 20 }}>Please read and sign your employment contract below</div>

            <div style={{ background: '#F5F4F1', borderRadius: 12, padding: 20, marginBottom: 20, fontSize: 13, lineHeight: 1.8, color: '#1a1a18' }}>
              <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>VIRTUAL ASSISTANT EMPLOYMENT AGREEMENT</div>
              <p>This agreement is between <strong>Flashenter</strong> ("Company") and <strong>{va.name}</strong> ("Virtual Assistant").</p>
              <p><strong>Role:</strong> {va.role || 'Virtual Assistant'}</p>
              <p><strong>Type:</strong> {va.type || 'Full-time'}</p>
              <p><strong>Start date:</strong> As agreed upon with your assigned administrator.</p>
              <p><strong>Working hours:</strong> As per your agreed schedule with your client.</p>
              <p><strong>Payment:</strong> As agreed and communicated by Flashenter administration.</p>
              <p><strong>Confidentiality:</strong> You agree to keep all client information strictly confidential.</p>
              <p><strong>Code of conduct:</strong> You agree to maintain professional standards at all times.</p>
              <p>By signing below, you agree to all terms and conditions of this employment agreement.</p>
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
                    ✍️ Sign Contract
                  </button>
                  <button onClick={clearSig} style={{ padding: '11px 20px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.1)', background: '#F5F4F1', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Clear
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Messages */}
        {tab === 'messages' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '0.5px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Send a Message</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>Subject</div>
                <input value={msgForm.subject} onChange={e => setMsgForm(p => ({ ...p, subject: e.target.value }))}
                  placeholder="e.g. Question about my schedule"
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