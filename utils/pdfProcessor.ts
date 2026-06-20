import jsPDF from 'jspdf';
import mammoth from 'mammoth';
import { PDFDocument, PDFName, PDFRawStream, StandardFonts, rgb, degrees } from 'pdf-lib';
import { compressImage } from './imageProcessor';
import { convertHtmlToPdf, applyDefaultContentStyles } from './htmlToPdf';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export type PageSize = 'a4' | 'letter' | 'a3' | 'a5';
export type PageOrientation = 'portrait' | 'landscape';

export interface PDFOptions {
  pageSize: PageSize;
  orientation: PageOrientation;
  margin: number; // in mm
}

export interface ImageForPDF {
  file: File;
  width: number;
  height: number;
  dataUrl?: string;
}

// Page dimensions in mm (width, height)
const PAGE_DIMENSIONS: Record<PageSize, { width: number; height: number }> = {
  a4: { width: 210, height: 297 },
  a3: { width: 297, height: 420 },
  a5: { width: 148, height: 210 },
  letter: { width: 215.9, height: 279.4 },
};

/**
 * Convert image file to base64 data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions from file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Prepare images for PDF conversion (with data URLs and dimensions)
 */
export const prepareImagesForPDF = async (files: File[]): Promise<ImageForPDF[]> => {
  return Promise.all(
    files.map(async (file) => {
      const dataUrl = await fileToDataUrl(file);
      const dimensions = await getImageDimensions(file);
      return {
        file,
        ...dimensions,
        dataUrl,
      };
    })
  );
};

/**
 * Calculate scaled dimensions to fit image on page
 */
export const calculateScaledDimensions = (
  imageWidth: number,
  imageHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  const aspectRatio = imageWidth / imageHeight;
  let scaledWidth = maxWidth;
  let scaledHeight = maxWidth / aspectRatio;

  if (scaledHeight > maxHeight) {
    scaledHeight = maxHeight;
    scaledWidth = maxHeight * aspectRatio;
  }

  return { width: scaledWidth, height: scaledHeight };
};

/**
 * Create PDF from images (one image per page)
 */
export const createPDFFromImages = async (
  images: ImageForPDF[],
  options: PDFOptions
): Promise<jsPDF> => {
  const { pageSize, orientation, margin } = options;
  const pageDims = PAGE_DIMENSIONS[pageSize];
  
  // Swap dimensions if landscape
  const pageWidth = orientation === 'landscape' ? pageDims.height : pageDims.width;
  const pageHeight = orientation === 'landscape' ? pageDims.width : pageDims.height;

  const pdf = new jsPDF({
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: pageSize.toUpperCase(),
  });

  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (!image.dataUrl) continue;

    // Add new page after first image
    if (i > 0) {
      pdf.addPage();
    }

    // Calculate scaled dimensions
    const scaled = calculateScaledDimensions(
      image.width,
      image.height,
      contentWidth,
      contentHeight
    );

    // Center the image on the page
    const x = margin + (contentWidth - scaled.width) / 2;
    const y = margin + (contentHeight - scaled.height) / 2;

    // Add image to PDF
    pdf.addImage(image.dataUrl, 'JPEG', x, y, scaled.width, scaled.height);
  }

  return pdf;
};

/**
 * Create PDF with multiple images on a single page (organized in grid)
 */
export const createGridPDF = async (
  images: ImageForPDF[],
  options: PDFOptions,
  imagesPerRow: number = 2
): Promise<jsPDF> => {
  const { pageSize, orientation, margin } = options;
  const pageDims = PAGE_DIMENSIONS[pageSize];

  const pageWidth = orientation === 'landscape' ? pageDims.height : pageDims.width;
  const pageHeight = orientation === 'landscape' ? pageDims.width : pageDims.height;

  const pdf = new jsPDF({
    orientation: orientation === 'landscape' ? 'l' : 'p',
    unit: 'mm',
    format: pageSize.toUpperCase(),
  });

  const contentWidth = pageWidth - 2 * margin;
  const contentHeight = pageHeight - 2 * margin;

  const cellWidth = contentWidth / imagesPerRow;
  const padding = 2;

  let currentPage = 0;
  let imagesOnPage = 0;
  const imagesPerPage = imagesPerRow * Math.floor(contentHeight / cellWidth);

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (!image.dataUrl) continue;

    // Add new page if needed
    if (imagesOnPage > 0 && imagesOnPage % imagesPerPage === 0) {
      pdf.addPage();
      currentPage++;
      imagesOnPage = 0;
    }

    const row = Math.floor(imagesOnPage / imagesPerRow);
    const col = imagesOnPage % imagesPerRow;

    const cellHeight = cellWidth;
    const maxImgWidth = cellWidth - 2 * padding;
    const maxImgHeight = cellHeight - 2 * padding;

    const scaled = calculateScaledDimensions(
      image.width,
      image.height,
      maxImgWidth,
      maxImgHeight
    );

    const x = margin + col * cellWidth + (cellWidth - scaled.width) / 2;
    const y = margin + row * cellHeight + (cellHeight - scaled.height) / 2;

    pdf.addImage(image.dataUrl, 'JPEG', x, y, scaled.width, scaled.height);

    imagesOnPage++;
  }

  return pdf;
};

