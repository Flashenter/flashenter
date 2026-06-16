import { useState, useRef } from 'react'
import { MessageCircle, X, Send, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'

const knowledgeBase = [
  { q: 'wait waiting long how long response time', a: 'Our typical response time is between 4-6 minutes during business hours. If urgent, call us at +1 (862) 414-4734.' },
  { q: 'hours business open available when', a: 'We are available Monday to Friday, 9:00am to 11:00pm Eastern Time. For urgent matters WhatsApp us at +1 (809) 431-0366.' },
  { q: 'price cost plan subscription pricing upgrade', a: 'Our plans vary! Please visit flashenter.com/signup to see all available plans and pricing. You can upgrade anytime!' },
  { q: 'whatsapp number phone contact person real human support help', a: 'You can reach us on WhatsApp at +1 (809) 431-0366 or email us at support@flashenter.com. We are available Monday to Friday 9am-11pm EST.' },
  { q: 'email address contact us support', a: 'You can email us at support@flashenter.com or WhatsApp us at +1 (809) 431-0366 for urgent help.' },
  { q: 'cancel subscription account', a: 'To cancel your subscription please email support@flashenter.com or WhatsApp us at +1 (809) 431-0366 and we will help you right away.' },
  { q: 'refund money back', a: 'We offer a 7-day free trial. For refund requests please contact support@flashenter.com within 7 days of your payment.' },
  { q: 'problem error not working bug', a: 'Sorry to hear that! Please describe the issue and email support@flashenter.com or WhatsApp us at +1 (809) 431-0366 and we will fix it asap.' },
  { q: 'portal link va virtual assistant', a: 'Go to VA Pool, find the VA card and click "Copy portal link". Send that link to your VA.' },
  { q: 'portal link client', a: 'Go to Clients, click on the client card, and click "Copy portal link" button.' },
  { q: 'invoice billing payment', a: 'Go to Invoices in the nav, click "Create invoice", select the client, add line items and send.' },
  { q: 'approve timesheet hours', a: 'Go to Inbox, click the "VA Timesheets" tab and click Approve on each submission.' },
  { q: 'payroll run pay', a: 'Go to Payroll, approve all pending records, then click the "Run payroll" button at the bottom.' },
  { q: 'contract sign agreement', a: 'Send the portal link to your client or VA. They go to the Contract tab and sign digitally.' },
  { q: 'add client new contact', a: 'Go to Clients in the nav, click "Add client", fill in their details and click Save.' },
  { q: 'team member approve access login', a: 'Go to Team in the nav and click Approve next to the person waiting for access.' },
  { q: 'holiday vacation time off', a: 'Clients submit holidays through their client portal. You can approve or reject them in Inbox under Client Holidays.' },
  { q: 'overtime ot extra hours', a: 'Clients approve overtime through their client portal under the Approve OT tab.' },
]

const HOLD_MESSAGE = "Hi! Thanks for reaching out to Flashenter. We're currently attending another client — please hold one moment or call us directly at +1 (862) 414-4734. We'll be right with you! 😊"

function findAnswer(text) {
  const lower = text.toLowerCase()
  const match = knowledgeBase.find(item =>
    item.q.toLowerCase().split(' ').some(word => word.length > 2 && lower.includes(word))
  )
  return match ? match.a : null
}

export default function ChatWidget({ fromName, fromType, contactId, vaId }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  async function sendMessage() {
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    setMessages(h => [...h, { id: Date.now(), text, from: 'user' }])

    await supabase.from('messages').insert([{
      from_name: fromName || 'Visitor',
      from_type: fromType || 'client',
      to_name: 'Flashenter Admin',
      subject: 'Live chat message',
      body: text,
      contact_id: contactId || null,
      va_id: vaId || null,
    }])

    const answer = findAnswer(text)
    const reply = answer || HOLD_MESSAGE

    setTimeout(() => {
      setMessages(h => [...h, { id: Date.now() + 1, text: reply, from: 'bot' }])
      scrollToBottom()
    }, 1000)

    setSending(false)
    scrollToBottom()
  }

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 150 }}>
      {open && (
        <div style={{ width: 320, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', marginBottom: 12, overflow: 'hidden', border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ background: '#534AB7', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Flashenter Support</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  Online
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.7)' }}>
              <X size={18} />
            </button>
          </div>

          <div style={{ height: 260, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, background: '#F5F4F1' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Hi there!</div>
                <div style={{ fontSize: 12, color: '#888780', lineHeight: 1.5 }}>How can we help you today? Type your question below!</div>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.from !== 'user' && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#534AB7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginRight: 6, flexShrink: 0 }}>⚡</div>
                )}
                <div style={{ maxWidth: '75%', padding: '9px 12px', borderRadius: msg.from === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px', background: msg.from === 'user' ? '#534AB7' : '#fff', color: msg.from === 'user' ? '#fff' : '#1a1a18', fontSize: 12, lineHeight: 1.5, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div style={{ padding: '8px 14px', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Phone size={12} color="#534AB7" />
            <a href="tel:+18624144734" style={{ fontSize: 11, color: '#534AB7', fontWeight: 600, textDecoration: 'none' }}>Call us: +1 (862) 414-4734</a>
          </div>

          <div style={{ padding: '10px 12px', background: '#fff', display: 'flex', gap: 8, borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message or question..."
              style={{ flex: 1, padding: '8px 12px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 12, outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
            />
            <button onClick={sendMessage} disabled={sending}
              style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(v => !v)}
        style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(83,74,183,0.4)', marginLeft: 'auto' }}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}