import jsPDF from 'jspdf';

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
