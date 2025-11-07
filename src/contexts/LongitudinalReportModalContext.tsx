import { createSignal } from 'solid-js'

export type ReportData = {
  description: string
  link: string
}

const [isOpen, setIsOpen] = createSignal(false)
const [reportData, setReportData] = createSignal<ReportData | undefined>(undefined)

export const openReportModal = (report: ReportData) => {
  setReportData(report)
  setIsOpen(true)
}

export const closeReportModal = () => {
  setIsOpen(false)
  setReportData(undefined)
}

export const reportModalState = {
  isOpen,
  reportData,
}

