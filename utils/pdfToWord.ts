import { Document, Packer, Paragraph, TextRun, PageBreak } from 'docx';

let pdfjsLib: typeof import('pdfjs-dist') | null = null;

async function getPdfJs() {
  if (!pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
  return pdfjsLib;
}

export async function convertPdfToWord(file: File): Promise<File> {
  const { getDocument } = await getPdfJs();
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;

  const children: (Paragraph)[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();

    if (text) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text, size: 24 })],
          spacing: { after: 200 },
        })
      );
    } else {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: `[Page ${i} — no extractable text]`, italics: true, size: 22 })],
          spacing: { after: 200 },
        })
      );
    }

    if (i < pdf.numPages) {
      children.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  const docxName = file.name.replace(/\.[^/.]+$/, '') + '.docx';
  return new File([blob], docxName, {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}
