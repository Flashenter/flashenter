const fs = require('fs')
let c = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')

// Replace Search... text with Help
c = c.replace('<span>Search...</span>', '<span>Help</span>')

// Remove the Search icon
c = c.replace("<Search size={13} />\n            <span>Help</span>", "<span>❓ Help</span>")

fs.writeFileSync('src/components/layout/Layout.jsx', c)
console.log('Done!')