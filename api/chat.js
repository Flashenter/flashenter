export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { message } = req.body

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: 'You are a helpful support assistant for Flashenter, a VA management SaaS platform. Answer questions about how to use Flashenter features including: adding clients, VA pool management, timesheets, payroll, invoices, client portals, VA portals, contract signing, holiday management, inbox, and team management. Be concise and helpful. If you dont know something specific about Flashenter, suggest contacting support@flashenter.com.',
      messages: [{ role: 'user', content: message }]
    })
  })

  const data = await response.json()
  const reply = data.content?.[0]?.text || 'Sorry I could not get an answer. Please email support@flashenter.com'
  return res.status(200).json({ reply })
}