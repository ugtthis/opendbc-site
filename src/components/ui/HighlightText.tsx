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

    if (!trimmedQuery) {
      return [{ text, highlighted: false }]
    }

    const queryWords = trimmedQuery.toLowerCase().split(/\s+/)

    // Highlight whole text if searching for a year that's in the yearList
    const hasYearMatch = yearList?.some(year =>
      queryWords.includes(year.toLowerCase())
    )
    if (hasYearMatch) {
      return [{ text, highlighted: true }]
    }

    // Highlight individual matching words
    const escapedWords = queryWords.map(word =>
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    )
    const pattern = escapedWords.join('|')
    const parts = text.split(new RegExp(`(${pattern})`, 'gi'))

    return parts.map((part, index) => ({
      text: part,
      highlighted: index % 2 === 1,
    }))
  })

  return (
    <span class={props.class}>
      <For each={segments()}>
        {(segment) =>
          segment.highlighted
            ? <mark class="bg-yellow-300 text-black">{segment.text}</mark>
            : <span>{segment.text}</span>
        }
      </For>
    </span>
  )
}

export default HighlightText
