import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Star, Briefcase, Clock, Wallet,
  FileText, Globe, Settings, BookUser, UserCheck, Bell, HelpCircle, Mail
} from 'lucide-react'

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
  { icon: Mail, label: 'Inbox', path: '/inbox' },
]

const helpItems = [
  { emoji: '📋', title: 'Quick Start Guide', desc: 'Learn how to add clients, assign VAs, and run your first payroll in under 10 minutes.', link: null },
  { emoji: '❓', title: 'FAQ', desc: 'Common questions about timesheets, contracts, portals and payroll.', link: null },
  { emoji: '📧', title: 'Contact Support', desc: 'Click to email our support team directly.', link: 'mailto:support@flashenter.com' },
  { emoji: '💬', title: 'WhatsApp Support', desc: 'Click to message us on WhatsApp for urgent help.', link: 'https://wa.me/18095550123' },
  { emoji: '🎥', title: 'Video Tutorials', desc: 'Watch step-by-step guides for every feature. Coming soon!', link: null },
  { emoji: '🔗', title: 'VA Portal Guide', desc: 'Share portal links with your VAs from the VA Pool page.', link: null },
  { emoji: '👥', title: 'Client Portal Guide', desc: 'Share portal links with clients from the Clients page.', link: null },
]

export default function Layout({ children, user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div style={{ background: '#F5F4F1', fontFamily: 'var(--font-sans)', minHeight: '100vh' }}>

      {/* Help Panel */}
      {showHelp && (
        <div onClick={() => setShowHelp(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 32, width: 560, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Help Center</div>
              <button onClick={() => setShowHelp(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888780' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {helpItems.map(item => (
                <div key={item.title}
                  onClick={() => item.link && (window.location.href = item.link)}
                  style={{ padding: '14px 16px', background: '#F5F4F1', borderRadius: 12, cursor: item.link ? 'pointer' : 'default', border: item.link ? '0.5px solid #AFA9EC' : '0.5px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 22 }}>{item.emoji}</div>
                    {item.link && <span style={{ fontSize: 11, color: '#534AB7', fontWeight: 600 }}>Open →</span>}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, marginTop: 6 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>

        {/* Left — user profile */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowUserMenu(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 40, padding: '4px 12px 4px 4px', cursor: 'pointer' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--purple-50)', color: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>
              {user?.name?.slice(0,2).toUpperCase() || 'JR'}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18', lineHeight: 1.2 }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: 10, color: '#888780' }}>{user?.email || 'Admin'}</div>
            </div>
          </button>
          {showUserMenu && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 6, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 12, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', minWidth: 180, zIndex: 100, overflow: 'hidden' }}>
              {['Profile & settings', 'Switch workspace', 'Sign out'].map(item => (
                <button key={item} onClick={() => { setShowUserMenu(false); if (item === 'Sign out') onLogout() }}
                  style={{ width: '100%', padding: '10px 14px', fontSize: 12, color: item === 'Sign out' ? 'var(--red-600)' : '#1a1a18', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Center — logo */}
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>
          <span style={{ color: 'var(--purple-600)' }}>Flash</span>enter
        </div>

        {/* Right — help + bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setShowHelp(true)} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 40, padding: '6px 14px', cursor: 'pointer', fontSize: 12, color: '#888780', fontFamily: 'var(--font-sans)' }}>
            <HelpCircle size={13} />
            <span>Help</span>
          </button>
          <div style={{ position: 'relative' }}>
            <button style={{ width: 34, height: 34, borderRadius: '50%', background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Bell size={15} color="#5F5E5A" />
            </button>
            <span style={{ position: 'absolute', top: 3, right: 3, width: 7, height: 7, borderRadius: '50%', background: 'var(--red-400)', border: '1.5px solid #fff' }} />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 100px' }}>
        {children}
      </main>

      {/* Floating bottom nav */}
      <div style={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#534AB7', border: '0.5px solid rgba(255,255,255,0.2)', borderRadius: 60, padding: '5px 8px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
          {navItems.map((item, i) => {
            if (item === null) return (
              <div key={i} style={{ width: 0.5, height: 28, background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
            )
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 10px', borderRadius: 50, border: 'none', cursor: 'pointer', background: active ? 'rgba(255,255,255,0.2)' : 'transparent' }}>
                <Icon size={16} color="#fff" strokeWidth={active ? 2.5 : 1.8} />
                <span style={{ fontSize: 9, color: '#fff', fontFamily: 'var(--font-sans)', fontWeight: active ? 600 : 400, opacity: active ? 1 : 0.8 }}>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}