import { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Phone } from 'lucide-react'
import { supabase } from '../lib/supabase'

const AUTO_REPLY = "Hi! Thanks for reaching out to Flashenter. We're currently attending another client — please hold one moment or call us directly at +1 (862) 414-4734. We'll be right with you! 😊"

export default function ChatWidget({ fromName, fromType, contactId, vaId }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [hasReplied, setHasReplied] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (open) scrollToBottom()
  }, [messages, open])

  function scrollToBottom() {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  async function sendMessage() {
    if (!input.trim() || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    const newMsg = { id: Date.now(), text, from: 'user', time: new Date() }
    setMessages(h => [...h, newMsg])

    await supabase.from('messages').insert([{
      from_name: fromName || 'Visitor',
      from_type: fromType || 'client',
      to_name: 'Flashenter Admin',
      subject: 'Live chat message',
      body: text,
      contact_id: contactId || null,
      va_id: vaId || null,
    }])

    if (!hasReplied) {
      setTimeout(() => {
        setMessages(h => [...h, { id: Date.now() + 1, text: AUTO_REPLY, from: 'bot', time: new Date() }])
        setHasReplied(true)
        scrollToBottom()
      }, 1200)
    }

    setSending(false)
  }

  return (
    <div style={{ position: 'fixed', bottom: 90, right: 24, zIndex: 150 }}>
      {open && (
        <div style={{ width: 320, background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(0,0,0,0.15)', marginBottom: 12, overflow: 'hidden', border: '0.5px solid rgba(0,0,0,0.08)' }}>
          {/* Header */}
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

          {/* Messages */}
          <div style={{ height: 260, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10, background: '#F5F4F1' }}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Hi there!</div>
                <div style={{ fontSize: 12, color: '#888780', lineHeight: 1.5 }}>How can we help you today? Send us a message and we will get back to you shortly!</div>
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

          {/* Call bar */}
          <div style={{ padding: '8px 14px', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Phone size={12} color="#534AB7" />
            <a href="tel:+18624144734" style={{ fontSize: 11, color: '#534AB7', fontWeight: 600, textDecoration: 'none' }}>Call us: +1 (862) 414-4734</a>
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', background: '#fff', display: 'flex', gap: 8, borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              style={{ flex: 1, padding: '8px 12px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.12)', fontSize: 12, outline: 'none', fontFamily: 'DM Sans, sans-serif' }}
            />
            <button onClick={sendMessage} disabled={sending}
              style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Send size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Chat bubble */}
      <button onClick={() => setOpen(v => !v)}
        style={{ width: 52, height: 52, borderRadius: '50%', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(83,74,183,0.4)', marginLeft: 'auto' }}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}