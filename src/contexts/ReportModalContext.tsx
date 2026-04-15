import { createSignal } from 'solid-js'

export type ReportData = {
  description: string
  link: string
}

const [isOpen, setIsOpen] = createSignal(false)
const [reportData, setReportData] = createSignal<ReportData | undefined>(undefined)
const [modalTitle, setModalTitle] = createSignal<string | undefined>(undefined)
const [compareReports, setCompareReports] = createSignal<ReportData[]>([])
const [compareDefaultIdx, setCompareDefaultIdx] = createSignal(0)

const resetAll = () => {
  setReportData(undefined)
  setModalTitle(undefined)
  setCompareReports([])
  setCompareDefaultIdx(0)
}

export const openReportModal = (report: ReportData, title?: string) => {
  resetAll()
  setReportData(report)
  setModalTitle(title)
  setIsOpen(true)
}

export const openCompareModal = (reports: ReportData[], defaultIdx?: number) => {
  resetAll()
  setCompareReports(reports)
  setCompareDefaultIdx(defaultIdx ?? 0)
  setIsOpen(true)
}

export const closeReportModal = () => {
  setIsOpen(false)
  resetAll()
}

export const reportModalState = {
  isOpen,
  reportData,
  modalTitle,
  compareReports,
  compareDefaultIdx,
}
