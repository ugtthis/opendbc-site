export function getSupportTypeColor(supportType: string): string {
  switch (supportType) {
    case 'Upstream':
      return 'bg-[#66D855] text-white';
    case 'Under review':
      return 'font-bold bg-[#F9C515] text-black';
    case 'Not compatible':
      return 'bg-[#D85555] text-white';
    case 'Community':
      return 'bg-[#819CE1] text-white';
    default:
      return 'bg-[#969696] text-white';
  }
} 