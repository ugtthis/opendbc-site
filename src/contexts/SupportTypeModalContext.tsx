import { createSignal } from 'solid-js'

const [isOpen, setIsOpen] = createSignal(false)
const [supportType, setSupportType] = createSignal<string | undefined>(undefined)

export const openSupportTypeModal = (type: string) => {
  setSupportType(type)
  setIsOpen(true)
}

export const closeSupportTypeModal = () => {
  setIsOpen(false)
  setSupportType(undefined)
}

export const supportModalState = {
  isOpen,
  supportType,
}

