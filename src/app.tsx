import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import { FilterProvider } from '~/contexts/FilterContext'
import { ModelComparisonProvider } from '~/contexts/ModelComparisonContext'
import '~/app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <FilterProvider>
          <ModelComparisonProvider>
            <Suspense>{props.children}</Suspense>
          </ModelComparisonProvider>
        </FilterProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
