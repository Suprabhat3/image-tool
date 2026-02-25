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
      useWebWorker: true,
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
      useWebWorker: true,
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
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileType: string = 'image/jpeg'
): Promise<File | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

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
