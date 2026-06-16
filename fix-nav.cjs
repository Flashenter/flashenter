const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')
c = c.replace(
  "color={active ? 'var(--purple-600)' : '#888780'}",
  "color='#fff'"
)
fs.writeFileSync('src/components/layout/Layout.jsx', c)
console.log('Done!')