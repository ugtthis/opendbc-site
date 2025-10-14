/**
 * Only includes breakpoints actually used in the app
 */
export const BREAKPOINTS = {
  mobile: '(max-width: 1023px)',   // Below Tailwind lg (1024px)
  desktop: '(min-width: 768px)',   // Tailwind md and above
} as const
