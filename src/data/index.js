export const contacts = [
  { id: 1, initials: 'MR', name: 'Maria Rodriguez', title: 'CEO', company: 'Nexora LLC', flag: '🇩🇴', country: 'Dominican Republic', email: 'm.rodriguez@nexora.com', phone: '+1 (809) 555-0142', timezone: 'AST - UTC-4', vas: 3, budget: '$1,200/mo', stage: 'Proposal sent', status: 'hot', colorIndex: 0 },
  { id: 2, initials: 'JK', name: 'James Khumalo', title: 'MD', company: 'BrightPath Co.', flag: '🇿🇦', country: 'South Africa', email: 'j.khumalo@brightpath.co.za', phone: '+27 21 555 0198', timezone: 'SAST - UTC+2', vas: 2, budget: '$760/mo', stage: 'Active client', status: 'client', colorIndex: 1 },
  { id: 3, initials: 'AS', name: 'Ana Santos', title: 'Ops Director', company: 'Global Reach', flag: '🇵🇭', country: 'Philippines', email: 'a.santos@globalreach.ph', phone: '+63 2 555 0177', timezone: 'PHT - UTC+8', vas: 5, budget: 'Evaluating', stage: 'Qualified', status: 'warm', colorIndex: 2 },
  { id: 4, initials: 'CP', name: 'Carlos Peña', title: 'Founder', company: 'Meridian Inc.', flag: '🇨🇴', country: 'Colombia', email: 'c.pena@meridian.co', phone: '+57 1 555 0163', timezone: 'COT - UTC-5', vas: 1, budget: '$380/mo', stage: 'Active client', status: 'client', colorIndex: 3 },
  { id: 5, initials: 'LV', name: 'Laura Vargas', title: 'HR Lead', company: 'TechVista', flag: '🇵🇦', country: 'Panama', email: 'l.vargas@techvista.pa', phone: '+507 555 0184', timezone: 'EST - UTC-5', vas: 3, budget: '$1,140/mo', stage: 'Active client', status: 'client', colorIndex: 4 },
  { id: 6, initials: 'RM', name: 'Rafael Mora', title: 'COO', company: 'Solaris Group', flag: '🇩🇴', country: 'Dominican Republic', email: 'r.mora@solaris.do', phone: '+1 (829) 555-0119', timezone: 'AST - UTC-4', vas: 2, budget: 'TBD', stage: 'New inquiry', status: 'new', colorIndex: 5 },
  { id: 7, initials: 'NB', name: 'Nicole Batista', title: 'Owner', company: 'Batista Consulting', flag: '🇩🇴', country: 'Dominican Republic', email: 'n.batista@batistaco.do', phone: '+1 (809) 555-0388', timezone: 'AST - UTC-4', vas: 4, budget: '$1,600/mo', stage: 'Proposal sent', status: 'hot', colorIndex: 0 },
  { id: 8, initials: 'DL', name: 'David Lee', title: 'Director', company: 'Lee Imports Co.', flag: '🇵🇭', country: 'Philippines', email: 'd.lee@leeimports.ph', phone: '+63 2 555 0344', timezone: 'PHT - UTC+8', vas: 2, budget: '$760/mo', stage: 'Demo scheduled', status: 'hot', colorIndex: 2 },
]

