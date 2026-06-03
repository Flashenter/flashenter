import { useState } from 'react'
import { FileText, Play, VideoOff, UserPlus, Eye, Star, Plus, Upload } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { vas } from '../data'

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

export default function VAPool() {
  const [activeFilter, setActiveFilter] = useState('All VAs')

  const filtered = vas.filter(v => {
    if (activeFilter === 'Available') return v.status === 'available'
    if (activeFilter === 'Assigned') return v.status === 'assigned'
    if (activeFilter === 'Has video') return v.hasVideo
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
        <Button variant="primary" icon={Plus}>Add VA profile</Button>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }} className="animate-fade-up delay-2">
        {filtered.map(va => {
          const sc = statusConfig[va.status]
          return (
            <Card key={va.id} style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '12px 12px 10px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Avatar initials={va.initials} size={42} colorIndex={va.colorIndex} />
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

              {/* Details */}
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
                    {va.rating} · {va.ratingCount > 0 ? `${va.ratingCount} prev client${va.ratingCount > 1 ? 's' : ''}` : 'New to pool'}
                  </span>
                </div>
              </div>

              {/* Availability */}
              <div style={{ padding: '8px 12px', background: '#F5F4F1', display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, color: '#888780', marginRight: 2 }}>Availability:</span>
                {days.map((d, i) => (
                  <span key={d} style={{
                    fontSize: 9, padding: '2px 5px', borderRadius: 4, fontWeight: 600,
                    background: va.availability[i] ? 'var(--green-50)' : '#fff',
                    color: va.availability[i] ? 'var(--green-600)' : '#B4B2A9',
                    border: va.availability[i] ? 'none' : '0.5px solid rgba(0,0,0,0.08)',
                  }}>{d}</span>
                ))}
              </div>

              {/* Footer */}
              <div style={{ padding: '8px 12px', borderTop: '0.5px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, padding: '3px 8px',
                    borderRadius: 20, background: '#E6F1FB', color: '#185FA5', cursor: 'pointer',
                  }}>
                    <FileText size={10} /> CV
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, padding: '3px 8px',
                    borderRadius: 20, cursor: 'pointer',
                    background: va.hasVideo ? 'var(--red-50)' : 'var(--amber-50)',
                    color: va.hasVideo ? 'var(--red-600)' : 'var(--amber-600)',
                  }}>
                    {va.hasVideo ? <><Play size={10} /> Video</> : <><VideoOff size={10} /> No video</>}
                  </div>
                </div>
                {va.status === 'available' ? (
                  <button style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '6px', borderRadius: 8, background: 'var(--purple-50)', border: '0.5px solid var(--purple-200)',
                    color: 'var(--purple-600)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}>
                    <UserPlus size={12} /> Assign to client
                  </button>
                ) : (
                  <button style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    padding: '6px', borderRadius: 8, background: '#F5F4F1', border: '0.5px solid rgba(0,0,0,0.08)',
                    color: '#5F5E5A', fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  }}>
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
