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

export const openReportModal = (report: ReportData, title?: string) => {
  setReportData(report)
  setModalTitle(title)
  setCompareReports([])
  setIsOpen(true)
}

export const openCompareModal = (reports: ReportData[], title?: string, defaultIdx?: number) => {
  setCompareReports(reports)
  setCompareDefaultIdx(defaultIdx ?? 0)
  setModalTitle(title)
  setReportData(undefined)
  setIsOpen(true)
}

export const closeReportModal = () => {
  setIsOpen(false)
  setReportData(undefined)
  setModalTitle(undefined)
  setCompareReports([])
  setCompareDefaultIdx(0)
}

export const reportModalState = {
  isOpen,
  reportData,
  modalTitle,
  compareReports,
  compareDefaultIdx,
}

