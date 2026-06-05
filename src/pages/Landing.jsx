import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const features = [
  { emoji: '👥', title: 'Client & Lead CRM', desc: 'Track every client, lead and deal across all your markets in one place. Full contact history, notes and reminders.' },
  { emoji: '🌍', title: 'Global VA Pool', desc: 'Build and manage your talent pool across Philippines, South Africa, Colombia, Panama and more.' },
  { emoji: '📋', title: 'Timesheets & Payroll', desc: 'VAs submit hours directly through their portal. You approve and run payroll in one click.' },
  { emoji: '✍️', title: 'Contract Signing', desc: 'Send contracts to clients and VAs. They sign digitally from any device. No DocuSign needed.' },
  { emoji: '📅', title: 'Holiday & OT Management', desc: 'Clients submit holiday dates and approve overtime directly through their own portal.' },
  { emoji: '📊', title: 'Markets Analytics', desc: 'Track performance across every country you operate in. See clients, VAs and revenue by market.' },
]

const testimonials = [
  { name: 'Sarah M.', role: 'CEO, TechStart Inc.', text: 'Flashenter completely transformed how we manage our VA team. Everything in one place finally!', country: '🇺🇸' },
  { name: 'David K.', role: 'Operations Director', text: 'The client portal alone saved us hours every week. Our clients love being able to sign contracts digitally.', country: '🇬🇧' },
  { name: 'Maria L.', role: 'Founder, RemoteFirst', text: 'We went from spreadsheets to a professional platform in one day. Incredible value for the price.', country: '🇦🇺' },
]

const plans = [
  { id: 'basic', name: 'Basic', price: 'Free', desc: 'Perfect for solo operators', features: ['1 VA', '1 admin', 'Client portal', 'VA portal', 'Timesheets'] },
  { id: 'starter', name: 'Starter', price: '$39.99', period: '/mo', regular: '$49.99', desc: 'Small teams getting started', features: ['3 VAs', '2 admins', 'Everything in Basic', 'Payroll', 'Contract signing'], limited: true },
  { id: 'pro', name: 'Pro', price: '$89.99', period: '/mo', regular: '$99.99', desc: 'Growing VA businesses', features: ['10 VAs', '5 admins', 'Everything in Starter', 'Holiday management', 'OT approvals', 'Priority support'], popular: true, limited: true },
  { id: 'elite', name: 'Elite', price: '$189.99', period: '/mo', regular: '$199.99', desc: 'Enterprise VA operations', features: ['Unlimited VAs', 'Unlimited admins', 'Everything in Pro', 'Custom domain', 'API access', 'White label'], limited: true },
]

