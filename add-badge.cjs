const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')

c = c.replace(
  "import ChatWidget from '../ChatWidget'",
  "import ChatWidget from '../ChatWidget'\nimport { useEffect } from 'react'\nimport { supabase } from '../../lib/supabase'"
)

c = c.replace(
  "  const [showUserMenu, setShowUserMenu] = useState(false)",
  `  const [showUserMenu, setShowUserMenu] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    async function fetchUnread() {
      const { count: msgCount } = await supabase.from('messages').select('*', { count: 'exact', head: true }).eq('read', false)
      const { count: subCount } = await supabase.from('va_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      setUnreadCount((msgCount || 0) + (subCount || 0))
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 30000)
    return () => clearInterval(interval)
  }, [])`
)

c = c.replace(
  "{ icon: Mail, label: 'Inbox', path: '/inbox' },",
  "{ icon: Mail, label: 'Inbox', path: '/inbox', badge: true },"
)

c = c.replace(
  "<Icon size={16} color='#fff' strokeWidth={active ? 2.5 : 1.8} />",
  `<div style={{ position: 'relative' }}>
                <Icon size={16} color='#fff' strokeWidth={active ? 2.5 : 1.8} />
                {item.badge && unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, borderRadius: '50%', background: '#ef4444', border: '1.5px solid #534AB7' }} />
                )}
              </div>`
)

fs.writeFileSync('src/components/layout/Layout.jsx', c)
console.log('Done!')