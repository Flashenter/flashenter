import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import VAPool from './pages/VAPool'
import VAPortal from './pages/VAPortal'
import Onboarding from './pages/Onboarding'
import Timesheets from './pages/Timesheets'
import Payroll from './pages/Payroll'
import { Leads, Deals, Markets, Settings, Invoices } from './pages/Placeholders'

export default function App() {
  const [user, setUser] = useState(null)

  if (!user) return <Login onLogin={setUser} />

  return (
    <BrowserRouter>
      <Layout user={user} onLogout={() => setUser(null)}>
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
          <Route path="/va-portal/:id" element={<VAPortal />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}