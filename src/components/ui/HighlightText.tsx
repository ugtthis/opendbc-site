import { For, createMemo, type Component } from 'solid-js'

type HighlightTextProps = {
  text: string
  query: string
  class?: string
}

const HighlightText: Component<HighlightTextProps> = (props) => {
  const segments = createMemo(() => {
    const { text, query } = props

    if (!query.trim()) {
      return [{ text, highlighted: false }]
    }

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) => ({
      text: part,
      highlighted: part !== '' && index % 2 === 1,
    }))
  })

  return (
    <span class={props.class}>
      <For each={segments()}>
        {(segment) => (segment.highlighted ? <mark class="text-black bg-yellow-300">{segment.text}</mark> : <span>{segment.text}</span>)}
      </For>
    </span>
  )
}

export default HighlightText
