const fs = require('fs')
let c = fs.readFileSync('src/App.jsx', 'utf8')
c = c.replace(
  "import Invoices from './pages/Invoices' import QuickStart from './pages/QuickStart'",
  "import Invoices from './pages/Invoices'\nimport QuickStart from './pages/QuickStart'"
)
fs.writeFileSync('src/App.jsx', c)
console.log('Done!')