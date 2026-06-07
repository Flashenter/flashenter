import { ArrowUpRight } from 'lucide-react'

const colors = {
  purple: { bg: '#EEEDFE', text: '#534AB7', border: '#AFA9EC' },
  green:  { bg: '#EAF3DE', text: '#3B6D11', border: '#7CB342' },
  red:    { bg: '#FCEBEB', text: '#A32D2D', border: '#F09595' },
  amber:  { bg: '#FEF3E2', text: '#854F0B', border: '#EF9F27' },
  blue:   { bg: '#E6F1FB', text: '#185FA5', border: '#90CAF9' },
  gray:   { bg: '#F5F4F1', text: '#5F5E5A', border: 'rgba(0,0,0,0.1)' },
}

const avatarColors = [
  { bg: '#EEEDFE', text: '#534AB7' },
  { bg: '#EAF3DE', text: '#3B6D11' },
  { bg: '#FEF3E2', text: '#854F0B' },
  { bg: '#FCEBEB', text: '#A32D2D' },
  { bg: '#E6F1FB', text: '#185FA5' },
  { bg: '#F5F4F1', text: '#5F5E5A' },
]

export function Card({ children, style = {}, className = '', onClick }) {
  return (
    <div className={className} onClick={onClick} style={{
      background: '#fff',
      border: '0.5px solid rgba(0,0,0,0.08)',
      borderRadius: 14,
      padding: '14px',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function MetricCard({ label, value, sub, subColor, icon: Icon }) {
  return (
    <div style={{ background: '#fff', border: '0.5px solid rgba(0,0,0,0.08)', borderRadius: 14, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: '#888780', letterSpacing: 0.3 }}>{label}</div>
        {Icon && <Icon size={14} color="#B4B2A9" />}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.3px', marginBottom: 3 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: subColor || '#888780' }}>{sub}</div>}
    </div>
  )
}

export function Tag({ children, color = 'gray', size = 'sm' }) {
  const c = colors[color] || colors.gray
  return (
    <span style={{
      background: c.bg, color: c.text,
      border: `0.5px solid ${c.border}`,
      borderRadius: 20,
      padding: size === 'xs' ? '1px 6px' : '2px 8px',
      fontSize: size === 'xs' ? 9 : 10,
      fontWeight: 500,
      display: 'inline-block',
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}

export function Avatar({ initials = '?', size = 36, colorIndex = 0 }) {
  const c = avatarColors[colorIndex % avatarColors.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c.bg, color: c.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: 600,
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export function Button({ children, onClick, variant = 'default', icon: Icon, style = {}, disabled = false }) {
  const isPrimary = variant === 'primary'
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 16px', borderRadius: 40,
        border: isPrimary ? 'none' : '0.5px solid rgba(0,0,0,0.1)',
        background: isPrimary ? '#534AB7' : '#fff',
        color: isPrimary ? '#fff' : '#1a1a18',
        fontSize: 12, fontWeight: isPrimary ? 600 : 400,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-sans)',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {Icon && <Icon size={13} />}
      {children}
    </button>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.3px', margin: 0 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: '#888780', marginTop: 4, margin: 0 }}>{subtitle}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 8 }}>{children}</div>}
    </div>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#888780', textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {children}
      </div>
      {action && (
        <span onClick={action.onClick} style={{ fontSize: 11, color: 'var(--purple-600)', cursor: 'pointer' }}>
          {action.label}
        </span>
      )}
    </div>
  )
}