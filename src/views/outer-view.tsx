'use client'

import React from "react"
import { View as ThemeGalleryDebugView } from "./theme-gallery-debug-view"
import { View as PrimaryView } from "./primary-view"

export function View() {
  const [showThemeGalleryDebugView, setShowThemeGalleryDebugView] = React.useState(false)

  React.useEffect(() => {
    function handleKeyDown(ev: KeyboardEvent) {
      if (ev.ctrlKey || ev.altKey || ev.metaKey) { return }
      const key = ev.key.toLowerCase()
      if (ev.shiftKey && key === 'y') {
        setShowThemeGalleryDebugView(x => !x)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (showThemeGalleryDebugView) {
    return <ThemeGalleryDebugView />
  }
  return <PrimaryView />
}
