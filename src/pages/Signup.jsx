import { useState } from 'react'
import { supabase } from '../lib/supabase'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 0,
    annualPrice: 0,
    color: '#888780',
    features: ['1 admin user', '1 VA', 'Client portal', 'VA portal', 'Timesheets', 'Community support'],
  },
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 39.99,
    annualPrice: 399.90,
    regularMonthly: 49.99,
    limited: true,
    color: '#534AB7',
    features: ['Up to 3 VAs', '2 admin users', 'Client portal', 'VA portal', 'Timesheets & payroll', 'Contract signing', 'Email support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 89.99,
    annualPrice: 899.90,
    regularMonthly: 99.99,
    limited: true,
    popular: true,
    color: '#534AB7',
    features: ['Up to 10 VAs', '5 admin users', 'Everything in Starter', 'Holiday management', 'OT approvals', 'Markets analytics', 'Priority support'],
  },
  {
    id: 'elite',
    name: 'Elite',
    monthlyPrice: 189.99,
    annualPrice: 1899.90,
    regularMonthly: 199.99,
    limited: true,
    color: '#534AB7',
    features: ['Unlimited VAs', 'Unlimited users', 'Everything in Pro', 'Custom domain', 'Dedicated account manager', 'API access', 'White label option'],
  },
]

