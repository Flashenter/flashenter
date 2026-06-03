const fs = require('fs')
const code = `import { useState, useEffect } from 'react'
import { FileText, Play, VideoOff, UserPlus, Eye, Star, Plus } from 'lucide-react'
import { MetricCard, Card, Tag, Avatar, Button, PageHeader } from '../components/ui'
import { supabase } from '../lib/supabase'

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function VAPool() {
  const [vas, setVas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [newVA, setNewVA] = useState({ name:'', role:'', country:'', city:'', flag:'', timezone:'', status:'available', type:'Full-time', languages:'', tools:'', experience:'', rating:5, has_video:false })

  useEffect(() => { fetchVAs() }, [])

  async function fetchVAs() {
    setLoading(true)
    const { data } = await supabase.from('vas').select('*').order('created_at', { ascending: false })
    setVas(data || [])
    setLoading(false)
  }

  async function addVA() {
    if (!newVA.name) return
    const initials = newVA.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
    await supabase.from('vas').insert([{ ...newVA, initials }])
    setShowAdd(false)
    fetchVAs()
  }

  return (
    <div>
      <PageHeader title="VA talent pool" subtitle={vas.length + " virtual assistants"}>
        <Button variant="primary" icon={Plus} onClick={() => setShowAdd(true)}>Add VA</Button>
      </PageHeader>
      {showAdd && (
        <div style={{background:'#fff',border:'1.5px solid #AFA9EC',borderRadius:14,padding:16,marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>New VA profile</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:10}}>
            {['name','role','country','city','flag','timezone','languages','tools','experience'].map(k=>(
              <div key={k}>
                <div style={{fontSize:11,color:'#888780',marginBottom:3,textTransform:'capitalize'}}>{k}</div>
                <input value={newVA[k]} onChange={e=>setNewVA(p=>({...p,[k]:e.target.value}))} style={{width:'100%',padding:'7px 10px',borderRadius:8,border:'0.5px solid rgba(0,0,0,0.1)',fontSize:12,fontFamily:'var(--font-sans)',outline:'none'}}/>
              </div>
            ))}
            <div>
              <div style={{fontSize:11,color:'#888780',marginBottom:3}}>Type</div>
              <select value={newVA.type} onChange={e=>setNewVA(p=>({...p,type:e.target.value}))} style={{width:'100%',padding:'7px 10px',borderRadius:8,border:'0.5px solid rgba(0,0,0,0.1)',fontSize:12,fontFamily:'var(--font-sans)'}}>
                <option>Full-time</option><option>Part-time</option>
              </select>
            </div>
            <div>
              <div style={{fontSize:11,color:'#888780',marginBottom:3}}>Status</div>
              <select value={newVA.status} onChange={e=>setNewVA(p=>({...p,status:e.target.value}))} style={{width:'100%',padding:'7px 10px',borderRadius:8,border:'0.5px solid rgba(0,0,0,0.1)',fontSize:12,fontFamily:'var(--font-sans)'}}>
                <option value="available">Available</option><option value="assigned">Assigned</option><option value="onboarding">Onboarding</option>
              </select>
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={addVA} style={{background:'#534AB7',color:'#fff',border:'none',borderRadius:40,padding:'7px 16px',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'var(--font-sans)'}}>Save VA</button>
            <button onClick={()=>setShowAdd(false)} style={{background:'#F5F4F1',border:'0.5px solid rgba(0,0,0,0.1)',borderRadius:40,padding:'7px 16px',fontSize:12,cursor:'pointer',fontFamily:'var(--font-sans)'}}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}}>
        <MetricCard label="Total VAs" value={vas.length} sub="In pool"/>
        <MetricCard label="Available" value={vas.filter(v=>v.status==='available').length} sub="Ready" subColor="var(--green-600)"/>
        <MetricCard label="Assigned" value={vas.filter(v=>v.status==='assigned').length} sub="With clients" subColor="var(--purple-600)"/>
        <MetricCard label="Onboarding" value={vas.filter(v=>v.status==='onboarding').length} sub="Being placed" subColor="var(--amber-400)"/>
      </div>
      {loading ? (
        <div style={{textAlign:'center',padding:40,color:'#888780'}}>Loading...</div>
      ) : vas.length === 0 ? (
        <div style={{textAlign:'center',padding:60,background:'#fff',borderRadius:16,border:'0.5px solid rgba(0,0,0,0.08)'}}>
          <div style={{fontSize:32,marginBottom:12}}>👩‍💼</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:6}}>No VAs yet</div>
          <button onClick={()=>setShowAdd(true)} style={{background:'#534AB7',color:'#fff',border:'none',borderRadius:40,padding:'8px 18px',fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'var(--font-sans)'}}>Add first VA</button>
        </div>
      ) : (
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10}}>
          {vas.map((va,i)=>(
            <div key={va.id} style={{background:'#fff',border:'0.5px solid rgba(0,0,0,0.08)',borderRadius:14,overflow:'hidden'}}>
              <div style={{padding:'12px 12px 10px',display:'flex',alignItems:'flex-start',gap:10}}>
                <Avatar initials={va.initials||va.name?.slice(0,2).toUpperCase()} size={42} colorIndex={i%6}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600}}>{va.name}</div>
                  <div style={{fontSize:11,color:'#888780',marginTop:1}}>{va.role}</div>
                  <div style={{fontSize:10,marginTop:4,padding:'2px 7px',borderRadius:20,display:'inline-block',background:va.status==='available'?'var(--green-50)':'var(--purple-50)',color:va.status==='available'?'var(--green-600)':'var(--purple-600)'}}>{va.status}</div>
                </div>
              </div>
              <div style={{padding:'0 12px 10px',display:'flex',flexDirection:'column',gap:3}}>
                {va.languages&&<div style={{fontSize:11,color:'#5F5E5A'}}>🌐 {va.languages}</div>}
                {va.tools&&<div style={{fontSize:11,color:'#5F5E5A'}}>🔧 {va.tools}</div>}
                {va.experience&&<div style={{fontSize:11,color:'#5F5E5A'}}>⏱ {va.experience} · {va.timezone}</div>}
                <div style={{fontSize:11,color:'#5F5E5A'}}>{va.flag} {va.city}, {va.country}</div>
              </div>
              <div style={{padding:'8px 12px',borderTop:'0.5px solid rgba(0,0,0,0.06)'}}>
                {va.status==='available'?(
                  <button style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'6px',borderRadius:8,background:'var(--purple-50)',border:'0.5px solid var(--purple-200)',color:'var(--purple-600)',fontSize:11,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-sans)'}}>
                    <span>Assign to client</span>
                  </button>
                ):(
                  <button style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:5,padding:'6px',borderRadius:8,background:'#F5F4F1',border:'0.5px solid rgba(0,0,0,0.08)',color:'#5F5E5A',fontSize:11,cursor:'pointer',fontFamily:'var(--font-sans)'}}>
                    View profile
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}`
fs.writeFileSync('src/pages/VAPool.jsx', code)
console.log('Done!')