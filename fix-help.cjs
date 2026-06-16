const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')

// Add showHelp state
c = c.replace(
  'const [showUserMenu, setShowUserMenu] = useState(false)',
  'const [showUserMenu, setShowUserMenu] = useState(false)\n  const [showHelp, setShowHelp] = useState(false)'
)

// Add onClick to search button
c = c.replace(
  "cursor: 'pointer',\n            fontSize: 12, color: '#888780',\n          }}>",
  "cursor: 'pointer',\n            fontSize: 12, color: '#888780',\n          }} onClick={() => setShowHelp(true)}>"
)

fs.writeFileSync('src/components/layout/Layout.jsx', c)
console.log('Done!')