/**
 * Download PDF file
 */
export const downloadPDF = (pdf: jsPDF, filename: string = 'images.pdf'): void => {
  pdf.save(filename);
};

export async function mergePdfs(files: File[]): Promise<File> {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new File([pdfBytes as any], 'merged_document.pdf', { type: 'application/pdf' });
}

export function isDocxFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith('.docx') || file.type === DOCX_MIME;
}

function applyDocxContentStyles(container: HTMLElement): void {
  applyDefaultContentStyles(container);
  container.style.fontFamily = "'Times New Roman', Times, serif";
  container.style.fontSize = '12pt';
}

/**
 * Convert a Word document (.docx) to PDF in the browser
 */
export async function convertDocxToPdf(
  file: File,
  options: PDFOptions = { pageSize: 'a4', orientation: 'portrait', margin: 10 }
): Promise<File> {
  if (!isDocxFile(file)) {
    throw new Error('Please upload a valid .docx Word document.');
  }

  const arrayBuffer = await file.arrayBuffer();
  const { value: html, messages } = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      convertImage: mammoth.images.imgElement((image) =>
        image.read('base64').then((imageBuffer) => ({
          src: `data:${image.contentType};base64,${imageBuffer}`,
        }))
      ),
    }
  );

  if (messages.length > 0) {
    console.warn('DOCX conversion warnings:', messages);
  }

  if (!html.replace(/<[^>]+>/g, '').trim()) {
    throw new Error('Could not extract readable content from this document.');
  }

  const pdfName = file.name.replace(/\.[^/.]+$/, '') + '.pdf';
  return convertHtmlToPdf(html, options, pdfName, applyDocxContentStyles);
}

export type PageNumberPosition =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'top-left'
  | 'top-right';

export interface PageNumberOptions {
  position?: PageNumberPosition;
  headerText?: string;
  footerText?: string;
  startNumber?: number;
  fontSize?: number;
}

export interface SplitRange {
  start: number;
  end: number;
}

export async function getPdfPageCount(file: File): Promise<number> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  return pdf.getPageCount();
}

export async function splitPdf(file: File, mode: 'each' | 'ranges', ranges?: SplitRange[]): Promise<File[]> {
  const arrayBuffer = await file.arrayBuffer();
  const src = await PDFDocument.load(arrayBuffer);
  const pageCount = src.getPageCount();
  const baseName = file.name.replace(/\.[^/.]+$/, '');
  const results: File[] = [];

  if (mode === 'each') {
    for (let i = 0; i < pageCount; i++) {
      const newPdf = await PDFDocument.create();
      const [page] = await newPdf.copyPages(src, [i]);
      newPdf.addPage(page);
      const bytes = await newPdf.save();
      results.push(
        new File([bytes as BlobPart], `${baseName}_page_${i + 1}.pdf`, { type: 'application/pdf' })
      );
    }
    return results;
  }

  if (!ranges?.length) {
    throw new Error('Please specify at least one page range.');
  }

  ranges.forEach((range, idx) => {
    if (range.start < 1 || range.end > pageCount || range.start > range.end) {
      throw new Error(`Invalid range ${range.start}-${range.end}. PDF has ${pageCount} pages.`);
    }
  });

  for (let r = 0; r < ranges.length; r++) {
    const { start, end } = ranges[r];
    const indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(src, indices);
    pages.forEach((page) => newPdf.addPage(page));
    const bytes = await newPdf.save();
    results.push(
      new File(
        [bytes as BlobPart],
        `${baseName}_pages_${start}-${end}.pdf`,
        { type: 'application/pdf' }
      )
    );
  }

  return results;
}

