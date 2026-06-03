import { useState, useEffect } from 'react'
import { Mail, Users, Flame, Building, Clock, Plus, Search, Trash2 } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
  hot:    { label: 'Hot',    color: 'red'    },
  warm:   { label: 'Warm',   color: 'amber'  },
  new:    { label: 'New',    color: 'purple' },
  client: { label: 'Client', color: 'green'  },
}

const stageColors = {
  'Active client':  '#639922',
  'Proposal sent':  '#534AB7',
  'Qualified':      '#BA7517',
  'New inquiry':    '#888780',
  'Demo scheduled': '#185FA5',
}

const filters = ['All', 'Hot leads', 'Active clients', 'New']

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [showAdd, setShowAdd] = useState(false)
  const [newContact, setNewContact] = useState({
    name: '', title: '', company: '', country: '', email: '',
    phone: '', budget: '', status: 'new', stage: 'New inquiry'
  })
  const navigate = useNavigate()

  useEffect(() => { fetchContacts() }, [])

  async function fetchContacts() {
    setLoading(true)
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setContacts(data || [])
    setLoading(false)
  }

  async function addContact() {
    if (!newContact.name) return alert('Please enter a name')
    await supabase.from('contacts').insert([newContact])
    setNewContact({ name: '', title: '', company: '', country: '', email: '', phone: '', budget: '', status: 'new', stage: 'New inquiry' })
    setShowAdd(false)
    fetchContacts()
  }

  async function deleteContact(id, e) {
    e.stopPropagation()
    if (!confirm('Delete this client?')) return
    await supabase.from('contacts').delete().eq('id', id)
    fetchContacts()
  }

  const filtered = contacts.filter(c => {
    if (search && !c.name?.toLowerCase().includes(search.toLowerCase()) && !c.company?.toLowerCase().includes(search.toLowerCase())) return false
    if (activeFilter === 'Hot leads') return c.status === 'hot'
    if (activeFilter === 'Active clients') return c.status === 'client'
    if (activeFilter === 'New') return c.status === 'new'
    return true
  })

  return (
    <div>
      <PageHeader title="Clients" subtitle={`${contacts.length} clients · 5 markets`}>
        <Button icon={Plus} variant="primary" onClick={() => setShowAdd(true)}>Add client</Button>
      </PageHeader>

      {showAdd && (
        <Card style={{ marginBottom: 14, border: '1.5px solid #AFA9EC' }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New client</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 10 }}>
            {[
              { key: 'name', label: 'Full name *' },
              { key: 'title', label: 'Job title' },
              { key: 'company', label: 'Company' },
              { key: 'country', label: 'Country' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'budget', label: 'Budget (e.g. $500/mo)' },
            ].map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input value={newContact[f.key]} onChange={e => setNewContact(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Status</div>
              <select value={newContact.status} onChange={e => setNewContact(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option value="new">New</option>
                <option value="hot">Hot lead</option>
                <option value="warm">Warm lead</option>
                <option value="client">Active client</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Stage</div>
              <select value={newContact.stage} onChange={e => setNewContact(p => ({ ...p, stage: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option>New inquiry</option>
                <option>First contact</option>
                <option>Qualified</option>
                <option>Proposal sent</option>
                <option>Negotiation</option>
                <option>Active client</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary" onClick={addContact}>Save client</Button>
            <Button onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        <MetricCard icon={Users} label="All clients" value={contacts.length} sub="Total in database" />
        <MetricCard icon={Flame} label="Hot leads" value={contacts.filter(c => c.status === 'hot').length} sub="Need follow-up" subColor="var(--red-600)" />
        <MetricCard icon={Building} label="Active clients" value={contacts.filter(c => c.status === 'client').length} sub="Paying clients" subColor="var(--green-600)" />
        <MetricCard icon={Clock} label="New inquiries" value={contacts.filter(c => c.status === 'new').length} sub="New this week" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 40, padding: '8px 14px' }}>
          <Search size={14} color="#888780" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..."
            style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', flex: 1, fontFamily: 'var(--font-sans)' }} />
        </div>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            fontSize: 11, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            background: activeFilter === f ? '#EEEDFE' : '#fff',
            color: activeFilter === f ? '#534AB7' : '#5F5E5A',
            border: activeFilter === f ? '0.5px solid #AFA9EC' : '0.5px solid rgba(0,0,0,0.08)',
            fontWeight: activeFilter === f ? 600 : 400, fontFamily: 'var(--font-sans)',
          }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading clients...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No clients yet</div>
          <div style={{ fontSize: 13, color: '#888780', marginBottom: 16 }}>Add your first client or lead to get started</div>
          <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Add your first client</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {filtered.map((c, i) => {
            const sc = statusConfig[c.status] || statusConfig.new
            return (
              <Card key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/contacts/${c.id}`)}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <Avatar initials={c.name?.slice(0, 2).toUpperCase()} size={38} colorIndex={i % 6} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>{c.title} · {c.company}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Tag color={sc.color}>{sc.label}</Tag>
                    <div onClick={e => deleteContact(c.id, e)} style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#FCEBEB' }}>
                      <Trash2 size={11} color="#A32D2D" />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                  <div style={{ fontSize: 11, color: '#5F5E5A' }}>{c.country}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#5F5E5A' }}>
                    <Mail size={11} color="#B4B2A9" /> {c.email}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#5F5E5A' }}>
                    <Users size={11} color="#B4B2A9" /> {c.budget}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888780' }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: stageColors[c.stage] || '#888780', display: 'inline-block' }} />
                    {c.stage}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}