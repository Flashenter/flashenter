import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import VAPool from './pages/VAPool'
import VAPortal from './pages/VAPortal'
import ClientPortal from './pages/ClientPortal'
import Onboarding from './pages/Onboarding'
import Timesheets from './pages/Timesheets'
import Payroll from './pages/Payroll'
import { Leads, Deals, Markets, Settings, Invoices } from './pages/Placeholders'
import { supabase } from './lib/supabase'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [pendingApproval, setPendingApproval] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) checkUser(session.user)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) checkUser(session.user)
      else { setUser(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function checkUser(authUser) {
    const { data: member } = await supabase
      .from('team_members')
      .select('*')
      .eq('email', authUser.email)
      .single()

    if (!member) {
      await supabase.from('team_members').insert([{
        email: authUser.email,
        name: authUser.user_metadata?.full_name || authUser.email,
        avatar_url: authUser.user_metadata?.avatar_url,
        approved: false
      }])
      setPendingApproval(true)
      setLoading(false)
    } else if (!member.approved) {
      setPendingApproval(true)
      setLoading(false)
    } else {
      setUser({ name: member.name, email: member.email, role: member.role, avatar: member.avatar_url })
      setPendingApproval(false)
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1' }}>
      <div style={{ fontSize: 14, color: '#888780' }}>Loading Flashenter...</div>
    </div>
  )

  if (pendingApproval) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1' }}>
      <div style={{ width: 380, background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}><span style={{ color: '#534AB7' }}>Flash</span>enter</div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Awaiting approval</div>
        <div style={{ fontSize: 13, color: '#888780', lineHeight: 1.6, marginBottom: 24 }}>Your account has been registered. An admin needs to approve your access before you can log in.</div>
        <button onClick={handleLogout} style={{ padding: '10px 24px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.1)', background: '#F5F4F1', fontSize: 13, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Sign out
        </button>
      </div>
    </div>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/va-portal/:id" element={<VAPortal />} />
        <Route path="/client-portal/:id" element={<ClientPortal />} />
        <Route path="*" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/contacts/:id" element={<ContactDetail />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/va-pool" element={<VAPool />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/timesheets" element={<Timesheets />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/markets" element={<Markets />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          ) : (
            <Login />
          )
        } />
      </Routes>
    </BrowserRouter>
  )
}