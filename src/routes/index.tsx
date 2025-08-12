import { For } from 'solid-js'
import FileCard from '~/components/FileCard'
import type { Car } from '~/types/CarDataTypes'

import metadata from '~/data/metadata.json'

export default function Home() {
  return (
    <main class="p-4 mx-auto max-w-7xl">
      <div class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
        <For each={metadata as Car[]}>
          {(vehicle) => (
            <div class="vehicle-card">
              <FileCard car={vehicle} />
            </div>
          )}
        </For>
      </div>
    </main>
  )
}
