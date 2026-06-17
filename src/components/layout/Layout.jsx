import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Star, Briefcase, Clock, Wallet,
  FileText, Globe, Settings, BookUser, UserCheck, Bell, HelpCircle, Mail, ChevronDown, ChevronUp, Send
} from 'lucide-react'
import ChatWidget from '../ChatWidget'
import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Clients', path: '/contacts' },
  { icon: Star, label: 'Leads', path: '/leads' },
  { icon: Briefcase, label: 'Deals', path: '/deals' },
  null,
  { icon: BookUser, label: 'VA Pool', path: '/va-pool' },
  { icon: UserCheck, label: 'Onboarding', path: '/onboarding' },
  { icon: Clock, label: 'Timesheets', path: '/timesheets' },
  { icon: Wallet, label: 'Payroll', path: '/payroll' },
  { icon: FileText, label: 'Invoices', path: '/invoices' },
  null,
  { icon: Globe, label: 'Markets', path: '/markets' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: Users, label: 'Team', path: '/team' },
  { icon: Mail, label: 'Inbox', path: '/inbox', badge: true },
]

const faqs = [
  { q: 'How do I add a new client?', a: 'Go to Clients in the nav, click Add client button at the top right, fill in their details and click Save.' },
  { q: 'How do I send a VA their portal link?', a: 'Go to VA Pool, find the VA card and click Copy portal link. Send that link to your VA via email or WhatsApp.' },
  { q: 'How do I approve a timesheet?', a: 'Go to Inbox, click the VA Timesheets tab. You will see all pending submissions. Click Approve on each one.' },
  { q: 'How do I run payroll?', a: 'Go to Payroll, approve all pending records by clicking Approve on each row, then click the Run payroll button at the bottom.' },
  { q: 'How do I get a client to sign their contract?', a: 'Go to Clients, click on the client, copy their portal link and send it to them. They go to the Contract tab and sign digitally.' },
  { q: 'How do I add a team member?', a: 'Ask them to go to flashenter.com and sign in with Google. Then go to Team in the nav and click Approve next to their name.' },
  { q: 'How do I create an invoice?', a: 'Go to Invoices in the nav, click Create invoice, select the client, add line items and click Send to client.' },
  { q: 'How do I approve a holiday request?', a: 'Go to Inbox, click Client Holidays tab. You will see all pending holiday requests. Click Approve or Reject.' },
]

const allQA = [
  ...faqs,
  { q: 'portal link va virtual assistant', a: 'Go to VA Pool, find the VA card and click Copy portal link. Send that link to your VA.' },
  { q: 'portal link client', a: 'Go to Clients, click on the client card, and click Copy portal link button.' },
  { q: 'invoice billing payment', a: 'Go to Invoices, click Create invoice, select the client, add line items and send.' },
  { q: 'holiday vacation time off', a: 'Clients can submit holidays through their client portal. You can approve or reject them in Inbox.' },
  { q: 'overtime ot extra hours', a: 'Clients approve overtime through their client portal under the Approve OT tab.' },
  { q: 'contract sign agreement', a: 'Send the portal link to your client or VA. They go to the Contract tab and sign digitally.' },
  { q: 'whatsapp number phone contact support help', a: 'You can reach us on WhatsApp at +1 (809) 431-0366 or email support@flashenter.com. Available Mon-Fri 9am-11pm EST.' },
  { q: 'email address contact us', a: 'Email us at support@flashenter.com or WhatsApp +1 (809) 431-0366 for urgent help.' },
  { q: 'wait waiting long response time', a: 'Our typical response time is between 4-6 minutes during business hours. If urgent call +1 (862) 414-4734.' },
  { q: 'hours business open available when', a: 'We are available Monday to Friday 9:00am to 11:00pm Eastern Time.' },
  { q: 'price cost plan subscription pricing', a: 'Our plans vary! Please visit flashenter.com/signup to see all plans. You can upgrade anytime!' },
  { q: 'cancel subscription account', a: 'To cancel please email support@flashenter.com or WhatsApp us and we will help right away.' },
  { q: 'refund money back', a: 'We offer a 7-day free trial. For refunds contact support@flashenter.com within 7 days of payment.' },
  { q: 'problem error not working bug', a: 'Sorry! Please email support@flashenter.com or WhatsApp +1 (809) 431-0366 and we will fix it asap.' },
]

