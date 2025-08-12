import { createSignal, onMount } from 'solid-js'
import FileCard from '~/components/FileCard'
import type { Car } from '~/types/CarDataTypes'

import metadata from '~/data/metadata.json'

export default function Home() {
  const [vehicles, setVehicles] = createSignal<Car[]>([])
  const [loading, setLoading] = createSignal(true)

  onMount(() => {
    setVehicles(metadata.slice(0, 20) as Car[])
    setLoading(false)
  })

  return (
    <main class="p-4 mx-auto max-w-7xl">
      {loading() ? (
        <div class="flex justify-center items-center min-h-[400px]">
          <div class="text-xl text-gray-600">Loading vehicles...</div>
        </div>
      ) : (
        <div class="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {vehicles().map((vehicle) => (
            <div class="vehicle-card">
              <FileCard car={vehicle} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
