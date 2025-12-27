'use client'

// <https://www.joshwcomeau.com/react/the-perils-of-rehydration/>
// <https://usehooks-ts.com/react-hook/use-is-client>

import type React from 'react'
import { useHasMounted } from '../hooks/mounted-hooks'

export function ClientOnly({ children }: { children: React.ReactNode }): React.ReactNode {
  const hasMounted = useHasMounted()
  if (!hasMounted) { return null }
  return children
}
