import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start/router'
import { Suspense, Show } from 'solid-js'
import { isServer } from 'solid-js/web'
import { FilterProvider } from '~/contexts/FilterContext'
import { ModelComparisonProvider } from '~/contexts/ModelComparisonContext'
import SupportTypeInfoModal from '~/components/SupportTypeInfoModal'
import { supportModalState, closeSupportTypeModal } from '~/contexts/SupportTypeModalContext'
import '~/app.css'

export default function App() {
  return (
    <Router
      root={(props) => (
        <FilterProvider>
          <ModelComparisonProvider>
            <Suspense>{props.children}</Suspense>

            <Show when={!isServer}>
              <SupportTypeInfoModal
                open={supportModalState.isOpen()}
                onOpenChange={(open) => !open && closeSupportTypeModal()}
                initialSupportType={supportModalState.supportType()}
              />
            </Show>
          </ModelComparisonProvider>
        </FilterProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
