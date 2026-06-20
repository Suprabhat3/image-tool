import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { PDFOptions, PageSize } from './pdfProcessor';

export const HTML_RENDER_WIDTH_PX = 794;

export const PAGE_DIMENSIONS: Record<PageSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 },
  letter: { width: 215.9, height: 279.4 },
};

const RENDER_ROOT_ATTR = 'data-html-to-pdf-root';

async function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

async function waitForLayout(): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts) {
    await document.fonts.ready;
  }
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function attachRenderRoot(container: HTMLElement): HTMLElement {
  const existing = document.querySelector(`[${RENDER_ROOT_ATTR}]`);
  if (existing) existing.remove();

  const root = document.createElement('div');
  root.setAttribute(RENDER_ROOT_ATTR, 'true');
  Object.assign(root.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: `${HTML_RENDER_WIDTH_PX}px`,
    overflow: 'visible',
    opacity: '0',
    pointerEvents: 'none',
    zIndex: '2147483646',
  });
  root.appendChild(container);
  document.body.appendChild(root);
  return root;
}

export function applyDefaultContentStyles(container: HTMLElement): void {
  Object.assign(container.style, {
    position: 'relative',
    width: `${HTML_RENDER_WIDTH_PX}px`,
    padding: '40px',
    background: '#ffffff',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    fontSize: '11pt',
    lineHeight: '1.5',
    color: '#000000',
    boxSizing: 'border-box',
  });

  container.querySelectorAll('p').forEach((el) => {
    (el as HTMLElement).style.margin = '0 0 0.75em';
    (el as HTMLElement).style.color = '#000000';
  });
  container.querySelectorAll('h1, h2, h3, h4').forEach((el) => {
    (el as HTMLElement).style.margin = '1em 0 0.5em';
    (el as HTMLElement).style.color = '#000000';
  });
  container.querySelectorAll('table').forEach((el) => {
    (el as HTMLElement).style.borderCollapse = 'collapse';
    (el as HTMLElement).style.width = '100%';
    (el as HTMLElement).style.marginBottom = '1em';
  });
  container.querySelectorAll('td, th').forEach((el) => {
    Object.assign((el as HTMLElement).style, {
      border: '1px solid #ccc',
      padding: '4px 8px',
      color: '#000000',
    });
  });
  container.querySelectorAll('img').forEach((el) => {
    (el as HTMLElement).style.maxWidth = '100%';
    (el as HTMLElement).style.display = 'block';
  });
  container.querySelectorAll('pre, code').forEach((el) => {
    Object.assign((el as HTMLElement).style, {
      fontFamily: 'monospace',
      background: '#f5f5f5',
      color: '#000000',
      padding: el.tagName === 'PRE' ? '12px' : '2px 4px',
      borderRadius: '4px',
    });
  });
  container.querySelectorAll('span, li, div').forEach((el) => {
    const node = el as HTMLElement;
    if (!node.style.color) node.style.color = '#000000';
  });
}

export async function convertHtmlToPdf(
  html: string,
  options: PDFOptions,
  filename = 'document.pdf',
  styleApplier: (container: HTMLElement) => void = applyDefaultContentStyles
): Promise<File> {
  const trimmed = html.replace(/<p>\s*<\/p>/g, '').trim();
  if (!trimmed) {
    throw new Error('Document content is empty and cannot be converted.');
  }

  const container = document.createElement('div');
  container.innerHTML = html;
  styleApplier(container);

  const root = attachRenderRoot(container);

  try {
    await waitForImages(container);
    await waitForLayout();

    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: HTML_RENDER_WIDTH_PX,
      windowWidth: HTML_RENDER_WIDTH_PX,
      logging: false,
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error('Failed to render document content.');
    }

    const { pageSize, orientation, margin } = options;
    const pageDims = PAGE_DIMENSIONS[pageSize];
    const pageWidthMm = orientation === 'landscape' ? pageDims.height : pageDims.width;
    const pageHeightMm = orientation === 'landscape' ? pageDims.width : pageDims.height;
    const contentWidthMm = pageWidthMm - 2 * margin;
    const contentHeightMm = pageHeightMm - 2 * margin;

    const pdf = new jsPDF({
      orientation: orientation === 'landscape' ? 'l' : 'p',
      unit: 'mm',
      format: pageSize.toUpperCase(),
    });

    const imgWidthMm = contentWidthMm;
    const imgHeightMm = (canvas.height * imgWidthMm) / canvas.width;
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    let heightLeft = imgHeightMm;
    let yOffset = margin;

    pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidthMm, imgHeightMm);
    heightLeft -= contentHeightMm;

    while (heightLeft > 0) {
      yOffset = margin - (imgHeightMm - heightLeft);
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', margin, yOffset, imgWidthMm, imgHeightMm);
      heightLeft -= contentHeightMm;
    }

    const blob = pdf.output('blob');
    return new File([blob], filename, { type: 'application/pdf' });
  } finally {
    root.remove();
  }
}
