const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')

const helpPanel = `
      {showHelp && (
        <div onClick={() => setShowHelp(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, padding: 32, width: 560, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Help Center</div>
              <button onClick={() => setShowHelp(false)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#888780' }}>x</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { emoji: '📋', title: 'Quick Start Guide', desc: 'Learn how to add clients, assign VAs, and run your first payroll in under 10 minutes.' },
                { emoji: '❓', title: 'FAQ', desc: 'Common questions about timesheets, contracts, portals and payroll.' },
                { emoji: '📧', title: 'Contact Support', desc: 'Email us at support@flashenter.com or WhatsApp us for urgent help.' },
                { emoji: '🎥', title: 'Video Tutorials', desc: 'Watch step-by-step guides for every feature. Coming soon!' },
                { emoji: '🔗', title: 'VA Portal', desc: 'Share portal links with your VAs from the VA Pool page.' },
                { emoji: '👥', title: 'Client Portal', desc: 'Share portal links with clients from the Clients page using the Copy Portal Link button.' },
              ].map(item => (
                <div key={item.title} style={{ padding: '14px 16px', background: '#F5F4F1', borderRadius: 12 }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{item.emoji}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: '#5F5E5A', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
`

c = c.replace('return (\n    <div className="min-h-screen', helpPanel + '\n    return (\n    <div className="min-h-screen')

fs.writeFileSync('src/components/layout/Layout.jsx', c)
console.log('Done!')