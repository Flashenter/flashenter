const fs = require('fs')

const files = [
  'src/pages/Timesheets.jsx',
  'src/pages/Payroll.jsx',
  'src/pages/Inbox.jsx',
  'src/pages/Invoices.jsx',
  'src/pages/Contacts.jsx',
  'src/pages/VAPool.jsx',
]

files.forEach(file => {
  let c = fs.readFileSync(file, 'utf8')
  c = c.replace('export default function Timesheets() {', 'export default function Timesheets({ org }) {')
  c = c.replace('export default function Payroll() {', 'export default function Payroll({ org }) {')
  c = c.replace('export default function Inbox() {', 'export default function Inbox({ org }) {')
  c = c.replace('export default function Invoices() {', 'export default function Invoices({ org }) {')
  c = c.replace('export default function Contacts() {', 'export default function Contacts({ org }) {')
  c = c.replace('export default function VAPool() {', 'export default function VAPool({ org }) {')
  fs.writeFileSync(file, c)
})
console.log('Done!')