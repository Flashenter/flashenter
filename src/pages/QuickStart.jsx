import { useEffect } from 'react'
import { jsPDF } from 'jspdf'

export default function QuickStart() {
  useEffect(() => {
    generatePDF()
  }, [])

  function generatePDF() {
    const doc = new jsPDF()
    const purple = [83, 74, 183]
    const dark = [26, 26, 24]
    const gray = [136, 135, 128]
    const lightGray = [245, 244, 241]

    // Header background
    doc.setFillColor(...purple)
    doc.rect(0, 0, 210, 40, 'F')

    // Logo
    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('Flashenter', 20, 22)

    // Tagline
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(200, 197, 246)
    doc.text('One platform · One team · One price', 20, 32)

    // Title
    doc.setFontSize(20)
    doc.setTextColor(...dark)
    doc.setFont('helvetica', 'bold')
    doc.text('Quick Start Guide', 20, 58)

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...gray)
    doc.text('Get up and running with Flashenter in under 10 minutes', 20, 67)

    // Divider
    doc.setDrawColor(...purple)
    doc.setLineWidth(0.5)
    doc.line(20, 72, 190, 72)

    let y = 82

    const steps = [
      {
        num: '1',
        title: 'Sign in to your workspace',
        desc: 'Go to flashenter.com and click "Continue with Google" to sign in. First time users will need admin approval before accessing the dashboard.',
      },
      {
        num: '2',
        title: 'Add your first client',
        desc: 'Click "Clients" in the bottom navigation bar. Click "Add client" and fill in their name, company, country and contact details. Click Save.',
      },
      {
        num: '3',
        title: 'Add VAs to your pool',
        desc: 'Click "VA Pool" in the navigation. Click "Add VA" and fill in their details including name, role, country and timezone. Click Save.',
      },
      {
        num: '4',
        title: 'Assign a VA to a client',
        desc: 'In the VA Pool, find the VA card and click "Assign to client". Select the client from the dropdown and click Confirm.',
      },
      {
        num: '5',
        title: 'Send portal links',
        desc: 'In Clients, click "Copy portal link" on any client card and send the link to them. In VA Pool, click "Copy portal link" on any VA card and send it to your VA.',
      },
      {
        num: '6',
        title: 'Get contracts signed',
        desc: 'Ask your client and VA to open their portal link and go to the Contract tab. They can sign digitally with their mouse or finger. You will receive an email notification when they sign.',
      },
      {
        num: '7',
        title: 'Approve weekly timesheets',
        desc: 'Every week VAs submit their hours through their portal. Go to Inbox and click "VA Timesheets" to see all submissions. Click Approve on each one.',
      },
      {
        num: '8',
        title: 'Run payroll',
        desc: 'Go to Payroll in the navigation. Add payroll records for each VA, click Approve on each row, then click the "Run payroll" button to mark them all as paid.',
      },
      {
        num: '9',
        title: 'Create and send invoices',
        desc: 'Go to Invoices, click "Create invoice", select the client, add your line items and click "Send to client". The client will receive the invoice by email.',
      },
      {
        num: '10',
        title: 'Manage your team',
        desc: 'Go to Team in the navigation to approve new team members who have registered. Go to Settings for account and workspace settings.',
      },
    ]

    steps.forEach((step, i) => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }

      // Step number circle
      doc.setFillColor(...purple)
      doc.circle(27, y + 4, 5, 'F')
      doc.setFontSize(9)
      doc.setTextColor(255, 255, 255)
      doc.setFont('helvetica', 'bold')
      doc.text(step.num, 27 - (step.num.length > 1 ? 2.5 : 1.5), y + 7)

      // Step title
      doc.setFontSize(12)
      doc.setTextColor(...dark)
      doc.setFont('helvetica', 'bold')
      doc.text(step.title, 38, y + 5)

      // Step description
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...gray)
      const lines = doc.splitTextToSize(step.desc, 150)
      doc.text(lines, 38, y + 12)

      y += 12 + (lines.length * 5) + 6
    })

    // Footer
    if (y > 260) {
      doc.addPage()
      y = 20
    }

    doc.setDrawColor(...purple)
    doc.line(20, y + 5, 190, y + 5)

    doc.setFillColor(...purple)
    doc.rect(0, y + 10, 210, 30, 'F')

    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('Need help?', 20, y + 22)
    doc.setFont('helvetica', 'normal')
    doc.text('Email: support@flashenter.com', 20, y + 29)
    doc.text('WhatsApp: +1 (809) 431-0366', 110, y + 29)

    doc.save('Flashenter-Quick-Start-Guide.pdf')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F4F1', fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          <span style={{ color: '#534AB7' }}>Flash</span>enter Quick Start Guide
        </div>
        <div style={{ fontSize: 14, color: '#888780', marginBottom: 24 }}>Your PDF is downloading automatically...</div>
        <button onClick={generatePDF} style={{ padding: '12px 24px', borderRadius: 40, border: 'none', background: '#534AB7', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
          Download again
        </button>
      </div>
    </div>
  )
}