export async function rotateReorderPdf(
  file: File,
  order: number[],
  rotations: Record<number, 90 | 180 | 270> = {}
): Promise<File> {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const pageCount = src.getPageCount();

  if (order.length !== pageCount) {
    throw new Error(`Order must include all ${pageCount} pages.`);
  }

  const dst = await PDFDocument.create();
  const pages = await dst.copyPages(src, order);

  pages.forEach((page, i) => {
    const origIdx = order[i];
    const rot = rotations[origIdx];
    if (rot) {
      page.setRotation(degrees(rot));
    }
    dst.addPage(page);
  });

  const bytes = await dst.save();
  const newName = file.name.replace(/\.[^/.]+$/, '') + '_edited.pdf';
  return new File([bytes as BlobPart], newName, { type: 'application/pdf' });
}

export async function addPageNumbersAndHeaders(
  file: File,
  options: PageNumberOptions = {}
): Promise<File> {
  const {
    position = 'bottom-center',
    headerText = '',
    footerText = '',
    startNumber = 1,
    fontSize = 10,
  } = options;

  const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();

  pages.forEach((page, i) => {
    const { width, height } = page.getSize();
    const pageNum = String(startNumber + i);
    const margin = 30;
    const textWidth = font.widthOfTextAtSize(pageNum, fontSize);

    if (headerText) {
      const hw = font.widthOfTextAtSize(headerText, fontSize);
      page.drawText(headerText, {
        x: width / 2 - hw / 2,
        y: height - margin,
        size: fontSize,
        font,
        color: rgb(0.2, 0.2, 0.2),
      });
    }

    let x = width / 2 - textWidth / 2;
    let y = margin;

    if (position.includes('bottom')) y = margin;
    if (position.includes('top')) y = height - margin - fontSize * 2;
    if (position.includes('left')) x = margin;
    if (position.includes('right')) x = width - margin - textWidth;
    if (position.includes('center')) x = width / 2 - textWidth / 2;

    page.drawText(pageNum, { x, y, size: fontSize, font, color: rgb(0.3, 0.3, 0.3) });

    if (footerText) {
      const fw = font.widthOfTextAtSize(footerText, fontSize - 1);
      page.drawText(footerText, {
        x: width / 2 - fw / 2,
        y: margin + fontSize + 6,
        size: fontSize - 1,
        font,
        color: rgb(0.4, 0.4, 0.4),
      });
    }
  });

  const bytes = await pdfDoc.save();
  const newName = file.name.replace(/\.[^/.]+$/, '') + '_numbered.pdf';
  return new File([bytes as BlobPart], newName, { type: 'application/pdf' });
}

export async function compressPdf(file: File, quality: number): Promise<File> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const enumerateImages = pdfDoc.context.enumerateIndirectObjects();
  
  for (const [ref, pdfObject] of enumerateImages) {
    if (!(pdfObject instanceof PDFRawStream)) continue;
    
    const dict = pdfObject.dict;
    const subtype = dict.get(PDFName.of('Subtype'));
    if (subtype !== PDFName.of('Image')) continue;

    const filter = dict.get(PDFName.of('Filter'));
    
    // Only attempt to compress JPEG images (DCTDecode)
    if (filter !== PDFName.of('DCTDecode')) {
      continue;
    }

    try {
      const imageBytes = pdfObject.contents;
      const blob = new Blob([imageBytes as any], { type: 'image/jpeg' });
      const imageFile = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      
      const compressedImageFile = await compressImage(imageFile, quality, 'image/jpeg');
      const compressedBytes = new Uint8Array(await compressedImageFile.arrayBuffer());
      
      (pdfObject as any).contents = compressedBytes;
      dict.set(PDFName.of('Length'), pdfDoc.context.obj(compressedBytes.length));
    } catch (error) {
      console.warn(`Failed to compress image stream at ref ${ref}, skipping:`, error);
    }
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  const newName = file.name.replace(/\.[^/.]+$/, "") + "_compressed.pdf";
  return new File([pdfBytes as any], newName, { type: 'application/pdf' });
}
