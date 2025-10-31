/// <reference types="@solidjs/start/env" />

declare global {
  interface Window {
    plausible?: (event: string, options?: Record<string, unknown>) => void
  }
}

export {}
