const fs = require('fs')
const code = fs.readFileSync('src/components/layout/Layout.jsx', 'utf8')
// Find and fix the corrupted allQA section
const fixed = code.replace(
  /const allQA = \[[\s\S]*?\]\n\nconst vaGuide/,
  `const allQA = [
  ...faqs,
  { q: 'portal link va virtual assistant', a: 'Go to VA Pool, find the VA card and click Copy portal link. Send that link to your VA.' },
  { q: 'portal link client', a: 'Go to Clients, click on the client card, and click Copy portal link button.' },
  { q: 'invoice billing payment', a: 'Go to Invoices in the nav, click Create invoice, select the client, add line items and send.' },
  { q: 'holiday vacation time off', a: 'Clients can submit holidays through their client portal. You can approve or reject them in Inbox.' },
  { q: 'overtime ot extra hours', a: 'Clients approve overtime through their client portal under the Approve OT tab.' },
  { q: 'contract sign agreement', a: 'Send the portal link to your client or VA. They go to the Contract tab and sign digitally.' },
  { q: 'whatsapp number phone contact support help', a: 'You can reach us on WhatsApp at +1 (809) 431-0366 or email support@flashenter.com. Available Mon-Fri 9am-11pm EST.' },
  { q: 'email address contact us', a: 'Email us at support@flashenter.com or WhatsApp +1 (809) 431-0366 for urgent help.' },
  { q: 'wait waiting long response time', a: 'Our typical response time is between 4-6 minutes during business hours. If urgent call +1 (862) 414-4734.' },
  { q: 'hours business open available when', a: 'We are available Monday to Friday 9:00am to 11:00pm Eastern Time.' },
  { q: 'price cost plan subscription pricing', a: 'Our plans vary! Please visit flashenter.com/signup to see all plans. You can upgrade anytime!' },
  { q: 'cancel subscription account', a: 'To cancel please email support@flashenter.com or WhatsApp us and we will help right away.' },
  { q: 'refund money back', a: 'We offer a 7-day free trial. For refunds contact support@flashenter.com within 7 days of payment.' },
  { q: 'problem error not working bug', a: 'Sorry! Please email support@flashenter.com or WhatsApp +1 (809) 431-0366 and we will fix it asap.' },
]

const vaGuide`
)
fs.writeFileSync('src/components/layout/Layout.jsx', fixed)
console.log('Done!')