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
  support_type: SupportType
  car_fingerprint: string
  auto_resume: boolean
  harness: string | null
  mass_curb_weight: number
  steer_ratio: number
  wheelbase: number
  min_steer_speed: number
  min_enable_speed: number
  [key: string]: string | number | boolean | string[] | null | undefined | Record<string, unknown>
}
