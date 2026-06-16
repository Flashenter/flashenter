const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')
c = c.replace(`            <span>Help</span>
            <span style={{ fontSize: 10, background: '#e8e7e4', padding: '1px 6px', borderRadius: 4, color: '#5F5E5A' }}>Help</span>`, `            <span>❓ Help</span>`)
fs.writeFileSync('src/components/layout/Layout.jsx', c)
console.log('Done!')