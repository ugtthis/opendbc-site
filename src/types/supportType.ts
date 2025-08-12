export type SupportType = 'Upstream' | 'Under review' | 'Not compatible' | 'Community' | 'Dashcam mode' | string

export const supportTypeStyles: Record<string, string> = {
  Upstream: 'bg-green-500 text-white',
  'Under review': 'bg-yellow-400 text-black font-bold',
  'Not compatible': 'bg-red-500 text-white',
  Community: 'bg-blue-400 text-white',
  'Dashcam mode': 'bg-gray-400 text-white',
  default: 'bg-gray-400 text-white',
}

export function getSupportTypeColor(supportType: SupportType): string {
  return supportTypeStyles[supportType] || supportTypeStyles.default
}
