export const MAX_FILE_BYTES = 6 * 1024 * 1024
export const MAX_EDGE = 1280
export const JPEG_QUALITY = 0.72
export const MAX_DATA_URL_CHARS = 900_000

export function rejectHugeFile(file) {
  if (!file) return 'No file selected'
  if (file.size > MAX_FILE_BYTES) {
    return 'That image is too large (over 6 MB). Use a smaller file, or paste a URL instead.'
  }
  if (!file.type || !file.type.startsWith('image/')) {
    return 'Please choose an image file.'
  }
  return null
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not read that image. Try another file or a URL.'))
    img.src = src
  })
}

export async function compressImageFile(file) {
  const sizeError = rejectHugeFile(file)
  if (sizeError) throw new Error(sizeError)

  const objectUrl = URL.createObjectURL(file)
  try {
    const img = await loadImage(objectUrl)
    const w = img.naturalWidth || img.width
    const h = img.naturalHeight || img.height
    const scale = Math.min(1, MAX_EDGE / Math.max(w, h, 1))
    const cw = Math.max(1, Math.round(w * scale))
    const ch = Math.max(1, Math.round(h * scale))
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, cw, ch)
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    if (!dataUrl || dataUrl.length > MAX_DATA_URL_CHARS) {
      throw new Error('Compressed image is still too large for this phone. Try a simpler photo or use a URL.')
    }
    return dataUrl
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
