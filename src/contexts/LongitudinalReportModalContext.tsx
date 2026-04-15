import { createSignal } from 'solid-js'

export type ReportData = {
  description: string
  link: string
}

const [isOpen, setIsOpen] = createSignal(false)
const [reportData, setReportData] = createSignal<ReportData | undefined>(undefined)
const [modalTitle, setModalTitle] = createSignal<string | undefined>(undefined)

export const openReportModal = (report: ReportData, title?: string) => {
  setReportData(report)
  setModalTitle(title)
  setIsOpen(true)
}

export const closeReportModal = () => {
  setIsOpen(false)
  setReportData(undefined)
  setModalTitle(undefined)
}

export const reportModalState = {
  isOpen,
  reportData,
  modalTitle,
}

