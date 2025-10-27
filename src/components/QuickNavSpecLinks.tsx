import { For, Show, type Component } from 'solid-js'
import { SPECS_BY_CATEGORY } from '~/data/specs'

type QuickNavSpecLinksProps = {
  onNavigate: (specId: string) => void
  variant?: 'desktop' | 'mobile'
  excludeSpecs?: string[]
}

// Shared Quick Navigation btn list component
const QuickNavSpecLinks: Component<QuickNavSpecLinksProps> = (props) => {
  const variant = props.variant || 'desktop'

  const buttonClasses = () =>
    variant === 'desktop'
      ? 'py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors cursor-pointer hover:bg-gray-100 hover:border-gray-300'
      : 'py-3 px-4 w-full text-sm text-left rounded border border-transparent transition-colors cursor-pointer hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200'

  const shouldShowSpec = (specId: string) =>
    !props.excludeSpecs?.includes(specId)

  return (
    <For each={SPECS_BY_CATEGORY}>
      {(group, index) => (
        <>
          <div class={`${index() === 0 ? 'mt-2' : 'mt-4'} mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase`}>
            {group.category}
          </div>
          <For each={group.specs}>
            {(spec) => (
              <Show when={shouldShowSpec(spec.id)}>
                <button
                  onClick={() => props.onNavigate(spec.id)}
                  class={buttonClasses()}
                >
                  {spec.label}
                </button>
              </Show>
            )}
          </For>
        </>
      )}
    </For>
  )
}

export default QuickNavSpecLinks
