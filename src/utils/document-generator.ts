import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { SRS_TEMPLATE } from '@/constants/srs-template';

const sanitizeFilename = (name: string) => {
  return name.replace(/[/\\?%*:|"<>]/g, '-').replace(/\s+/g, '_');
};

export const generatePdf = async (data: Record<string, string>) => {
  const doc = new jsPDF();
  const rawTitle = data.projectName || 'SRS';
  const title = rawTitle.toUpperCase();
  const version = data.version || '1.0.0';
  const author = data.author || 'Anonymous';
  const date = data.date || new Date().toLocaleDateString('en-GB');

  // --- 1. TITLE PAGE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('Software Requirements', 105, 80, { align: 'center' });
  doc.text('Specification', 105, 95, { align: 'center' });
  
  doc.setFontSize(36);
  doc.setTextColor(15, 23, 42); // Deep Navy
  doc.text(title, 105, 130, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(`Version ${version}`, 105, 160, { align: 'center' });
  doc.text(`Author: ${author}`, 105, 175, { align: 'center' });
  doc.text(`Date: ${date}`, 105, 190, { align: 'center' });

  // --- 2. TABLE OF CONTENTS ---
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('Table of Contents', 20, 30);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  let tocY = 50;
  SRS_TEMPLATE.forEach((section, idx) => {
    doc.text(section.title, 20, tocY);
    doc.text('.........', 160, tocY);
    doc.text(`${idx + 3}`, 185, tocY);
    tocY += 10;
  });

  // --- 3. MAIN CONTENT ---
  doc.addPage();
  let y = 30;

  SRS_TEMPLATE.forEach((section, sIdx) => {
    if (y > 250) { doc.addPage(); y = 30; }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text(section.title, 20, y);
    doc.setTextColor(0, 0, 0);
    y += 12;

    section.questions.forEach((q, qIdx) => {
      const subNumber = `${sIdx + 1}.${qIdx + 1}`;
      const answer = data[q.id] || 'Not specified.';
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${subNumber} ${q.label}`, 20, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      const splitText = doc.splitTextToSize(answer, 170);
      if (y + (splitText.length * 7) > 270) { doc.addPage(); y = 30; }
      doc.text(splitText, 20, y);
      y += (splitText.length * 7) + 12;
    });
    y += 5;
  });

  // --- 4. FOOTERS ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Page ${i} of ${pageCount}`, 105, 285, { align: 'center' });
  }

  const safeName = rawTitle.replace(/[/\\?%*:|"<>]/g, '-');
  const base64Data = doc.output('datauristring');
  
  try {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: `${safeName}.pdf`, content: base64Data, type: 'base64' })
    });
    if (!res.ok) throw new Error("Failed backend export");
    alert(`Success: ${safeName}.pdf was saved perfectly to your Downloads folder!`);
  } catch (err) {
    console.error("Local save failed", err);
    alert("Could not force-save to Downloads folder. Is the Next.js server running?");
  }
};

export const generateDocx = async (data: Record<string, string>) => {
  const rawTitle = data.projectName || 'SRS';
  const title = rawTitle.toUpperCase();
  const children: any[] = [
    new Paragraph({ text: "Software Requirements Specification", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
    new Paragraph({ children: [new TextRun({ text: title, bold: true, size: 72, color: "0F172A" })], alignment: AlignmentType.CENTER }),
    new Paragraph({ text: `Version: ${data.version}`, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: `Author: ${data.author}`, alignment: AlignmentType.CENTER }),
    new Paragraph({ text: `Date: ${data.date}`, alignment: AlignmentType.CENTER }),
    
    new Paragraph({ text: "Table of Contents", heading: HeadingLevel.HEADING_2, pageBreakBefore: true }),
    ...SRS_TEMPLATE.map(s => new Paragraph({ text: s.title })),

    ...SRS_TEMPLATE.flatMap((section, sIdx) => [
      new Paragraph({ text: section.title, heading: HeadingLevel.HEADING_2, pageBreakBefore: sIdx === 0 }),
      ...section.questions.flatMap((q, qIdx) => [
        new Paragraph({ children: [new TextRun({ text: `${sIdx + 1}.${qIdx + 1} ${q.label}`, bold: true })] }),
        new Paragraph({ text: data[q.id] || "Not specified." })
      ])
    ])
  ];

  const doc = new Document({ sections: [{ children }] });
  const base64Data = await Packer.toBase64String(doc);
  const safeName = rawTitle.replace(/[/\\?%*:|"<>]/g, '-');

  try {
    const res = await fetch('/api/download', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename: `${safeName}.docx`, content: base64Data, type: 'base64' })
    });
    if (!res.ok) throw new Error("Failed backend export");
    alert(`Success: ${safeName}.docx was saved perfectly to your Downloads folder!`);
  } catch (err) {
    console.error("Local save failed", err);
    alert("Could not force-save to Downloads folder. Is the Next.js server running?");
  }
};