const vaGuide = [
  { step: '1', title: 'Get your portal link', desc: 'Your admin will send you a unique link. Bookmark it.' },
  { step: '2', title: 'Sign your contract', desc: 'Go to the Contract tab, read the agreement, then sign and click Sign.' },
  { step: '3', title: 'Submit weekly hours', desc: 'Every Monday go to Submit Hours, fill in your week dates and hours, and click Submit.' },
  { step: '4', title: 'Send messages', desc: 'Use the Messages tab to contact your admin about any questions or concerns.' },
]

const clientGuide = [
  { step: '1', title: 'Get your portal link', desc: 'Your Flashenter admin will send you a unique portal link. Keep it safe.' },
  { step: '2', title: 'Sign your agreement', desc: 'Go to the Contract tab, read your service agreement, sign digitally and click Sign Agreement.' },
  { step: '3', title: 'Submit holiday dates', desc: 'Go to Holidays tab and add any days your VA should not work at least 2 weeks in advance.' },
  { step: '4', title: 'Approve overtime', desc: 'If your VA needs extra hours, go to Approve OT, enter the hours and reason, and click Approve.' },
  { step: '5', title: 'Send messages', desc: 'Use the Messages tab to contact your Flashenter admin with any questions.' },
]

export default function Layout({ children, user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnread() {
      const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false)
      const { count: subCount } = await supabase.from('va_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      setUnreadCount((msgCount || 0) + (subCount || 0))
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [])
  const [showHelp, setShowHelp] = useState(false)
  const [helpSection, setHelpSection] = useState('home')
  const [openFaq, setOpenFaq] = useState(null)
  const [chatMsg, setChatMsg] = useState('')
  const [chatHistory, setChatHistory] = useState([])

  function sendChat() {
    if (!chatMsg.trim()) return
    const userMsg = chatMsg
    setChatMsg('')
    setChatHistory(h => [...h, { role: 'user', text: userMsg }])
    const lower = userMsg.toLowerCase()
    const match = allQA.find(item =>
      item.q.toLowerCase().split(' ').some(word => word.length > 2 && lower.includes(word))
    )
    const reply = match ? match.a : 'I could not find a specific answer. Reach us on WhatsApp at +1 (809) 431-0366 or email support@flashenter.com!'
    setTimeout(() => { setChatHistory(h => [...h, { role: 'assistant', text: reply }]) }, 400)
  }

  function closeHelp() { setShowHelp(false); setHelpSection('home'); setOpenFaq(null) }

  return (
    <div style={{ background: '#F5F4F1', fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      {showHelp && (
        <div onClick={closeHelp} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 28, width: 580, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {helpSection !== 'home' && (
                  <button onClick={() => setHelpSection('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#888780' }}>←</button>
                )}
                <div style={{ fontSize: 17, fontWeight: 700 }}>
                  {helpSection === 'home' && 'Help Center'}
                  {helpSection === 'faq' && 'FAQ'}
                  {helpSection === 'va-guide' && 'VA Portal Guide'}
                  {helpSection === 'client-guide' && 'Client Portal Guide'}
                  {helpSection === 'chat' && 'Ask a question'}
                </div>
              </div>
              <button onClick={closeHelp} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888780' }}>x</button>
            </div>

            {helpSection === 'home' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { emoji: '❓', title: 'FAQ', desc: 'Answers to the most common questions.', action: () => setHelpSection('faq') },
                  { emoji: '🔗', title: 'VA Portal Guide', desc: 'How VAs submit hours and sign contracts.', action: () => setHelpSection('va-guide') },
                  { emoji: '👥', title: 'Client Portal Guide', desc: 'How clients sign contracts and manage holidays.', action: () => setHelpSection('client-guide') },
                  { emoji: '💬', title: 'Ask a question', desc: 'Search our knowledge base for instant help.', action: () => setHelpSection('chat') },
                  { emoji: '📋', title: 'Quick Start Guide', desc: 'Download our PDF guide to get started in minutes.', action: () => window.open('https://flashenter.com/quick-start', '_blank') },{ emoji: '🎥', title: 'Video Tutorials', desc: 'Coming soon.', action: null },
                  { emoji: '📧', title: 'Contact Support', desc: 'support@flashenter.com - click to copy!', action: () => { navigator.clipboard.writeText('support@flashenter.com'); alert('Email copied!') } },
                  { emoji: '📱', title: 'WhatsApp Support', desc: 'Message us on WhatsApp for urgent help.', action: () => window.open('https://wa.me/18094310366', '_blank') },
                ].map(item => (
                  <div key={item.title} onClick={item.action || undefined} style={{ padding: '12px 16px', background: '#F5F4F1', borderRadius: 12, cursor: item.action ? 'pointer' : 'default', display: 'flex', alignItems: 'center', gap: 12, border: item.action ? '0.5px solid rgba(83,74,183,0.2)' : 'none' }}>
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{item.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: '#5F5E5A' }}>{item.desc}</div>
                    </div>
                    {item.action && <div style={{ color: '#534AB7', fontSize: 16 }}>→</div>}
                  </div>
                ))}
              </div>
            )}

            {helpSection === 'faq' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderRadius: 12, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '12px 16px', background: openFaq === i ? '#EEEDFE' : '#F5F4F1', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-sans)', textAlign: 'left' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: openFaq === i ? '#534AB7' : '#1a1a18' }}>{faq.q}</span>
                      {openFaq === i ? <ChevronUp size={14} color='#534AB7' /> : <ChevronDown size={14} color='#888780' />}
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '12px 16px', background: '#fff', fontSize: 13, color: '#5F5E5A', lineHeight: 1.6 }}>{faq.a}</div>
                    )}
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: '14px 16px', background: '#EEEDFE', borderRadius: 12, textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Still have questions?</div>
                  <button onClick={() => setHelpSection('chat')} style={{ fontSize: 12, color: '#534AB7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>Search our knowledge base →</button>
                </div>
              </div>
            )}

            {helpSection === 'va-guide' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {vaGuide.map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#F5F4F1', borderRadius: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#534AB7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
                    <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div><div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.5 }}>{item.desc}</div></div>
                  </div>
                ))}
              </div>
            )}

            {helpSection === 'client-guide' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {clientGuide.map(item => (
                  <div key={item.step} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: '#F5F4F1', borderRadius: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#534AB7', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{item.step}</div>
                    <div><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div><div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.5 }}>{item.desc}</div></div>
                  </div>
                ))}
              </div>
            )}

            {helpSection === 'chat' && (
              <div>
                <div style={{ minHeight: 200, maxHeight: 300, overflowY: 'auto', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {chatHistory.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 40, color: '#888780', fontSize: 13 }}>Type a question and I will search our knowledge base for you!</div>
                  )}
                  {chatHistory.map((msg, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '80%', padding: '10px 14px', borderRadius: 12, background: msg.role === 'user' ? '#534AB7' : '#F5F4F1', color: msg.role === 'user' ? '#fff' : '#1a1a18', fontSize: 13, lineHeight: 1.5 }}>{msg.text}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder='e.g. How do I approve a timesheet?' style={{ flex: 1, padding: '10px 14px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', fontFamily: 'var(--font-sans)' }} />
                  <button onClick={sendChat} style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#534AB7', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Send size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <header style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowUserMenu(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 40, padding: '4px 12px 4px 4px', cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--purple-50)', color: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{user?.name?.slice(0,2).toUpperCase() || 'JR'}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18', lineHeight: 1.2 }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: 10, color: '#888780' }}>{user?.email || 'Admin'}</div>
            </div>
          </button>
          {showUserMenu && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', minWidth: 180, zIndex: 100, overflow: 'hidden' }}>
              {['Profile & settings', 'Sign out'].map(item => (
                <button key={item} onClick={() => { setShowUserMenu(false); if (item === 'Sign out') onLogout() }} style={{ width: '100%', padding: '10px 14px', fontSize: 12, color: item === 'Sign out' ? 'var(--red-600)' : '#1a1a18', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{item}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}><span style={{ color: 'var(--purple-600)' }}>Flash</span>enter</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setShowHelp(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 40, padding: '6px 14px', cursor: 'pointer', fontSize: 12, color: '#888780', fontFamily: 'var(--font-sans)' }}>
            <HelpCircle size={13} /><span>Help</span>
          </button>
          <div style={{ position: 'relative' }}>
            <button style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Bell size={15} color='#5F5E5A' /></button>
            <span style={{ position: 'absolute', top: 3, right: 3, width: 7, height: 7, borderRadius: '50%', background: 'var(--red-400)', border: '1.5px solid #fff' }} />
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 100px' }}>{children}</main>

      <ChatWidget fromName={user?.name} fromType='admin' />

      <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#534AB7', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 60, padding: '5px 8px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          {navItems.map((item, i) => {
            if (item === null) return <div key={i} style={{ width: 0.5, height: 28, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 10px', borderRadius: 50, border: 'none', cursor: 'pointer', background: active ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
                <div style={{ position: 'relative' }}>
                <Icon size={16} color='#fff' strokeWidth={active ? 2.5 : 1.8} />
                {item.badge && unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #534AB7' }} />
                )}
              </div>
                <span style={{ fontSize: 9, color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: active ? 600 : 400, opacity: active ? 1 : 0.8 }}>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}