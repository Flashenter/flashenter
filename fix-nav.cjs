const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')

// Fix nav button colors to be visible on purple background
c = c.replace(
  /color: active \? '[^']+' : '[^']+'/g,
  "color: active ? '#fff' : 'rgba(255,255,255,0.7)'"
)
c = c.replace(
  /background: active \? '[^']+' : '[^']+'/g,
  "background: active ? 'rgba(255,255,255,0.15)' : 'transparent'"
)

fs.writeFileSync('src/components/layout/Layout.jsx', c)
console.log('Done!')