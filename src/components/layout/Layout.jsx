import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Star, Briefcase, Clock, Wallet,
  FileText, Globe, Settings, BookUser, UserCheck, Bell, Search, ChevronDown, Mail
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Clients', path: '/contacts' },
  { icon: Star, label: 'Leads', path: '/leads' },
  { icon: Briefcase, label: 'Deals', path: '/deals' },
  null,
  { icon: BookUser, label: 'VA Pool', path: '/va-pool' },
  { icon: UserCheck, label: 'Onboarding', path: '/onboarding', alert: true },
  { icon: Clock, label: 'Timesheets', path: '/timesheets', badge: true },
   { icon: Wallet, label: 'Payroll', path: '/payroll', urgent: true },{ icon: FileText, label: 'Invoices', path: '/invoices' },
  null,
  { icon: Globe, label: 'Markets', path: '/markets' },
  { icon: Settings, label: 'Settings', path: '/settings' },{ icon: Users, label: 'Team', path: '/team' },{ icon: Mail, label: 'Inbox', path: '/inbox' },
]

export default function Layout({ children, user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F4F1', fontFamily: 'var(--font-sans)' }}>

      {/* Topbar */}
      <header style={{
        background: '#fff',
        borderBottom: '0.5px solid rgba(0,0,0,0.08)',
        padding: '10px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Left — user profile */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)',
              borderRadius: 40, padding: '4px 12px 4px 4px', cursor: 'pointer',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--purple-50)', color: 'var(--purple-600)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 600,
            }}>JR</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a18', lineHeight: 1.2 }}>{user?.name || 'Admin'}</div><button onClick={onLogout} style={{ fontSize: 10, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginTop: 2 }}>Sign out</button>
              <div style={{ fontSize: 10, color: '#888780' }}>{user?.email || 'Admin'}</div>
            </div>
            <ChevronDown size={12} color="#888780" />
          </button>
          {showUserMenu && (
            <div className="animate-slide-down" style={{
              position: 'absolute', top: 'calc(100% + 8px)', left: 0,
             background: '#534AB7', border: '0.5px solid rgba(0,0,0,0.1)',
              borderRadius: 12, padding: '6px', minWidth: 180,
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            }}>
              {['Profile & settings', 'Switch workspace', 'Sign out'].map(item => (
                <div key={item} onClick={() => setShowUserMenu(false)} style={{
                  padding: '8px 12px', fontSize: 12, color: '#fff',
                  borderRadius: 8, cursor: 'pointer',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F5F4F1'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >{item}</div>
              ))}
            </div>
          )}
        </div>

        {/* Center — logo */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.5px', color: '#1a1a18' }}>
            <span style={{ color: 'var(--purple-600)' }}>Flash</span>enter
          </span>
        </div>

        {/* Right — search + bell */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)',
            borderRadius: 40, padding: '6px 14px', cursor: 'pointer',
            fontSize: 12, color: '#888780',
          }}>
            <Search size={13} />
            <span>Search...</span>
            <span style={{ fontSize: 10, background: '#e8e7e4', padding: '1px 6px', borderRadius: 4, color: '#5F5E5A' }}>⌘K</span>          </div>
          <div style={{ position: 'relative' }}>
            <button style={{
              width: 34, height: 34, borderRadius: '50%',
              background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}>
              <Bell size={15} color="#5F5E5A" />
            </button>
            <span style={{
              position: 'absolute', top: 3, right: 3,
              width: 7, height: 7, borderRadius: '50%',
              background: 'var(--red-400)', border: '1.5px solid #fff',
            }} />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, padding: '24px 28px 100px' }}>
        {children}
      </main>

      {/* Floating bottom nav */}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100,
      }}>
        <nav style={{
          display: 'flex', alignItems: 'center', gap: 2,
         background: '#534AB7', border: '0.5px solid rgba(0,0,0,0.1)',
          borderRadius: 60, padding: '5px 8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.09)',
        }}>
          {navItems.map((item, i) => {
            if (item === null) return (
              <div key={i} style={{ width: 0.5, height: 28, background: 'rgba(0,0,0,0.08)', margin: '0 4px' }} />
            )
            const active = location.pathname === item.path
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  padding: '7px 11px', borderRadius: 50, cursor: 'pointer', border: 'none',
                  background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  minWidth: 50, position: 'relative',
                  transition: 'background 0.15s',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <Icon size={16} color='#fff' strokeWidth={active ? 2.2 : 1.8} />
                  {(item.badge || item.urgent || item.alert) && (
                    <span style={{
                      position: 'absolute', top: -3, right: -3,
                      width: 6, height: 6, borderRadius: '50%',
                      background: item.urgent ? 'var(--red-400)' : 'var(--purple-600)',
                      border: '1.5px solid #fff',
                    }} />
                  )}
                </div>
                <span style={{
                  fontSize: 9, whiteSpace: 'nowrap',
                  color: '#fff',
                  fontWeight: active ? 600 : 400,
                }}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