export const vas = [
  { id: 1, initials: 'LC', name: 'Lena Cruz', role: 'Customer Support VA', flag: '🇵🇭', country: 'Philippines', city: 'Manila', timezone: 'UTC+8', status: 'available', type: 'Full-time', languages: 'English (fluent) · Tagalog', tools: 'Zendesk, HubSpot, Slack, Notion', experience: '3 yrs', rating: 5, ratingCount: 2, availability: [true,true,true,true,true,false,false], hasVideo: true, colorIndex: 2 },
  { id: 2, initials: 'KM', name: 'Kofi Mensah', role: 'Sales & Admin VA', flag: '🇿🇦', country: 'South Africa', city: 'Cape Town', timezone: 'UTC+2', status: 'assigned', type: 'Full-time', languages: 'English (fluent) · Zulu', tools: 'Salesforce, Pipedrive, Excel', experience: '4 yrs', rating: 4, ratingCount: 1, availability: [true,true,true,true,true,false,false], hasVideo: true, colorIndex: 1 },
  { id: 3, initials: 'PT', name: 'Pedro Torres', role: 'Operations VA', flag: '🇨🇴', country: 'Colombia', city: 'Bogotá', timezone: 'UTC-5', status: 'available', type: 'Part-time', languages: 'Spanish (native) · English (B2)', tools: 'Asana, Monday, Google Workspace', experience: '2 yrs', rating: 4.8, ratingCount: 0, availability: [true,true,true,false,true,false,false], hasVideo: false, colorIndex: 3 },
  { id: 4, initials: 'SR', name: 'Sofia Reyes', role: 'Executive VA', flag: '🇩🇴', country: 'Dominican Republic', city: 'Santo Domingo', timezone: 'UTC-4', status: 'assigned', type: 'Full-time', languages: 'Spanish (native) · English (fluent)', tools: 'G Suite, Notion, Calendly', experience: '5 yrs', rating: 5, ratingCount: 3, availability: [true,true,true,true,true,false,false], hasVideo: true, colorIndex: 5 },
  { id: 5, initials: 'RP', name: 'Rico Paglinawan', role: 'Data Entry VA', flag: '🇵🇭', country: 'Philippines', city: 'Cebu', timezone: 'UTC+8', status: 'onboarding', type: 'Full-time', languages: 'English (fluent) · Tagalog', tools: 'Excel, Airtable, Shopify', experience: '1 yr', rating: 4.5, ratingCount: 0, availability: [true,true,true,true,true,false,false], hasVideo: true, colorIndex: 2 },
  { id: 6, initials: 'MO', name: 'Marco Ortiz', role: 'Social Media VA', flag: '🇵🇦', country: 'Panama', city: 'Panama City', timezone: 'UTC-5', status: 'available', type: 'Part-time', languages: 'Spanish (native) · English (B1)', tools: 'Hootsuite, Canva, Buffer', experience: '2 yrs', rating: 4.2, ratingCount: 1, availability: [true,true,false,true,true,false,false], hasVideo: false, colorIndex: 4 },
]

export const onboardings = [
  {
    id: 1, vaName: 'Lena Cruz', vaInitials: 'LC', vaColorIndex: 2,
    clientName: 'Global Reach Inc.', clientContact: 'Ana Santos · Manila',
    country: '🇵🇭 Manila', role: 'Customer Support', type: 'Full-time',
    startDate: 'Jun 10, 2026', rate: '$9.50 / hr', adminName: 'Sofia Reyes', adminInitials: 'SR',
    currentStep: 3, status: 'in-progress',
    contract: 'Signed ✓', id_verified: 'Verified ✓', bank: 'Pending',
    interviews: [
      { label: 'Initial interview', date: 'May 28 · 30 min · Video call', done: true, notes: 'Strong candidate. Excellent English. 3 years Zendesk experience. Available Mon-Fri 9am-6pm PHT. Slight concern about timezone overlap for US clients - noted for matching purposes. Recommended for final round.' },
      { label: 'Final interview', date: 'Jun 1 · 45 min · With client', done: true, notes: 'Lena performed excellently. Client Ana Santos was very impressed - said she was professional, calm under pressure, and her Zendesk knowledge was exactly what they needed. Client confirmed they want to proceed.' },
      { label: 'Docs checklist', date: 'Contract ✓ · ID ✓ · Bank pending', done: false, active: true },
      { label: 'Client intro call', date: 'Not yet scheduled', done: false },
    ],
  },
  {
    id: 2, vaName: 'Pedro Torres', vaInitials: 'PT', vaColorIndex: 3,
    clientName: 'Meridian Inc.', clientContact: 'Carlos Peña · Bogotá',
    country: '🇨🇴 Bogotá', role: 'Operations', type: 'Part-time',
    startDate: 'TBD', rate: '$9.50 / hr', adminName: 'Ana Reyes', adminInitials: 'AR',
    currentStep: 2, status: 'action-needed',
    contract: 'Not sent', id_verified: 'Pending', bank: 'Pending',
    interviews: [
      { label: 'Initial interview', date: 'Jun 2 · 25 min · Video call', done: true, notes: 'Good candidate. Operations background strong. Needs to improve English fluency slightly for client-facing work.' },
      { label: 'Final interview', date: 'Jun 6 · 3pm COT · Scheduled', done: false, active: true },
      { label: 'Docs checklist', date: 'Awaiting interview result', done: false },
      { label: 'Client intro call', date: 'Not yet scheduled', done: false },
    ],
  },
]

