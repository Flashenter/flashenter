const fs = require('fs')
let code = fs.readFileSync('src/pages/VAPool.jsx', 'utf8')
code = code.replace(
  "async function addVA() {",
  "async function addVA() {\n    console.log('Adding VA:', newVA)"
)
fs.writeFileSync('src/pages/VAPool.jsx', code)
console.log('Done')