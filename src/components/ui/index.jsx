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
    <div style={{
      background: '#F5F4F1',
      borderRadius: 12,
      padding: '14px',
    }}>
      <div style={{ fontSize: 11, color: '#888780', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
        {Icon && <Icon size={13} />}
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 600, color: '#1a1a18', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, marginTop: 5, color: subColor || '#888780' }}>{sub}</div>}
    </div>
  )
}

const tagStyles = {
  green:  { background: 'var(--green-50)',  color: 'var(--green-600)' },
  purple: { background: 'var(--purple-50)', color: 'var(--purple-800)' },
  amber:  { background: 'var(--amber-50)',  color: 'var(--amber-600)' },
  red:    { background: 'var(--red-50)',    color: 'var(--red-600)' },
  teal:   { background: 'var(--teal-50)',   color: 'var(--teal-600)' },
  gray:   { background: 'var(--gray-50)',   color: 'var(--gray-600)', border: '0.5px solid rgba(0,0,0,0.08)' },
  blue:   { background: '#E6F1FB',          color: '#185FA5' },
}

export function Tag({ color = 'gray', children, size = 'sm' }) {
  return (
    <span style={{
      fontSize: size === 'xs' ? 9 : 10,
      padding: size === 'xs' ? '1px 6px' : '2px 8px',
      borderRadius: 20,
      fontWeight: 500,
      display: 'inline-block',
      whiteSpace: 'nowrap',
      ...tagStyles[color],
    }}>
      {children}
    </span>
  )
}

const avColors = [
  { bg: 'var(--purple-50)', color: 'var(--purple-600)' },
  { bg: 'var(--teal-50)',   color: 'var(--teal-600)' },
  { bg: '#E6F1FB',          color: '#185FA5' },
  { bg: 'var(--amber-50)',  color: 'var(--amber-600)' },
  { bg: 'var(--red-50)',    color: '#993C1D' },
  { bg: 'var(--green-50)',  color: 'var(--green-600)' },
]

export function Avatar({ initials, size = 32, colorIndex = 0 }) {
  const c = avColors[colorIndex % avColors.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c.bg, color: c.color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export function Button({ children, variant = 'default', onClick, style = {}, icon: Icon }) {
  const variants = {
    default: { background: '#F5F4F1', color: '#1a1a18', border: '0.5px solid rgba(0,0,0,0.1)' },
    primary: { background: 'var(--purple-600)', color: '#fff', border: 'none' },
    success: { background: 'var(--green-50)', color: 'var(--green-600)', border: '0.5px solid #97C459' },
    danger:  { background: 'var(--red-50)',   color: 'var(--red-600)',   border: '0.5px solid #F09595' },
    ghost:   { background: 'transparent',     color: 'var(--purple-600)', border: 'none' },
  }
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '7px 14px', borderRadius: 40, cursor: 'pointer',
        fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-sans)',
        transition: 'opacity 0.15s',
        ...variants[variant],
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {Icon && <Icon size={13} />}
      {children}
    </button>
  )
}

export function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
      <h2 style={{ fontSize: 13, fontWeight: 600, color: '#1a1a18' }}>{children}</h2>
      {action && <span style={{ fontSize: 11, color: 'var(--purple-600)', cursor: 'pointer' }} onClick={action.onClick}>{action.label}</span>}
    </div>
  )
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }} className="animate-fade-up">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a1a18', letterSpacing: '-0.3px' }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: '#888780', marginTop: 3 }}>{subtitle}</p>}
      </div>
      {children && <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>{children}</div>}
    </div>
  )
}
