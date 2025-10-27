export type SupportType = string

const supportTypeStyles: Record<string, string> = {
  Upstream: 'bg-green-500 text-white',
  'Under review': 'bg-amber-400 text-black font-bold',
  'Not compatible': 'bg-red-500 text-white',
  Community: 'bg-blue-400 text-white',
  'Dashcam mode': 'bg-purple-400 text-white',
}

const supportTypeGradients: Record<string, string> = {
  Upstream: 'from-[#22c55e] to-[#15803d]',        // green-500 to dark green
  'Under review': 'from-[#fbbf24] to-[#d97706]',  // amber-400 to dark amber
  'Not compatible': 'from-[#ef4444] to-[#991b1b]', // red-500 to dark red
  Community: 'from-[#60a5fa] to-[#1e40af]',       // blue-400 to dark blue
  'Dashcam mode': 'from-[#c084fc] to-[#6b21a8]',  // purple-400 to dark purple
}

export function getSupportTypeColor(supportType: SupportType): string {
  return supportTypeStyles[supportType] || 'bg-gray-400 text-white'
}

export function getSupportTypeGradient(supportType?: SupportType): string {
  if (!supportType) return 'from-[#9ca3af] to-[#4b5563]'
  return supportTypeGradients[supportType] || 'from-[#9ca3af] to-[#4b5563]'
}

export function getSupportLevels(): string[] {
  return Object.keys(supportTypeStyles)
}
