import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import VAPool from './pages/VAPool'
import Onboarding from './pages/Onboarding'
import Timesheets from './pages/Timesheets'
import Payroll from './pages/Payroll'
import { Leads, Deals, Markets, Settings, Invoices } from './pages/Placeholders'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('flashenter_user')
    if (saved) setUser(JSON.parse(saved))
  }, [])

  function handleLogin(user) {
    setUser(user)
  }

  function handleLogout() {
    localStorage.removeItem('flashenter_user')
    setUser(null)
  }

  if (!user) return <Login onLogin={handleLogin} />

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}