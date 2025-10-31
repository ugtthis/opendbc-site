import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ============================================================================
// General Utilities
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function slugify(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function hasObjectEntries(value: unknown): boolean {
  return !!(
    value &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length > 0
  )
}

// ============================================================================
// Car Data Formatters
// ============================================================================
// All formatters handle null values by returning 'N/A' to indicate
// data is not available (e.g., during testing phase for dev kits)

const MS_TO_MPH = 2.237
const KG_TO_LBS = 2.20462

/**
 * Format speed from m/s to mph
 */
export function formatSpeed(speedMs: number | null): string {
  if (speedMs === null) return 'N/A'
  return speedMs > 0 ? `${Math.round(speedMs * MS_TO_MPH)} mph` : 'any speed'
}

/**
 * Format numeric value with optional unit
 */
export function formatValue(value: number | undefined | null, unit: string = ''): string {
  if (value === undefined || value === null) return 'N/A'
  
  if (Math.abs(value) >= 1000) {
    return `~${Math.round(value).toLocaleString()}${unit}`
  }
  
  return `~${value.toFixed(2)}${unit}`
}

/**
 * Format weight from kg to lbs
 */
export function formatWeight(kg: number | undefined | null): string {
  if (kg === undefined || kg === null) return 'N/A'
  const lbs = Math.round(kg * KG_TO_LBS)
  return `${lbs.toLocaleString()} lbs`
}

/**
 * Format boolean as Yes/No
 */
export function formatBoolean(val: boolean): string {
  return val ? 'Yes' : 'No'
}

/**
 * Format boolean as Enabled/Disabled
 */
export function formatEnabled(val: boolean): string {
  return val ? 'Enabled' : 'Disabled'
}
