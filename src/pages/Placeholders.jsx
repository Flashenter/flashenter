import { PageHeader } from '../components/ui'

function ComingSoon({ title, sub, emoji }) {
  return (
    <div>
      <PageHeader title={title} subtitle={sub} />
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 20px', textAlign: 'center',
        background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a18', marginBottom: 8 }}>Coming next</div>
        <div style={{ fontSize: 13, color: '#888780', maxWidth: 340, lineHeight: 1.6 }}>
          This screen is in the build queue. The full {title} module will be live in the next development sprint.
        </div>
      </div>
    </div>
  )
}

export function Leads()    { return <ComingSoon title="Leads"    sub="17 active leads across 5 markets"       emoji="⭐" /> }
export function Deals()    { return <ComingSoon title="Deals"    sub="47 open deals · Pipeline Kanban view"   emoji="💼" /> }
export function Markets()  { return <ComingSoon title="Markets"  sub="7 active international markets"         emoji="🌍" /> }
export function Settings() { return <ComingSoon title="Settings" sub="Account, billing, integrations"         emoji="⚙️" /> }
export function Invoices() { return <ComingSoon title="Invoices" sub="Client invoices & payment tracking"     emoji="🧾" /> }