export const timesheets = [
  { id: 1, initials: 'AR', name: 'Ana Reyes', country: '🇩🇴', hours: 40, ot: 0, pay: 'DOP 18,400', currency: 'DOP', via: 'Local bank', status: 'approved', colorIndex: 0 },
  { id: 2, initials: 'KM', name: 'Kofi Mensah', country: '🇿🇦', hours: 40, ot: 4, pay: 'ZAR 9,800', currency: 'ZAR', via: 'Wise', status: 'review', colorIndex: 1 },
  { id: 3, initials: 'LC', name: 'Lena Cruz', country: '🇵🇭', hours: 38, ot: 0, pay: 'PHP 22,800', currency: 'PHP', via: 'Payoneer', status: 'approved', colorIndex: 2 },
  { id: 4, initials: 'PT', name: 'Pedro Torres', country: '🇨🇴', hours: 40, ot: 6, pay: '$552 USD', currency: 'USD', via: 'Deel', status: 'review', colorIndex: 3 },
  { id: 5, initials: 'MO', name: 'Marco Ortiz', country: '🇵🇦', hours: 40, ot: 0, pay: '$480 USD', currency: 'USD', via: 'Wise', status: 'approved', colorIndex: 4 },
  { id: 6, initials: 'SR', name: 'Sofia Reyes', country: '🇩🇴', hours: 35, ot: 0, pay: 'DOP 16,100', currency: 'DOP', via: 'Local bank', status: 'approved', colorIndex: 5 },
  { id: 7, initials: 'JL', name: 'Juan Lopez', country: '🇨🇴', hours: 40, ot: 0, pay: '$460 USD', currency: 'USD', via: 'Deel', status: 'approved', colorIndex: 1 },
  { id: 8, initials: 'RP', name: 'Rico Paglinawan', country: '🇵🇭', hours: 32, ot: 0, pay: '-', currency: 'PHP', via: 'Payoneer', status: 'missing', colorIndex: 2 },
]

export const reminders = [
  { id: 1, title: 'Follow up on proposal - no response yet', sub: 'Sent proposal for 3 VAs on Jun 1. Maria has not replied in 3 days.', when: 'Overdue - was due Jun 3', type: 'Follow-up', urgency: 'overdue', done: false },
  { id: 2, title: 'Call Maria to discuss VA start dates', sub: 'She mentioned availability after Jun 10. Confirm onboarding timeline.', when: 'Today · 4:00pm DR time', type: 'Call', urgency: 'today', done: false },
  { id: 3, title: 'Send contract if she confirms', sub: '3x contractor agreements ready to send via Flashenter onboarding links.', when: 'Jun 7, 2026', type: 'Email', urgency: 'upcoming', done: false },
  { id: 4, title: 'Send proposal document', sub: '3 VA package · $1,200/mo · Sent via email', when: 'Done · Jun 1, 2026', type: 'Email', urgency: 'done', done: true },
]

export const notes = [
  { id: 1, author: 'James Rivera', date: 'Jun 1, 2026 · 11:32am', text: 'Maria confirmed budget of $1,200/mo for 3 VAs. She wants customer support roles - English-speaking, available 9am-5pm EST. Sent proposal. She said she\'ll review with her partner and get back by end of week. Decision maker is Maria herself.', type: 'Call summary', important: true },
  { id: 2, author: 'James Rivera', date: 'May 20, 2026 · 3:14pm', text: 'Qualified - she has a team of 12 and is overwhelmed with inbound support tickets. Currently using Upwork but unhappy with reliability. Flashenter\'s dedicated VA model is a good fit. She liked the Friday pay system.', type: 'Qualification note', important: false },
  { id: 3, author: 'James Rivera', date: 'May 16, 2026 · 10:05am', text: 'First call went well. Referred by Carlos Peña (Meridian). Very warm intro. Interested in trying 1 VA first, then scaling to 3 if happy. Follow up in 3 days.', type: 'First call', important: false, positive: true },
]
