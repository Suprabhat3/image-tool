import imageCompression from 'browser-image-compression';

export const compressImage = async (
  file: File, 
  quality: number, 
  fileType: string = 'image/jpeg', 
  maxSizeMB: number = 0.5
) => {
  try {
    const defaultOptions = {
      maxSizeMB: maxSizeMB,
      maxWidthOrHeight: 4000,
      useWebWorker: fileType !== 'image/webp',
      fileType: fileType,
      initialQuality: quality / 100,
      alwaysKeepResolution: true // Ensure we don't accidentally resize if we only meant to compress
    };
    return await imageCompression(file, defaultOptions);
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}

export const resizeImage = async (
  file: File,
  maxWidthOrHeight: number,
  fileType: string = 'image/jpeg'
) => {
  try {
    const options = {
      maxWidthOrHeight,
      useWebWorker: fileType !== 'image/webp',
      fileType: fileType,
    };
    return await imageCompression(file, options);
  } catch (error) {
    console.error("Error resizing image:", error);
    throw error;
  }
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number } | null,
  fileType: string = 'image/jpeg',
  cropStyle: 'cut' | 'fill' | 'stretch' = 'cut',
  aspect?: number,
  outputWidth?: number,
  outputHeight?: number
): Promise<File | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  if (cropStyle === 'fill' || cropStyle === 'stretch') {
    let W_c = image.width;
    let H_c = image.height;
    
    if (aspect) {
      if (image.width / image.height > aspect) {
        W_c = image.width;
        H_c = image.width / aspect;
      } else {
        H_c = image.height;
        W_c = image.height * aspect;
      }
    }
    
    canvas.width = Math.round(W_c);
    canvas.height = Math.round(H_c);

    if (fileType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    if (cropStyle === 'fill') {
      const dx = (canvas.width - image.width) / 2;
      const dy = (canvas.height - image.height) / 2;
      
      ctx.drawImage(image, dx, dy, image.width, image.height);
    } else {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }
  } else {
    if (!pixelCrop) return null;
    const destW = outputWidth  || pixelCrop.width;
    const destH = outputHeight || pixelCrop.height;
    canvas.width  = destW;
    canvas.height = destH;

    if (fileType === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, destW, destH);
    }

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      destW,
      destH
    )
  }

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(null)
        return
      }
      const extension = fileType === 'image/jpeg' ? 'jpg' : fileType.split('/')[1]
      const file = new File([blob], `cropped.${extension}`, { type: fileType })
      resolve(file)
    }, fileType, 1.0)
  })
}

export const IMAGE_FORMATS = [
  { value: 'image/jpeg', label: 'JPEG', ext: 'jpg' },
  { value: 'image/png', label: 'PNG', ext: 'png' },
  { value: 'image/webp', label: 'WEBP', ext: 'webp' },
] as const;

export async function convertImageFormat(file: File, targetFormat: string): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const image = await createImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');

    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(image, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Conversion failed'))),
        targetFormat,
        0.92
      );
    });

    const ext = IMAGE_FORMATS.find((f) => f.value === targetFormat)?.ext || 'jpg';
    const newName = file.name.replace(/\.[^/.]+$/, `.${ext}`);
    return new File([blob], newName, { type: targetFormat });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export interface BatchProcessOptions {
  quality?: number;
  format?: string;
  maxWidthOrHeight?: number;
}

export async function batchProcessImages(
  files: File[],
  options: BatchProcessOptions
): Promise<File[]> {
  const results: File[] = [];

  for (const file of files) {
    let result = file;
    const format = options.format || file.type;

    if (options.maxWidthOrHeight) {
      result = await resizeImage(result, options.maxWidthOrHeight, format);
    }

    if (options.quality !== undefined) {
      result = await compressImage(result, options.quality, format);
    } else if (options.format && options.format !== file.type) {
      result = await convertImageFormat(result, options.format);
    }

    results.push(result);
  }

  return results;
}
