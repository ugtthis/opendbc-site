import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense } from 'solid-js'
import Header from '~/components/Header'
import { FilterProvider } from '~/contexts/FilterContext'
import '~/app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <FilterProvider>
          <Header />
          <Suspense>{props.children}</Suspense>
        </FilterProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
