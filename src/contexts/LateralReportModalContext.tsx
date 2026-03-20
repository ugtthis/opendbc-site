import { createSignal } from 'solid-js'

export type LateralReportData = {
  description: string
  link: string
}

const [isOpen, setIsOpen] = createSignal(false)
const [reportData, setReportData] = createSignal<LateralReportData | undefined>(undefined)

export const openLateralReportModal = (report: LateralReportData) => {
  setReportData(report)
  setIsOpen(true)
}

export const closeLateralReportModal = () => {
  setIsOpen(false)
  setReportData(undefined)
}

export const lateralReportModalState = {
  isOpen,
  reportData,
}
