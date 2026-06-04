import { useState, useEffect } from 'react'
import { Star, TrendingUp, Plus, Globe, Users, DollarSign, Briefcase, Bell, Lock, Building, ChevronRight } from 'lucide-react'
import { PageHeader, Button, MetricCard, Card, Tag, Avatar } from '../components/ui'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newLead, setNewLead] = useState({ name: '', company: '', country: '', email: '', phone: '', budget: '', status: 'new', stage: 'New inquiry', notes: '' })
  const navigate = useNavigate()

  useEffect(() => { fetchLeads() }, [])

  async function fetchLeads() {
    setLoading(true)
    const { data } = await supabase.from('contacts').select('*').in('status', ['hot', 'warm', 'new']).order('created_at', { ascending: false })
    setLeads(data || [])
    setLoading(false)
  }

  async function addLead() {
    if (!newLead.name) return alert('Please enter a name')
    await supabase.from('contacts').insert([newLead])
    setNewLead({ name: '', company: '', country: '', email: '', phone: '', budget: '', status: 'new', stage: 'New inquiry', notes: '' })
    setShowAdd(false)
    fetchLeads()
  }

  const statusColor = { hot: 'red', warm: 'amber', new: 'purple' }

  return (
    <div>
      <PageHeader title="Leads" subtitle={`${leads.length} active leads`}>
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Add lead</Button>
      </PageHeader>

      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New lead</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'name', label: 'Full name *' },
              { key: 'company', label: 'Company' },
              { key: 'country', label: 'Country' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'budget', label: 'Budget' },
              { key: 'notes', label: 'Notes' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input value={newLead[f.key]} onChange={e => setNewLead(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Status</div>
              <select value={newLead.status} onChange={e => setNewLead(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option value="new">New</option>
                <option value="warm">Warm</option>
                <option value="hot">Hot</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addLead} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save lead</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        <MetricCard icon={Star} label="Hot leads" value={leads.filter(l => l.status === 'hot').length} sub="Need follow-up" subColor="var(--red-600)" />
        <MetricCard icon={TrendingUp} label="Warm leads" value={leads.filter(l => l.status === 'warm').length} sub="In conversation" subColor="var(--amber-400)" />
        <MetricCard icon={Star} label="New leads" value={leads.filter(l => l.status === 'new').length} sub="Just came in" subColor="var(--purple-600)" />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading leads...</div>
      ) : leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⭐</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No leads yet</div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Add first lead</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {leads.map((lead, i) => (
            <div key={lead.id} onClick={() => navigate(`/contacts/${lead.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, cursor: 'pointer' }}>
              <Avatar initials={lead.name?.slice(0,2).toUpperCase()} size={36} colorIndex={i % 6} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{lead.name}</div>
                <div style={{ fontSize: 11, color: '#888780' }}>{lead.company} · {lead.country}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{lead.budget}</div>
              <Tag color={statusColor[lead.status] || 'purple'}>{lead.status}</Tag>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Deals() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newDeal, setNewDeal] = useState({ name: '', company: '', country: '', email: '', budget: '', status: 'client', stage: 'Proposal sent' })
  const navigate = useNavigate()

  useEffect(() => { fetchDeals() }, [])

  async function fetchDeals() {
    setLoading(true)
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setDeals(data || [])
    setLoading(false)
  }

  async function addDeal() {
    if (!newDeal.name) return alert('Please enter a name')
    await supabase.from('contacts').insert([newDeal])
    setNewDeal({ name: '', company: '', country: '', email: '', budget: '', status: 'client', stage: 'Proposal sent' })
    setShowAdd(false)
    fetchDeals()
  }

  const stageColor = { 'New inquiry': '#888780', 'Qualified': '#BA7517', 'Proposal sent': '#534AB7', 'Negotiation': '#185FA5', 'Active client': '#639922' }

  return (
    <div>
      <PageHeader title="Deals" subtitle={`${deals.length} total deals`}>
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Add deal</Button>
      </PageHeader>

      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New deal</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
            {[
              { key: 'name', label: 'Contact name *' },
              { key: 'company', label: 'Company' },
              { key: 'country', label: 'Country' },
              { key: 'email', label: 'Email' },
              { key: 'budget', label: 'Deal value' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input value={newDeal[f.key]} onChange={e => setNewDeal(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Stage</div>
              <select value={newDeal.stage} onChange={e => setNewDeal(p => ({ ...p, stage: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option>New inquiry</option>
                <option>Qualified</option>
                <option>Proposal sent</option>
                <option>Negotiation</option>
                <option>Active client</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addDeal} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save deal</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        {['New inquiry', 'Proposal sent', 'Negotiation', 'Active client'].map(stage => (
          <div key={stage} style={{ background: '#F5F4F1', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: 11, color: '#888780', marginBottom: 4 }}>{stage}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{deals.filter(d => d.stage === stage).length}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
      ) : deals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>💼</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No deals yet</div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Add first deal</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {deals.map((deal, i) => (
            <div key={deal.id} onClick={() => navigate(`/contacts/${deal.id}`)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, cursor: 'pointer' }}>
              <Avatar initials={deal.name?.slice(0,2).toUpperCase()} size={36} colorIndex={i % 6} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{deal.name}</div>
                <div style={{ fontSize: 11, color: '#888780' }}>{deal.company} · {deal.country}</div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>{deal.budget}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888780' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: stageColor[deal.stage] || '#888780', display: 'inline-block' }} />
                {deal.stage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Markets() {
  const [contacts, setContacts] = useState([])
  const [vas, setVas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('contacts').select('*'),
      supabase.from('vas').select('*')
    ]).then(([{ data: c }, { data: v }]) => {
      setContacts(c || [])
      setVas(v || [])
      setLoading(false)
    })
  }, [])

  const markets = [
    { name: 'Dominican Republic', flag: '🇩🇴', keywords: ['Dominican', 'DR', 'Santo Domingo'] },
    { name: 'South Africa', flag: '🇿🇦', keywords: ['South Africa', 'Johannesburg', 'Cape Town'] },
    { name: 'Philippines', flag: '🇵🇭', keywords: ['Philippines', 'Manila', 'Cebu'] },
    { name: 'Colombia', flag: '🇨🇴', keywords: ['Colombia', 'Bogota', 'Medellin'] },
    { name: 'Panama', flag: '🇵🇦', keywords: ['Panama'] },
  ]

  function countByMarket(items, keywords) {
    return items.filter(item =>
      keywords.some(k => item.country?.toLowerCase().includes(k.toLowerCase()))
    ).length
  }

  return (
    <div>
      <PageHeader title="Markets" subtitle="Performance across all active markets" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        <MetricCard icon={Globe} label="Active markets" value={markets.length} sub="Countries" />
        <MetricCard icon={Users} label="Total clients" value={contacts.length} sub="Across all markets" />
        <MetricCard icon={Briefcase} label="Total VAs" value={vas.length} sub="Deployed globally" />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading markets...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {markets.map(market => {
            const clientCount = countByMarket(contacts, market.keywords)
            const vaCount = countByMarket(vas, market.keywords)
            const activeClients = contacts.filter(c =>
              market.keywords.some(k => c.country?.toLowerCase().includes(k.toLowerCase())) && c.status === 'client'
            ).length
            const totalClients = contacts.length
            const percentage = totalClients > 0 ? Math.round((clientCount / totalClients) * 100) : 0

            return (
              <div key={market.name} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ fontSize: 28 }}>{market.flag}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{market.name}</div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{clientCount} clients · {vaCount} VAs</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#534AB7' }}>{percentage}%</div>
                    <div style={{ fontSize: 10, color: '#888780' }}>of total clients</div>
                  </div>
                </div>
                <div style={{ height: 6, background: '#F5F4F1', borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
                  <div style={{ height: '100%', width: `${percentage}%`, background: '#534AB7', borderRadius: 6, transition: 'width 0.3s ease' }} />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ padding: '5px 10px', background: '#EAF3DE', borderRadius: 8, fontSize: 11, color: '#3B6D11' }}>
                    {activeClients} active clients
                  </div>
                  <div style={{ padding: '5px 10px', background: '#EEEDFE', borderRadius: 8, fontSize: 11, color: '#534AB7' }}>
                    {vaCount} VAs deployed
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Settings({ user }) {
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  const sections = [
    {
      title: 'Account',
      icon: '👤',
      items: [
        { label: 'Profile & personal info', sub: 'Update your name, email and photo', path: null },
        { label: 'Password & security', sub: 'Change your password and 2FA settings', path: null },
        { label: 'Notifications', sub: 'Email and push notification preferences', path: null },
      ]
    },
    {
      title: 'Workspace',
      icon: '🏢',
      items: [
        { label: 'Company settings', sub: 'Update company name, logo and details', path: null },
        { label: 'Team members', sub: 'Manage team access and approvals', path: '/team' },
        { label: 'Billing & subscription', sub: 'Manage your plan and payment method', path: null },
      ]
    },
    {
      title: 'Integrations',
      icon: '🔗',
      items: [
        { label: 'Google Workspace', sub: 'Connect your Google account', path: null },
        { label: 'Stripe payments', sub: 'Connect Stripe for automated payroll', path: null },
        { label: 'Slack notifications', sub: 'Get notified in Slack', path: null },
      ]
    },
  ]

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and workspace" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {sections.map(section => (
          <div key={section.title} style={{ background: '#fff', borderRadius: 14, border: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', background: '#F5F4F1', borderBottom: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>{section.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{section.title}</span>
            </div>
            {section.items.map((item, i) => (
              <div key={item.label}
                onClick={() => item.path && navigate(item.path)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: i < section.items.length - 1 ? '0.5px solid rgba(0,0,0,0.05)' : 'none', cursor: item.path ? 'pointer' : 'default', background: '#fff' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: '#888780', marginTop: 2 }}>{item.sub}</div>
                </div>
                <ChevronRight size={16} color="#B4B2A9" />
              </div>
            ))}
          </div>
        ))}

        <div style={{ background: '#FCEBEB', borderRadius: 14, border: '0.5px solid #F09595', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#791F1F' }}>Sign out</div>
            <div style={{ fontSize: 11, color: '#A32D2D', marginTop: 2 }}>Sign out of your Flashenter account</div>
          </div>
          <ChevronRight size={16} color="#A32D2D" />
        </div>
      </div>
    </div>
  )
}

export function Invoices() {
  return (
    <div>
      <PageHeader title="Invoices" subtitle="Client invoices and payment tracking" />
      <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧾</div>
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Coming soon</div>
        <div style={{ fontSize: 13, color: '#888780', maxWidth: 340, margin: '0 auto', lineHeight: 1.6 }}>Invoice generation and payment tracking is in the next sprint.</div>
      </div>
    </div>
  )
}