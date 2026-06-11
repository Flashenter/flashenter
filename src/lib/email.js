export async function sendEmail({ to, subject, html }) {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, html })
    })
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Email error:', error)
  }
}

export function timesheetSubmittedEmail(vaName, hours, weekStart) {
  return {
    subject: `New timesheet submitted - ${vaName}`,
    html: `
      <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">
          <span style="color: #534AB7;">Flash</span>enter
        </div>
        <h2 style="font-size: 20px; margin-bottom: 16px;">New Timesheet Submitted</h2>
        <div style="background: #F5F4F1; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <p><strong>VA:</strong> ${vaName}</p>
          <p><strong>Week:</strong> ${weekStart}</p>
          <p><strong>Hours:</strong> ${hours}</p>
        </div>
        <a href="https://flashenter.vercel.app/inbox" style="background: #534AB7; color: #fff; padding: 12px 24px; border-radius: 40px; text-decoration: none; font-weight: 600;">
          Review in Inbox
        </a>
      </div>
    `
  }
}

export function contractSignedEmail(clientName, type) {
  return {
    subject: `Contract signed - ${clientName}`,
    html: `
      <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">
          <span style="color: #534AB7;">Flash</span>enter
        </div>
        <h2 style="font-size: 20px; margin-bottom: 16px;">Contract Signed</h2>
        <div style="background: #EAF3DE; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <p>✅ <strong>${clientName}</strong> has signed the ${type} agreement.</p>
        </div>
        <a href="https://flashenter.vercel.app/inbox" style="background: #534AB7; color: #fff; padding: 12px 24px; border-radius: 40px; text-decoration: none; font-weight: 600;">
          View in Inbox
        </a>
      </div>
    `
  }
}

export function newMessageEmail(fromName, subject, body) {
  return {
    subject: `New message from ${fromName} - ${subject}`,
    html: `
      <div style="font-family: DM Sans, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="font-size: 24px; font-weight: 700; margin-bottom: 20px;">
          <span style="color: #534AB7;">Flash</span>enter
        </div>
        <h2 style="font-size: 20px; margin-bottom: 16px;">New Message</h2>
        <div style="background: #F5F4F1; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
          <p><strong>From:</strong> ${fromName}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong> ${body}</p>
        </div>
        <a href="https://flashenter.vercel.app/inbox" style="background: #534AB7; color: #fff; padding: 12px 24px; border-radius: 40px; text-decoration: none; font-weight: 600;">
          Reply in Inbox
        </a>
      </div>
    `
  }
}