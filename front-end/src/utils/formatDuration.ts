import format from 'format-duration'

// 单位秒
export function formatDuration(duration: number): string {
  return format(duration)
}
