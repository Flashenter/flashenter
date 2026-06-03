import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import Layout from './components/layout/Layout'
import Dashboard     from './pages/Dashboard'
import Contacts      from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import VAPool        from './pages/VAPool'
import Onboarding    from './pages/Onboarding'
import Timesheets    from './pages/Timesheets'
import Payroll       from './pages/Payroll'
import { Leads, Deals, Markets, Settings, Invoices } from './pages/Placeholders'

export default function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', background: '#F5F4F1',
          fontFamily: 'var(--font-sans)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
              <span style={{ color: '#534AB7' }}>Flash</span>enter
            </div>
            <div style={{ fontSize: 13, color: '#888780', marginBottom: 32 }}>
              One platform · One team · One price
            </div>
            <SignIn />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/"              element={<Dashboard />}     />
            <Route path="/contacts"      element={<Contacts />}      />
            <Route path="/contacts/:id"  element={<ContactDetail />} />
            <Route path="/leads"         element={<Leads />}         />
            <Route path="/deals"         element={<Deals />}         />
            <Route path="/va-pool"       element={<VAPool />}        />
            <Route path="/onboarding"    element={<Onboarding />}    />
            <Route path="/timesheets"    element={<Timesheets />}    />
            <Route path="/payroll"       element={<Payroll />}       />
            <Route path="/invoices"      element={<Invoices />}      />
            <Route path="/markets"       element={<Markets />}       />
            <Route path="/settings"      element={<Settings />}      />
          </Routes>
        </Layout>
      </SignedIn>
    </BrowserRouter>
  )
}