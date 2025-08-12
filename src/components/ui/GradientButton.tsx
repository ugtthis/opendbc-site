import { type Component, type JSX } from 'solid-js'
import { cn } from '~/lib/utils'

type GradientButtonProps = {
  href: string
  class?: string
  children: JSX.Element
}

const base = 'flex justify-center py-4 border-2 border-gray-700 group'
const motion = 'transition-all ease-in duration-200 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-[0_4px_10px_#0F2F24]/40'
const gradient = 'bg-gradient-to-r from-[#4A4A4A] to-[#686868] hover:from-[#0F2F24] hover:to-[#00FFA3]'

const GradientButton: Component<GradientButtonProps> = (props) => {
  return (
    <a href={props.href} class={cn(base, motion, gradient, props.class)}>
      {props.children}
    </a>
  )
}

export default GradientButton
