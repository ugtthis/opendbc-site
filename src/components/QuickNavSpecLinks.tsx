import { For, type Component } from 'solid-js'
import { SPECS_GROUPED_BY_CATEGORY } from '~/data/quickNavSpecs'

type QuickNavSpecLinksProps = {
  onNavigate: (specId: string) => void
  variant?: 'desktop' | 'mobile'
}

// Shared Quick Navigation btn list component
const QuickNavSpecLinks: Component<QuickNavSpecLinksProps> = (props) => {
  const variant = props.variant || 'desktop'

  const buttonClasses = () =>
    variant === 'desktop'
      ? 'py-1.5 px-3 w-full text-xs text-left rounded border border-transparent transition-colors cursor-pointer hover:bg-gray-100 hover:border-gray-300'
      : 'py-3 px-4 w-full text-sm text-left rounded border border-transparent transition-colors cursor-pointer hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200'

  return (
    <For each={SPECS_GROUPED_BY_CATEGORY}>
      {(category, index) => (
        <>
          <div class={`${index() === 0 ? 'mt-2' : 'mt-4'} mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase`}>
            {category.categoryName}
          </div>
          <For each={category.specs}>
            {(spec) => (
              <button
                onClick={() => props.onNavigate(spec.id)}
                class={buttonClasses()}
              >
                {spec.buttonLabel}
              </button>
            )}
          </For>
        </>
      )}
    </For>
  )
}

export default QuickNavSpecLinks
