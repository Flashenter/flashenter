import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import Layout from './components/layout/Layout'
import Dashboard     from './pages/Dashboard'
import Contacts      from './pages/Contacts'
import ContactDetail from './pages/ContactDetail'
import VAPool        from './pages/VAPool'
import Onboarding    from './pages/Onboarding'
import Timesheets    from './pages/Timesheets'
import Payroll       from './pages/Payroll'
import { Leads, Deals, Markets, Settings, Invoices } from './pages/Placeholders'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function ClerkWithRouter() {
  const navigate = useNavigate()
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <SignedOut>
        <RedirectToSignIn />
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
    </ClerkProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ClerkWithRouter />
    </BrowserRouter>
  )
}