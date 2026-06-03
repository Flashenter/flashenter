import { useState, useEffect } from 'react'
import { FileText, Play, VideoOff, UserPlus, Eye, Star, Plus, Upload, X } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabaseClient'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const filters = ['All VAs', 'Available', 'Assigned', '🇵🇭 Philippines', '🇿🇦 South Africa', '🇨🇴 Colombia', '🇵🇦 Panama', '🇩🇴 Dom. Republic', 'Has video', 'Full-time']

const statusConfig = {
  available:  { label: 'Available',  color: 'green'  },
  assigned:   { label: 'Assigned',   color: 'purple' },
  onboarding: { label: 'Onboarding', color: 'amber'  },
}

function Stars({ rating }) {
  return (
    <div style={{ display: 'flex', gap: 1 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11} fill={i <= Math.round(rating) ? 'var(--amber-400)' : 'none'} color={i <= Math.round(rating) ? 'var(--amber-400)' : '#D3D1C7'} />
      ))}
    </div>
  )
}

const emptyForm = {
  name: '', initials: '', role: '', flag: '', country: '', city: '',
  timezone: '', status: 'available', type: 'Full-time', languages: '',
  tools: '', experience: '', rating: 0, rating_count: 0,
  availability: [true,true,true,true,true,false,false],
  has_video: false, color_index: 0,
}

