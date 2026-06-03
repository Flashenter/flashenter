import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Card, Tag, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

export default function Onboarding() {
  const [onboardings, setOnboardings] = useState([])

  useEffect(() => {
    supabase.from('onboardings').select('*').then(({ data }) => {
      if (data) setOnboardings(data)
    })
  }, [])

  return (
    <div>
      <PageHeader title="VA onboarding" subtitle="Active placements">
        <Button variant="primary" icon={Plus}>Start new onboarding</Button>
      </PageHeader>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {onboardings.map(ob => (
          <Card key={ob.id} style={{ padding: 16 }}>
            <div style={{ fontWeight: 600 }}>{ob.va_name} to {ob.client_name}</div>
            <div style={{ fontSize: 11, color: '#888780', marginTop: 4 }}>{ob.country} · {ob.role} · {ob.start_date}</div>
            <div style={{ marginTop: 8 }}>
              <Tag color={ob.status === 'in-progress' ? 'amber' : 'red'}>
                {ob.status === 'in-progress' ? 'In progress' : 'Action needed'}
              </Tag>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}