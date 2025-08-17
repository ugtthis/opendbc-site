import { For, createMemo, type Component } from 'solid-js'

type HighlightTextProps = {
  text: string
  query: string
  class?: string
  yearList?: string[]
}

const HighlightText: Component<HighlightTextProps> = (props) => {
  const segments = createMemo(() => {
    const { text, query, yearList } = props
    const trimmedQuery = query.trim()

    if (!trimmedQuery) return [{ text, highlighted: false }]

    const shouldHighlightAll = yearList?.includes(trimmedQuery)
    if (shouldHighlightAll) return [{ text, highlighted: true }]

    const parts = text.split(new RegExp(`(${trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return parts.map((part, index) => ({
      text: part,
      highlighted: part !== '' && index % 2 === 1,
    }))
  })

  return (
    <span class={props.class}>
      <For each={segments()}>
        {(segment) =>
          segment.highlighted
            ? <mark class="text-black bg-yellow-300">{segment.text}</mark>
            : <span>{segment.text}</span>
        }
      </For>
    </span>
  )
}

export default HighlightText
