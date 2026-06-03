import { useState, useEffect } from 'react'
import { Plus, Star, X } from 'lucide-react'
import { MetricCard, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

export default function VAPool() {
  const [vas, setVas] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [assigning, setAssigning] = useState(null)
  const [selectedClient, setSelectedClient] = useState('')
  const [newVA, setNewVA] = useState({
    name: '', role: '', country: '', city: '', flag: '',
    timezone: '', status: 'available', type: 'Full-time',
    languages: '', tools: '', experience: '', rating: 5
  })

  useEffect(() => { fetchVAs(); fetchClients() }, [])

  async function fetchVAs() {
    setLoading(true)
    const { data } = await supabase.from('vas').select('*').order('created_at', { ascending: false })
    setVas(data || [])
    setLoading(false)
  }

  async function fetchClients() {
    const { data } = await supabase.from('contacts').select('*').order('name')
    setClients(data || [])
  }

  async function addVA() {
    if (!newVA.name) return alert('Please enter a name')
    const initials = newVA.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    const { error } = await supabase.from('vas').insert([{ ...newVA, initials }])
    if (error) { alert('Error: ' + error.message) } else { setShowAdd(false); fetchVAs() }
  }

  async function assignToClient() {
    if (!selectedClient) return alert('Please select a client')
    const client = clients.find(c => c.id === selectedClient)
    const { error } = await supabase.from('vas').update({
      status: 'assigned',
      assigned_to: client.name
    }).eq('id', assigning.id)
    if (error) { alert('Error: ' + error.message) } else {
      setAssigning(null)
      setSelectedClient('')
      fetchVAs()
    }
  }

  const fields = [
    { key: 'name', label: 'Full name *' },
    { key: 'role', label: 'Role (e.g. Customer Support VA)' },
    { key: 'country', label: 'Country' },
    { key: 'city', label: 'City' },
    { key: 'flag', label: 'Flag emoji (e.g. 🇵🇭)' },
    { key: 'timezone', label: 'Timezone (e.g. UTC+8)' },
    { key: 'languages', label: 'Languages' },
    { key: 'tools', label: 'Tools' },
    { key: 'experience', label: 'Experience (e.g. 3 yrs)' },
  ]

  return (
    <div>
      <PageHeader title="VA talent pool" subtitle={vas.length + ' virtual assistants'}>
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Add VA</Button>
      </PageHeader>

      {/* Assign to client popup */}
      {assigning && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Assign {assigning.name}</div>
              <button onClick={() => setAssigning(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888780' }}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 12, color: '#888780', marginBottom: 8 }}>Select client to assign this VA to:</div>
            <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 10, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 13, fontFamily: 'var(--font-sans)', marginBottom: 16, outline: 'none' }}>
              <option value="">-- Select a client --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} {c.company ? '· ' + c.company : ''}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={assignToClient} style={{ flex: 1, background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Confirm assignment
              </button>
              <button onClick={() => setAssigning(null)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '10px 16px', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={{ background: '#fff', border: '1.5px solid #AFA9EC', borderRadius: 14, padding: 16, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>New VA profile</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 12 }}>
            {fields.map(f => (
              <div key={f.key}>
                <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>{f.label}</div>
                <input value={newVA[f.key]} onChange={e => setNewVA(p => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)', outline: 'none' }} />
              </div>
            ))}
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Type</div>
              <select value={newVA.type} onChange={e => setNewVA(p => ({ ...p, type: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option>Full-time</option>
                <option>Part-time</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#888780', marginBottom: 3 }}>Status</div>
              <select value={newVA.status} onChange={e => setNewVA(p => ({ ...p, status: e.target.value }))}
                style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.1)', fontSize: 12, fontFamily: 'var(--font-sans)' }}>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="onboarding">Onboarding</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addVA} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Save VA</button>
            <button onClick={() => setShowAdd(false)} style={{ background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 40, padding: '8px 18px', fontSize: 12, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
        <MetricCard label="Total VAs" value={vas.length} sub="In pool" />
        <MetricCard label="Available" value={vas.filter(v => v.status === 'available').length} sub="Ready" subColor="var(--green-600)" />
        <MetricCard label="Assigned" value={vas.filter(v => v.status === 'assigned').length} sub="With clients" subColor="var(--purple-600)" />
        <MetricCard label="Onboarding" value={vas.filter(v => v.status === 'onboarding').length} sub="Being placed" subColor="var(--amber-400)" />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#888780' }}>Loading...</div>
      ) : vas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16, border: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>👩‍💼</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No VAs yet</div>
          <button onClick={() => setShowAdd(true)} style={{ background: '#534AB7', color: '#fff', border: 'none', borderRadius: 40, padding: '8px 18px', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Add first VA</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {vas.map((va, i) => (
            <div key={va.id} style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 12px 10px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Avatar initials={va.initials || va.name?.slice(0, 2).toUpperCase()} size={42} colorIndex={i % 6} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{va.name}</div>
                  <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>{va.role}</div>
                  <div style={{ fontSize: 10, marginTop: 4, padding: '2px 8px', borderRadius: 20, display: 'inline-block', background: va.status === 'available' ? '#EAF3DE' : va.status === 'assigned' ? '#EEEDFE' : '#FAEEDA', color: va.status === 'available' ? '#3B6D11' : va.status === 'assigned' ? '#534AB7' : '#854F0B' }}>
                    {va.status}{va.assigned_to ? ' → ' + va.assigned_to : ''}
                  </div>
                </div>
              </div>
              <div style={{ padding: '0 12px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                {va.languages && <div style={{ fontSize: 11, color: '#5F5E5A' }}>🌐 {va.languages}</div>}
                {va.tools && <div style={{ fontSize: 11, color: '#5F5E5A' }}>🔧 {va.tools}</div>}
                {va.experience && <div style={{ fontSize: 11, color: '#5F5E5A' }}>⏱ {va.experience} · {va.timezone}</div>}
                <div style={{ fontSize: 11, color: '#5F5E5A' }}>{va.flag} {va.city}, {va.country}</div>
              </div>
              <div style={{ padding: '8px 12px', borderTop: '0.5px solid rgba(0,0,0,0.06)' }}>
                {va.status === 'available' ? (
                  <button onClick={() => { setAssigning(va); setSelectedClient('') }}
                    style={{ width: '100%', padding: '7px', borderRadius: 8, background: '#EEEDFE', border: '0.5px solid #AFA9EC', color: '#534AB7', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    Assign to client →
                  </button>
                ) : (
                  <button onClick={() => supabase.from('vas').update({ status: 'available', assigned_to: null }).eq('id', va.id).then(fetchVAs)}
                    style={{ width: '100%', padding: '7px', borderRadius: 8, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', color: '#5F5E5A', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    Mark as available
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}