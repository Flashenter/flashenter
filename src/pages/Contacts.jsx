import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Users, Flame, Building, Clock, Plus, Search, Trash2 } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

const filters = ['All', 'Hot leads', 'Active clients', 'New']

const fields = [
  { key: 'name', label: 'Full name *' },
  { key: 'company', label: 'Company' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'budget', label: 'Budget / Package' },
  { key: 'website', label: 'Website' },
  { key: 'notes', label: 'Notes' },
]

export default function Contacts() {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [newContact, setNewContact] = useState({
    name: '', company: '', country: '', city: '', email: '',
    phone: '', budget: '', website: '', notes: '',
    status: 'new', stage: 'New inquiry'
  })

  useEffect(() => { fetchContacts() }, [])

  async function fetchContacts() {
    setLoading(true)
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false })
    setContacts(data || [])
    setLoading(false)
  }

  async function addContact() {
    if (!newContact.name) return alert('Please enter a name')
    const { error } = await supabase.from('contacts').insert([newContact])
    if (error) { alert('Error: ' + error.message) } else {
      setShowAdd(false)
      setNewContact({ name: '', company: '', country: '', city: '', email: '', phone: '', budget: '', website: '', notes: '', status: 'new', stage: 'New inquiry' })
      fetchContacts()
    }
  }

  async function deleteContact(id, e) {
    e.stopPropagation()
    if (!confirm('Delete this contact?')) return
    await supabase.from('contacts').delete().eq('id', id)
    fetchContacts()
  }

  const filtered = contacts.filter(c => {
    if (activeFilter === 'Hot leads') return c.status === 'hot'
    if (activeFilter === 'Active clients') return c.status === 'client'
    if (activeFilter === 'New') return c.status === 'new'
    if (search) return (
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.country?.toLowerCase().includes(search.toLowerCase())
    )
    return true
  }).filter(c => {
    if (!search) return true
    return (
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.company?.toLowerCase().includes(search.toLowerCase()) ||
      c.country?.toLowerCase().includes(search.toLowerCase())
    )
  })

  const statusColor = { hot: 'red', warm: 'amber', client: 'green', new: 'purple' }

  return (
    <div>
      <PageHeader title="Clients" subtitle={contacts.length + ' clients · 5 markets'}>
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Add client</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        <MetricCard icon={Users} label="All clients" value={contacts.length} sub="Total in database" />
        <MetricCard icon={Building} label="Active clients" value={contacts.filter(c => c.status === 'client').length} sub="Paying clients" subColor="var(--green-600)" />
        <MetricCard icon={Flame} label="Hot leads" value={contacts.filter(c => c.status === 'hot').length} sub="Need follow up" subColor="var(--red-600)" />
        <MetricCard icon={Clock} label="New leads" value={contacts.filter(c => c.status === 'new').length} sub="Just came in" subColor="var(--purple-600)" />
      </div>

      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New contact</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
            {fields.map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input value={newContact[f.key]} onChange={e => setNewContact(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Status</div>
              <select value={newContact.status} onChange={e => setNewContact(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option value="new">New</option>
                <option value="warm">Warm</option>
                <option value="hot">Hot</option>
                <option value="client">Active client</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Stage</div>
              <select value={newContact.stage} onChange={e => setNewContact(p => ({ ...p, stage: e.target.value }))}
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
            <Button variant="primary" onClick={addContact}>Save client</Button>
            <Button onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 40, padding: '8px 14px' }}>
          <Search size={14} color="#888780" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{ border: 'none', outline: 'none', fontSize: 13, background: 'transparent', flex: 1, fontFamily: 'var(--font-sans)', width: '100%' }}
          />
        </div>
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            fontSize: 11, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
            background: activeFilter === f ? '#EEEDFE' : '#fff',
            color: activeFilter === f ? '#534AB7' : '#5F5E5A',
            border: activeFilter === f ? '0.5px solid #AFA9EC' : '0.5px solid rgba(0,0,0,0.08)',
            fontFamily: 'var(--font-sans)'
          }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading clients...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No clients yet</div>
          <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Add your first client</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {filtered.map((c, i) => (
            <Card key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/contacts/' + c.id)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                <Avatar initials={c.name?.slice(0,2).toUpperCase()} size={40} colorIndex={i % 6} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: '#888780' }}>{c.company}</div>
                  <div style={{ fontSize: 10, color: '#888780', marginTop: 2 }}>{c.city ? c.city + ', ' : ''}{c.country}</div>
                </div>
                <div onClick={e => deleteContact(c.id, e)} style={{ width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: '#FCEBEB' }}>
                  <Trash2 size={11} color="#A32D2D" />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 12, fontWeight: 500 }}>{c.budget}</div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Tag color={statusColor[c.status] || 'gray'}>{c.status}</Tag>
                </div>
              </div>
              {c.email && <div style={{ fontSize: 11, color: '#888780', marginTop: 6 }}>✉ {c.email}</div>}
              <div style={{ marginTop: 8 }}>
                <button
                  onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(window.location.origin + '/client-portal/' + c.id); alert('Portal link copied!') }}
                  style={{ fontSize: 10, color: '#534AB7', background: '#EEEDFE', border: 'none', borderRadius: 6, padding: '3px 8px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                  🔗 Copy portal link
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}