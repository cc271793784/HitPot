export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size}B`
  } else if (size < 1024 ** 2) {
    return `${Math.round((size / 1024) * 100) / 100}KB`
  } else if (size < 1024 ** 3) {
    return `${Math.round((size / 1024 ** 2) * 100) / 100}MB`
  } else {
    return `${Math.round((size / 1024 ** 3) * 100) / 100}GB`
  }
}
