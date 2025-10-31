import { For, Show, type Component } from 'solid-js'
import { SPECS_BY_CATEGORY } from '~/data/specs'
import { cn } from '~/lib/utils'

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
    ? cn(
        'w-full rounded border border-transparent px-3 py-1.5 text-left text-xs',
        'transition-colors cursor-pointer hover:border-gray-300 hover:bg-gray-100',
      )
    : cn(
        'w-full rounded border border-transparent px-4 py-3 text-left text-sm',
        'transition-colors cursor-pointer active:bg-gray-200 hover:border-gray-300 hover:bg-gray-100',
      )

  const shouldShowSpec = (specId: string) =>
    !props.excludeSpecs?.includes(specId)

  return (
    <For each={SPECS_BY_CATEGORY}>
      {(group, index) => (
        <>
          <div class={cn(
            'mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500',
            index() === 0 ? 'mt-2' : 'mt-4',
          )}>
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
