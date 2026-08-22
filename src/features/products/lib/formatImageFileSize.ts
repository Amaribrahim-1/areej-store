export function formatImageFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} بايت`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} ك.ب`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;
}
