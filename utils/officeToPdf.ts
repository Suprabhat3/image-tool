import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { marked } from 'marked';
import { convertHtmlToPdf, applyDefaultContentStyles } from './htmlToPdf';
import type { PDFOptions } from './pdfProcessor';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function isPptxFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith('.pptx') ||
    file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  );
}

export function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith('.xlsx') ||
    name.endsWith('.xls') ||
    file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel'
  );
}

function applyMarkdownStyles(container: HTMLElement): void {
  applyDefaultContentStyles(container);
  container.querySelectorAll('blockquote').forEach((el) => {
    Object.assign((el as HTMLElement).style, {
      borderLeft: '4px solid #ccc',
      paddingLeft: '16px',
      color: '#555',
      margin: '0 0 1em',
    });
  });
  container.querySelectorAll('ul, ol').forEach((el) => {
    (el as HTMLElement).style.margin = '0 0 1em';
    (el as HTMLElement).style.paddingLeft = '24px';
  });
}

export async function convertExcelToPdf(
  file: File,
  options: PDFOptions = { pageSize: 'a4', orientation: 'landscape', margin: 10 }
): Promise<File> {
  if (!isExcelFile(file)) {
    throw new Error('Please upload a valid Excel file (.xlsx or .xls).');
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  let html = '';
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    html += `<h2>${escapeHtml(sheetName)}</h2>`;
    html += XLSX.utils.sheet_to_html(sheet);
  }

  const pdfName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
  return convertHtmlToPdf(html, options, pdfName);
}

async function extractSlideTexts(xml: string): Promise<string[]> {
  const texts: string[] = [];
  const regex = /<a:t[^>]*>([^<]*)<\/a:t>/g;
  let match;
  while ((match = regex.exec(xml)) !== null) {
    if (match[1].trim()) texts.push(match[1]);
  }
  return texts;
}

export async function convertPptxToPdf(
  file: File,
  options: PDFOptions = { pageSize: 'a4', orientation: 'landscape', margin: 10 }
): Promise<File> {
  if (!isPptxFile(file)) {
    throw new Error('Please upload a valid .pptx PowerPoint file.');
  }

  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /ppt\/slides\/slide\d+\.xml/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0', 10);
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0', 10);
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    throw new Error('No slides found in the presentation.');
  }

  let html = '';
  for (let i = 0; i < slideFiles.length; i++) {
    const xml = await zip.files[slideFiles[i]].async('text');
    const texts = await extractSlideTexts(xml);
    html += `<div style="page-break-after:always;min-height:480px;border:1px solid #e5e5e5;border-radius:8px;padding:32px;margin-bottom:24px;background:#fafafa;">`;
    html += `<p style="color:#888;font-size:10pt;margin:0 0 20px;">Slide ${i + 1}</p>`;
    if (texts.length === 0) {
      html += `<p style="color:#aaa;font-style:italic;">(No text content on this slide)</p>`;
    } else {
      html += texts
        .map(
          (t, idx) =>
            `<p style="margin:0 0 ${idx === 0 ? '16px' : '10px'};${idx === 0 ? 'font-size:16pt;font-weight:bold;' : ''}">${escapeHtml(t)}</p>`
        )
        .join('');
    }
    html += '</div>';
  }

  const pdfName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
  return convertHtmlToPdf(html, options, pdfName);
}

export async function convertMarkdownToPdf(
  markdown: string,
  options: PDFOptions = { pageSize: 'a4', orientation: 'portrait', margin: 10 },
  filename = 'document.pdf'
): Promise<File> {
  const html = await marked.parse(markdown);
  return convertHtmlToPdf(html, options, filename, applyMarkdownStyles);
}

export async function convertHtmlStringToPdf(
  html: string,
  options: PDFOptions = { pageSize: 'a4', orientation: 'portrait', margin: 10 },
  filename = 'document.pdf'
): Promise<File> {
  return convertHtmlToPdf(html, options, filename);
}