const markets = [
  { flag: '🇵🇭', name: 'Philippines' },
  { flag: '🇿🇦', name: 'South Africa' },
  { flag: '🇩🇴', name: 'Dom. Republic' },
  { flag: '🇨🇴', name: 'Colombia' },
  { flag: '🇵🇦', name: 'Panama' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇲🇽', name: 'Mexico' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')

  return (
    <div style={{ fontFamily: 'DM Sans, sans-serif', background: '#fff', color: '#1a1a18' }}>

      {/* Nav */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '14px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 22, fontWeight: 700 }}>
          <span style={{ color: '#534AB7' }}>Flash</span>enter
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none' }}>Features</a>
          <a href="#pricing" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none' }}>Pricing</a>
          <a href="#markets" style={{ fontSize: 13, color: '#5F5E5A', textDecoration: 'none' }}>Markets</a>
          <button onClick={() => navigate('/login')} style={{ fontSize: 13, color: '#534AB7', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}>Sign in</button>
          <button onClick={() => navigate('/signup')} style={{ fontSize: 13, fontWeight: 600, color: '#fff', background: '#534AB7', border: 'none', borderRadius: 40, padding: '9px 20px', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Start free trial</button>
        </div>
      </div>

      {/* Hero */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#EEEDFE', borderRadius: 40, padding: '5px 14px', fontSize: 12, color: '#534AB7', fontWeight: 600, marginBottom: 24 }}>
          🚀 Now live · 7-day free trial
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15, marginBottom: 20, letterSpacing: '-1px' }}>
          The VA management platform<br />
          <span style={{ color: '#534AB7' }}>built for global teams</span>
        </h1>
        <p style={{ fontSize: 18, color: '#5F5E5A', lineHeight: 1.7, maxWidth: 600, margin: '0 auto 36px' }}>
          Manage your virtual assistants, clients, timesheets, payroll and contracts — all in one place. Built for companies with remote teams across multiple countries.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/signup')} style={{ padding: '14px 32px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Start free trial →
          </button>
          <button onClick={() => navigate('/signup')} style={{ padding: '14px 32px', borderRadius: 40, border: '0.5px solid rgba(0,0,0,0.15)', background: '#fff', color: '#1a1a18', fontSize: 15, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            View pricing
          </button>
        </div>
        <div style={{ fontSize: 12, color: '#B4B2A9', marginTop: 16 }}>No credit card required · 7-day free trial · Cancel anytime</div>
      </div>

      {/* Stats */}
      <div style={{ background: '#F5F4F1', padding: '40px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, textAlign: 'center' }}>
          {[
            { value: '7+', label: 'Countries supported' },
            { value: '10min', label: 'Setup time' },
            { value: '100%', label: 'Web based' },
            { value: '24/7', label: 'Portal access' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 32, fontWeight: 700, color: '#534AB7' }}>{s.value}</div>
              <div style={{ fontSize: 13, color: '#888780', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div id="features" style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ fontSize: 13, color: '#534AB7', fontWeight: 600, marginBottom: 10 }}>EVERYTHING YOU NEED</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>One platform for your entire VA operation</h2>
          <p style={{ fontSize: 16, color: '#5F5E5A', maxWidth: 560, margin: '0 auto' }}>Stop juggling spreadsheets, WhatsApp groups and email chains. Flashenter brings everything together.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {features.map(f => (
            <div key={f.title} style={{ padding: 28, background: '#F5F4F1', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: '#534AB7', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#AFA9EC', fontWeight: 600, marginBottom: 10 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, color: '#fff', marginBottom: 48 }}>Up and running in minutes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
            {[
              { step: '1', title: 'Sign up', desc: 'Create your account and choose your plan' },
              { step: '2', title: 'Add your team', desc: 'Import your VAs and clients into the platform' },
              { step: '3', title: 'Send portals', desc: 'Share unique links with each VA and client' },
              { step: '4', title: 'Run your business', desc: 'Approve timesheets, run payroll, manage contracts' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 18, fontWeight: 700, color: '#fff' }}>{s.step}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#AFA9EC', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Markets */}
      <div id="markets" style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: '#534AB7', fontWeight: 600, marginBottom: 10 }}>GLOBAL REACH</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Built for international VA teams</h2>
          <p style={{ fontSize: 16, color: '#5F5E5A' }}>Manage VAs across multiple countries and timezones with ease</p>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {markets.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#F5F4F1', borderRadius: 40, fontSize: 14 }}>
              <span style={{ fontSize: 22 }}>{m.flag}</span>
              <span style={{ fontWeight: 500 }}>{m.name}</span>
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#EEEDFE', borderRadius: 40, fontSize: 14, color: '#534AB7', fontWeight: 500 }}>
            + More coming
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ background: '#F5F4F1', padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 13, color: '#534AB7', fontWeight: 600, marginBottom: 10 }}>TESTIMONIALS</div>
            <h2 style={{ fontSize: 36, fontWeight: 700 }}>Loved by VA businesses worldwide</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {testimonials.map(t => (
              <div key={t.name} style={{ background: '#fff', borderRadius: 16, padding: 28, border: '0.5px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontSize: 24, marginBottom: 16 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ fontSize: 14, color: '#5F5E5A', lineHeight: 1.7, marginBottom: 20 }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{t.country}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: '#888780' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" style={{ maxWidth: 960, margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: '#534AB7', fontWeight: 600, marginBottom: 10 }}>PRICING</div>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12 }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: 16, color: '#5F5E5A', marginBottom: 24 }}>Start free, scale as you grow</p>
          <div style={{ display: 'inline-flex', background: '#F5F4F1', borderRadius: 40, padding: 4, gap: 4 }}>
            <button onClick={() => setBilling('monthly')} style={{ padding: '8px 20px', borderRadius: 40, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: billing === 'monthly' ? 600 : 400, background: billing === 'monthly' ? '#534AB7' : 'transparent', color: billing === 'monthly' ? '#fff' : '#5F5E5A', fontFamily: 'DM Sans, sans-serif' }}>Monthly</button>
            <button onClick={() => setBilling('annual')} style={{ padding: '8px 20px', borderRadius: 40, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: billing === 'annual' ? 600 : 400, background: billing === 'annual' ? '#534AB7' : 'transparent', color: billing === 'annual' ? '#fff' : '#5F5E5A', fontFamily: 'DM Sans, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
              Annual <span style={{ fontSize: 10, background: '#EAF3DE', color: '#3B6D11', padding: '2px 7px', borderRadius: 20, fontWeight: 600 }}>2 months free</span>
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: plan.popular ? '#534AB7' : '#F5F4F1', borderRadius: 16, padding: 24, position: 'relative', border: plan.popular ? 'none' : '0.5px solid rgba(0,0,0,0.08)' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#EF9F27', color: '#fff', fontSize: 10, fontWeight: 600, padding: '3px 12px', borderRadius: 20, whiteSpace: 'nowrap' }}>Most popular</div>
              )}
              {plan.limited && (
                <div style={{ background: plan.popular ? 'rgba(255,255,255,0.15)' : '#FAEEDA', color: plan.popular ? '#fff' : '#854F0B', fontSize: 9, fontWeight: 600, padding: '2px 8px', borderRadius: 20, display: 'inline-block', marginBottom: 8 }}>Limited time offer</div>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: plan.popular ? '#fff' : '#1a1a18' }}>{plan.name}</div>
              <div style={{ fontSize: 12, color: plan.popular ? 'rgba(255,255,255,0.7)' : '#888780', marginBottom: 12 }}>{plan.desc}</div>
              {plan.price === 'Free' ? (
                <div style={{ fontSize: 28, fontWeight: 700, color: plan.popular ? '#fff' : '#534AB7', marginBottom: 16 }}>Free</div>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  {plan.limited && <div style={{ fontSize: 12, color: plan.popular ? 'rgba(255,255,255,0.5)' : '#B4B2A9', textDecoration: 'line-through' }}>{plan.regular}/mo</div>}
                  <div style={{ fontSize: 28, fontWeight: 700, color: plan.popular ? '#fff' : '#534AB7' }}>
                    {plan.price}
                    <span style={{ fontSize: 13, fontWeight: 400, color: plan.popular ? 'rgba(255,255,255,0.7)' : '#888780' }}>{billing === 'monthly' ? plan.period : '/mo'}</span>
                  </div>
                  {billing === 'annual' && <div style={{ fontSize: 11, color: plan.popular ? 'rgba(255,255,255,0.7)' : '#3B6D11' }}>2 months free with annual plan</div>}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: plan.popular ? 'rgba(255,255,255,0.85)' : '#5F5E5A' }}>
                    <span style={{ color: plan.popular ? '#fff' : '#534AB7', fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/signup')} style={{ width: '100%', padding: '10px', borderRadius: 40, border: plan.popular ? '1.5px solid rgba(255,255,255,0.3)' : '0.5px solid #534AB7', background: plan.popular ? 'rgba(255,255,255,0.15)' : '#534AB7', color: plan.popular ? '#fff' : '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {plan.price === 'Free' ? 'Get started free' : 'Start free trial'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: '#534AB7', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Ready to transform your VA business?</h2>
        <p style={{ fontSize: 16, color: '#AFA9EC', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>Join companies already using Flashenter to manage their global VA teams.</p>
        <button onClick={() => navigate('/signup')} style={{ padding: '15px 40px', borderRadius: 40, border: 'none', background: '#fff', color: '#534AB7', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Start your free trial today →
        </button>
        <div style={{ fontSize: 12, color: '#AFA9EC', marginTop: 16 }}>7-day free trial · No credit card required</div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1a1a18', padding: '40px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>
            <span style={{ color: '#AFA9EC' }}>Flash</span>enter
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="#features" style={{ fontSize: 13, color: '#888780', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ fontSize: 13, color: '#888780', textDecoration: 'none' }}>Pricing</a>
            <button onClick={() => navigate('/signup')} style={{ fontSize: 13, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Sign up</button>
            <button onClick={() => navigate('/login')} style={{ fontSize: 13, color: '#888780', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>Sign in</button>
          </div>
          <div style={{ fontSize: 12, color: '#5F5E5A' }}>© 2025 Flashenter. All rights reserved.</div>
        </div>
      </div>

    </div>
  )
}