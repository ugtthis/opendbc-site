import type { SupportType } from '~/types/supportType'

export type Car = {
  name: string
  make: string
  model: string
  years: string
  year_list: string[]
  package: string
  video: string | null
  setup_video: string | null
  footnotes: string[]
  setup_notes?: string[]
  support_type: SupportType
  car_fingerprint: string
  auto_resume: boolean
  harness: string | null
  mass_curb_weight: number
  steer_ratio: number
  wheelbase: number
  min_steer_speed: number | null
  min_enable_speed: number
  max_lateral_accel?: number | null
  [key: string]: string | number | boolean | string[] | null | undefined | Record<string, unknown>
}