export default function VAPool() {
  const [activeFilter, setActiveFilter] = useState('All VAs')
  const [vas, setVas] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchVAs() }, [])

  async function fetchVAs() {
    const { data } = await supabase.from('vas').select('*').order('created_at', { ascending: false })
    if (data) setVas(data)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function toggleDay(i) {
    const updated = [...form.availability]
    updated[i] = !updated[i]
    setForm({ ...form, availability: updated })
  }

  async function handleSave() {
    if (!form.name) { setError('Name is required'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('vas').insert([{
      ...form,
      initials: form.initials || form.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      rating: parseFloat(form.rating) || 0,
      rating_count: parseInt(form.rating_count) || 0,
      color_index: parseInt(form.color_index) || 0,
    }])
    setSaving(false)
    if (err) { setError('Save failed: ' + err.message) }
    else { setShowForm(false); setForm(emptyForm); fetchVAs() }
  }

  const filtered = vas.filter(v => {
    if (activeFilter === 'Available') return v.status === 'available'
    if (activeFilter === 'Assigned') return v.status === 'assigned'
    if (activeFilter === 'Has video') return v.has_video
    if (activeFilter === 'Full-time') return v.type === 'Full-time'
    if (activeFilter.includes('Philippines')) return v.country === 'Philippines'
    if (activeFilter.includes('South Africa')) return v.country === 'South Africa'
    if (activeFilter.includes('Colombia')) return v.country === 'Colombia'
    if (activeFilter.includes('Panama')) return v.country === 'Panama'
    if (activeFilter.includes('Dom. Republic')) return v.country === 'Dominican Republic'
    return true
  })

  return (
    <div>
      <PageHeader title="VA talent pool" subtitle={`${vas.length} virtual assistants · CVs, video intros, availability · Ready to assign`}>
        <Button icon={Upload}>Upload VA</Button>
        <Button variant="primary" icon={Plus} onClick={() => setShowForm(true)}>Add VA profile</Button>
      </PageHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }} className="animate-fade-up delay-1">
        <MetricCard label="Total VAs" value={vas.length} sub="In pool" />
        <MetricCard label="Available now" value={vas.filter(v=>v.status==='available').length} sub="Ready to assign" subColor="var(--green-600)" />
        <MetricCard label="Assigned" value={vas.filter(v=>v.status==='assigned').length} sub="With clients" subColor="var(--purple-600)" />
        <MetricCard label="In onboarding" value={vas.filter(v=>v.status==='onboarding').length} sub="Being placed" subColor="var(--amber-400)" />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }} className="animate-fade-up delay-1">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)} style={{
            fontSize: 11, padding: '4px 12px', borderRadius: 20, cursor: 'pointer',
            background: activeFilter === f ? 'var(--purple-50)' : '#fff',
            color: activeFilter === f ? 'var(--purple-600)' : '#5F5E5A',
            border: activeFilter === f ? '0.5px solid var(--purple-200)' : '0.5px solid rgba(0,0,0,0.08)',
            fontWeight: activeFilter === f ? 600 : 400,
            fontFamily: 'var(--font-sans)',
          }}>{f}</button>
        ))}
      </div>

      {/* ADD VA FORM */}
      {showForm && (
        <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.1)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>New VA Profile</div>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={16} /></button>
          </div>

          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '8px 12px', borderRadius: 8, fontSize: 12, marginBottom: 12 }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
            <FormField label="Full Name *" name="name" value={form.name} onChange={handleChange} />
            <FormField label="Role" name="role" value={form.role} onChange={handleChange} placeholder="e.g. Customer Support VA" />
            <FormField label="Country" name="country" value={form.country} onChange={handleChange} placeholder="e.g. Philippines" />
            <FormField label="City" name="city" value={form.city} onChange={handleChange} />
            <FormField label="Timezone" name="timezone" value={form.timezone} onChange={handleChange} placeholder="e.g. UTC+8" />
            <FormField label="Flag emoji" name="flag" value={form.flag} onChange={handleChange} placeholder="e.g. 🇵🇭" />
            <FormField label="Languages" name="languages" value={form.languages} onChange={handleChange} />
            <FormField label="Tools" name="tools" value={form.tools} onChange={handleChange} />
            <FormField label="Experience" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 3 yrs" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="onboarding">Onboarding</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select name="type" value={form.type} onChange={handleChange} style={inputStyle}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Has Video?</label>
              <select name="has_video" value={form.has_video} onChange={e => setForm({...form, has_video: e.target.value === 'true'})} style={inputStyle}>
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <FormField label="Rating (0-5)" name="rating" value={form.rating} onChange={handleChange} placeholder="e.g. 4.5" />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Availability</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {days.map((d, i) => (
                <button key={d} type="button" onClick={() => toggleDay(i)} style={{
                  fontSize: 10, padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                  background: form.availability[i] ? 'var(--green-50)' : '#fff',
                  color: form.availability[i] ? 'var(--green-600)' : '#B4B2A9',
                  border: form.availability[i] ? '0.5px solid var(--green-200)' : '0.5px solid rgba(0,0,0,0.08)',
                }}>{d}</button>
              ))}
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} style={{
            background: saving ? '#a78bfa' : 'var(--purple-600)', color: '#fff',
            border: 'none', padding: '8px 20px', borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>
            {saving ? 'Saving...' : 'Save VA Profile'}
          </button>
        </div>
      )}

      {/* VA CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }} className="animate-fade-up delay-2">
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#9ca3af', fontSize: 13 }}>
            No VAs yet. Click "Add VA profile" to get started.
          </div>
        ) : filtered.map(va => {
          const sc = statusConfig[va.status] || statusConfig.available
          return (
            <Card key={va.id} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '12px 12px 10px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Avatar initials={va.initials} size={42} colorIndex={va.color_index} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18' }}>{va.name}</div>
                      <div style={{ fontSize: 11, color: '#888780', marginTop: 1 }}>{va.role}</div>
                    </div>
                    <Tag color={sc.color}>{sc.label}</Tag>
                  </div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                    <Tag color="blue" size="xs">{va.flag} {va.city}</Tag>
                    <Tag color={va.type === 'Full-time' ? 'purple' : 'amber'} size="xs">{va.type}</Tag>
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 11, color: '#5F5E5A', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12 }}>🌐</span> {va.languages}
                </div>
                <div style={{ fontSize: 11, color: '#5F5E5A', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12 }}>🔧</span> {va.tools}
                </div>
                <div style={{ fontSize: 11, color: '#5F5E5A', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ fontSize: 12 }}>⏱</span> {va.experience} experience · {va.timezone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <Stars rating={va.rating} />
                  <span style={{ fontSize: 10, color: '#888780' }}>
                    {va.rating} · {va.rating_count > 0 ? `${va.rating_count} prev client${va.rating_count > 1 ? 's' : ''}` : 'New to pool'}
                  </span>
                </div>
              </div>

              <div style={{ padding: '8px 12px', background: '#F5F4F1', display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: '#888780', marginRight: 2 }}>Availability:</span>
                {days.map((d, i) => (
                  <span key={d} style={{
                    fontSize: 9, padding: '2px 5px', borderRadius: 4, fontWeight: 600,
                    background: va.availability?.[i] ? 'var(--green-50)' : '#fff',
                    color: va.availability?.[i] ? 'var(--green-600)' : '#B4B2A9',
                    border: va.availability?.[i] ? 'none' : '0.5px solid rgba(0,0,0,0.08)',
                  }}>{d}</span>
                ))}
              </div>

              <div style={{ padding: '8px 12px', borderTop: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, padding: '3px 8px', borderRadius: 20, background: '#E6F1FB', color: '#185FA5', cursor: 'pointer' }}>
                    <FileText size={10} /> CV
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, padding: '3px 8px', borderRadius: 20, cursor: 'pointer',
                    background: va.has_video ? 'var(--red-50)' : 'var(--amber-50)',
                    color: va.has_video ? 'var(--red-600)' : 'var(--amber-600)',
                  }}>
                    {va.has_video ? <><Play size={10} /> Video</> : <><VideoOff size={10} /> No video</>}
                  </div>
                </div>
                {va.status === 'available' ? (
                  <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '6px', borderRadius: 8, background: 'var(--purple-50)', border: '0.5px solid var(--purple-200)', color: 'var(--purple-600)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    <UserPlus size={12} /> Assign to client
                  </button>
                ) : (
                  <button style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '6px', borderRadius: 8, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)', color: '#5F5E5A', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
                    <Eye size={12} /> View profile
                  </button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function FormField({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input name={name} value={value} onChange={onChange} placeholder={placeholder || ''} style={inputStyle} />
    </div>
  )
}

const labelStyle = { display: 'block', fontSize: 11, fontWeight: 500, color: '#5F5E5A', marginBottom: 4 }
const inputStyle = { width: '100%', padding: '6px 10px', borderRadius: 8, border: '0.5px solid rgba(0,0,0,0.15)', fontSize: 12, fontFamily: 'var(--font-sans)', boxSizing: 'border-box', outline: 'none' }