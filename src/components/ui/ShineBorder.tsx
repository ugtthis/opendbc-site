import { type ParentComponent } from 'solid-js'

export const ShineBorder: ParentComponent = (props) => {
  return (
    <div
      style={{
        padding: '5px',
        'box-shadow': '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.7)',
      }}
      class="relative flex-1"
    >
      <div class="absolute inset-0 pointer-events-none shine-border-overlay" />
      <div class="relative">{props.children}</div>
    </div>
  )
}

export default ShineBorder
