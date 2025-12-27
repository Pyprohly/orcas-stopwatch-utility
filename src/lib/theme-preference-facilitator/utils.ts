'use client'

import React from 'react'

export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => { setHasMounted(true) }, [])
  return hasMounted
}

export function* usingDisableTransitions(): IterableIterator<void> {
  const el = document.createElement("style")
  el.textContent = "*,*:after,*:before{transition:none !important;}"
  document.head.appendChild(el)
  try {
    yield
  } finally {
    getComputedStyle(document.body)
    setTimeout(() => document.head.removeChild(el), 0)
  }
}

export function* usingNullResourceManager(): IterableIterator<void> {
  yield
}

export const nullStorage: Storage = {
  getItem: (_key: string): string | null => null,
  setItem: (_key: string, _value: string): void => void 0,
  removeItem: (_key: string): void => void 0,
  key: (_index: number): string | null => null,
  clear: (): void => void 0,
  get length(): number { return 0 },
}