export default function Signup() {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [billing, setBilling] = useState('monthly')
  const [form, setForm] = useState({ company: '', email: '', name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSignup() {
    if (!form.company || !form.email || !form.name) return setError('Please fill in all fields')
    setLoading(true)
    setError('')

    const { data: existing } = await supabase.from('organizations').select('id').eq('email', form.email).single()
    if (existing) {
      setError('An account with this email already exists')
      setLoading(false)
      return
    }

    const { data: org, error: orgError } = await supabase.from('organizations').insert([{
      name: form.company,
      email: form.email,
      owner_email: form.email,
      plan: selectedPlan,
      status: 'trial'
    }]).select().single()

    if (orgError) {
      setError('Error creating account: ' + orgError.message)
      setLoading(false)
      return
    }

    await supabase.from('team_members').insert([{
      email: form.email,
      name: form.name,
      role: 'admin',
      approved: true,
      org_id: org.id
    }])

    setSuccess(true)
    setLoading(false)
  }

  const currentPlan = plans.find(p => p.id === selectedPlan)

  if (success) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ width: 440, background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}><span style={{ color: '#534AB7' }}>Flash</span>enter</div>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Welcome to Flashenter!</div>
        <div style={{ fontSize: 13, color: '#888780', lineHeight: 1.6, marginBottom: 24 }}>
          Your account has been created. Sign in with Google using <strong>{form.email}</strong> to get started.
        </div>
        <a href="/" style={{ display: 'block', padding: '12px', borderRadius: 40, background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', textDecoration: 'none' }}>
          Go to Flashenter →
        </a>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F5F4F1', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ background: '#fff', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>
          <span style={{ color: '#534AB7' }}>Flash</span>enter
        </div>
        <a href="/" style={{ fontSize: 13, color: '#534AB7', textDecoration: 'none', fontWeight: 500 }}>Already have an account? Sign in →</a>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Start managing your VA team today</div>
          <div style={{ fontSize: 15, color: '#888780', marginBottom: 24 }}>7-day free trial · No credit card required</div>

          <div style={{ display: 'inline-flex', background: '#fff', borderRadius: 40, padding: 4, border: '0.5px solid rgba(0,0,0,0.08)', gap: 4 }}>
            <button onClick={() => setBilling('monthly')} style={{
              padding: '8px 20px', borderRadius: 40, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: billing === 'monthly' ? 600 : 400,
              background: billing === 'monthly' ? '#534AB7' : 'transparent',
              color: billing === 'monthly' ? '#fff' : '#5F5E5A',
              fontFamily: 'DM Sans, sans-serif'
            }}>Monthly</button>
            <button onClick={() => setBilling('annual')} style={{
              padding: '8px 20px', borderRadius: 40, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: billing === 'annual' ? 600 : 400,
              background: billing === 'annual' ? '#534AB7' : 'transparent',
              color: billing === 'annual' ? '#fff' : '#5F5E5A',
              fontFamily: 'DM Sans, sans-serif',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              Annual
              <span style={{ fontSize: 10, background: '#EAF3DE', color: '#3B6D11', padding: '2px 7px', borderRadius: 20, fontWeight: 600 }}>2 months free</span>
            </button>
          </div>
        </div>

        {step === 1 && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 32 }}>
              {plans.map(plan => (
                <div key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  style={{ background: '#fff', borderRadius: 16, padding: 22, border: selectedPlan === plan.id ? '2px solid #534AB7' : '0.5px solid rgba(0,0,0,0.08)', cursor: 'pointer', position: 'relative' }}>
                  {plan.popular && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#534AB7', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      Most popular
                    </div>
                  )}
                  {plan.limited && (
                    <div style={{ background: '#FAEEDA', color: '#854F0B', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginBottom: 6 }}>
                      🔥 Limited time offer
                    </div>
                  )}
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{plan.name}</div>
                  {plan.monthlyPrice === 0 ? (
                    <div style={{ fontSize: 26, fontWeight: 700, color: '#534AB7', marginBottom: 4 }}>Free</div>
                  ) : (
                    <div style={{ marginBottom: 4 }}>
                      {plan.limited && (
                        <div style={{ fontSize: 12, color: '#B4B2A9', textDecoration: 'line-through' }}>
                          ${billing === 'monthly' ? plan.regularMonthly : (plan.regularMonthly * 10).toFixed(2)}
                        </div>
                      )}
                      <div style={{ fontSize: 26, fontWeight: 700, color: '#534AB7' }}>
                        ${billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                        <span style={{ fontSize: 12, color: '#888780', fontWeight: 400 }}>
                          {billing === 'monthly' ? '/mo' : '/yr'}
                        </span>
                      </div>
                      {billing === 'annual' && (
                        <div style={{ fontSize: 11, color: '#3B6D11' }}>
                          ${(plan.monthlyPrice).toFixed(2)}/mo · 2 months free!
                        </div>
                      )}
                    </div>
                  )}
                  <div style={{ height: '0.5px', background: 'rgba(0,0,0,0.06)', margin: '12px 0' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 11, color: '#5F5E5A' }}>
                        <span style={{ color: '#534AB7', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                  {selectedPlan === plan.id && (
                    <div style={{ marginTop: 14, padding: '6px', borderRadius: 8, background: '#EEEDFE', color: '#534AB7', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>
                      Selected ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => setStep(2)}
                style={{ padding: '13px 40px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                Continue with {currentPlan?.name} plan →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 20, padding: 40, boxShadow: '0 4px 40px rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Create your account</div>
            <div style={{ fontSize: 13, color: '#888780', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>{currentPlan?.name} · {billing === 'monthly' ? `$${currentPlan?.monthlyPrice}/mo` : `$${currentPlan?.annualPrice}/yr`}</span>
              <span onClick={() => setStep(1)} style={{ color: '#534AB7', cursor: 'pointer' }}>Change →</span>
            </div>

            {error && (
              <div style={{ background: '#FCEBEB', border: '0.5px solid #F09595', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 12, color: '#791F1F' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {[
                { key: 'company', label: 'Company name *', placeholder: 'e.g. Acme Corp' },
                { key: 'name', label: 'Your full name *', placeholder: 'e.g. James Rivera' },
                { key: 'email', label: 'Work email *', placeholder: 'you@company.com' },
              ].map(f => (
                <div key={f.key}>
                  <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>{f.label}</div>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'DM Sans, sans-serif' }} />
                </div>
              ))}
            </div>

            <button onClick={handleSignup} disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Start 7-day free trial →'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 11, color: '#B4B2A9', lineHeight: 1.6 }}>
              By signing up you agree to our Terms of Service.<br />
              7-day free trial. No credit card required.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}