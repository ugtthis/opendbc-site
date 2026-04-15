/**
 * Only includes breakpoints actually used in the app
 */
export const BREAKPOINTS = {
  mobile: '(max-width: 1023px)',
  desktop: '(min-width: 768px)',
  /** Compare reports UI is only meant for wide desktop viewports. */
  compareReports: '(min-width: 1180px)',
} as const
