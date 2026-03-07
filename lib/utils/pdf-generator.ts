import jsPDF from 'jspdf'
import 'jspdf-autotable'

interface ReportSection {
  title: string
  content: string
}

export function generatePDFReport(
  personName: string,
  reportMarkdown: string,
  dateRange?: string
): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  let yPosition = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const maxWidth = pageWidth - 2 * margin

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace: number = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    
    const lines = doc.splitTextToSize(text, maxWidth)
    lines.forEach((line: string) => {
      checkPageBreak()
      doc.text(line, margin, yPosition)
      yPosition += fontSize * 0.5
    })
    yPosition += 3
  }

  // Add header with logo placeholder
  doc.setFillColor(37, 99, 235) // Blue color
  doc.rect(0, 0, pageWidth, 15, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('FedhaWatch Intelligence Report', margin, 10)
  
  doc.setTextColor(0, 0, 0)
  yPosition = 25

  // Parse markdown and generate PDF
  const lines = reportMarkdown.split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (!line) {
      yPosition += 2
      continue
    }

    // Main title (# )
    if (line.startsWith('# ')) {
      checkPageBreak(15)
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      const text = line.replace('# ', '')
      doc.text(text, margin, yPosition)
      yPosition += 12
      doc.setTextColor(0, 0, 0)
      continue
    }

    // Section title (## )
    if (line.startsWith('## ')) {
      checkPageBreak(12)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(37, 99, 235)
      const text = line.replace('## ', '')
      doc.text(text, margin, yPosition)
      yPosition += 8
      doc.setTextColor(0, 0, 0)
      continue
    }

    // Subsection title (### )
    if (line.startsWith('### ')) {
      checkPageBreak(10)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      const text = line.replace('### ', '')
      doc.text(text, margin, yPosition)
      yPosition += 7
      continue
    }

    // Subsubsection title (#### )
    if (line.startsWith('#### ')) {
      checkPageBreak(8)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      const text = line.replace('#### ', '')
      doc.text(text, margin, yPosition)
      yPosition += 6
      continue
    }

    // Horizontal rule (---)
    if (line.startsWith('---')) {
      checkPageBreak(5)
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 5
      continue
    }

    // Bullet points (- or *)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      checkPageBreak()
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      const text = line.replace(/^[*-] /, '')
      doc.text('•', margin, yPosition)
      const wrappedText = doc.splitTextToSize(text, maxWidth - 10)
      wrappedText.forEach((wrappedLine: string, index: number) => {
        if (index > 0) checkPageBreak()
        doc.text(wrappedLine, margin + 5, yPosition)
        yPosition += 5
      })
      continue
    }

    // Bold text (**text**)
    if (line.includes('**')) {
      checkPageBreak()
      doc.setFontSize(10)
      const parts = line.split('**')
      let xPos = margin
      parts.forEach((part, index) => {
        if (index % 2 === 1) {
          doc.setFont('helvetica', 'bold')
        } else {
          doc.setFont('helvetica', 'normal')
        }
        const textWidth = doc.getTextWidth(part)
        if (xPos + textWidth > pageWidth - margin) {
          yPosition += 5
          xPos = margin
          checkPageBreak()
        }
        doc.text(part, xPos, yPosition)
        xPos += textWidth
      })
      yPosition += 6
      continue
    }

    // Regular paragraph
    checkPageBreak()
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const wrappedText = doc.splitTextToSize(line, maxWidth)
    wrappedText.forEach((wrappedLine: string) => {
      checkPageBreak()
      doc.text(wrappedLine, margin, yPosition)
      yPosition += 5
    })
    yPosition += 2
  }

  // Add footer with page numbers
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
    doc.text(
      'FedhaWatch.org - Campaign Finance Intelligence',
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    )
  }

  // Return as buffer
  return Buffer.from(doc.output('arraybuffer'))
}
