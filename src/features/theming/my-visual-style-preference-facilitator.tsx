"use client"

import React from "react"
import {
  VisualStylePreferenceFacilitator,
  useVisualStylePreferenceContext,
} from "@/lib/theme-preference-facilitator"


export function quicklyDeployVisualStylePreference({
  storageKey,
  defaultUserVisualStylePreference,
}: {
  storageKey: string | null
  defaultUserVisualStylePreference: string | null
}): void {
  function getVisualStyle(): string | null {
    const sp = new URLSearchParams(location.search)
    const theme = sp.getAll("theme").at(-1)
    if (theme != null) { return theme }

    if (storageKey == null) { return null }
    return localStorage.getItem(storageKey) ?? defaultUserVisualStylePreference
  }
  const visualStyle = getVisualStyle()
  if (visualStyle != null) {
    const el = document.getElementById(`theme[${visualStyle}]`)
    if (!(el instanceof HTMLStyleElement)) { return }
    el.media = "all"
  }
}

export const MyVisualStyleNoFoucScript: React.ExoticComponent = React.memo(function VisualStyleNoFoucScript() {
  const {
    storageKey,
    defaultUserVisualStylePreference,
  } = useVisualStylePreferenceContext()
  const scriptArg = JSON.stringify({ storageKey, defaultUserVisualStylePreference })
  const scriptFunc = quicklyDeployVisualStylePreference.toString()
  const scriptContent = `;(${scriptFunc})(${scriptArg})`
  return (
    <script
      id="visual-style-no-fouc-script"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  )
})


export function MyVisualStylePreferenceFacilitator(
  props: React.ComponentProps<typeof VisualStylePreferenceFacilitator>,
) {
  const prevVisualStyleRef = React.useRef<string | null>(null)
  return (
    <VisualStylePreferenceFacilitator
      onVisualStyleChange={(visualStyle) => {
        const prevVisualStyle = prevVisualStyleRef.current
        prevVisualStyleRef.current = visualStyle

        if (visualStyle != null) {
          const el = document.getElementById(`theme[${visualStyle}]`)
          if (!(el instanceof HTMLStyleElement)) { return }
          el.media = "all"
        }

        if (prevVisualStyle != null) {
          const el = document.getElementById(`theme[${prevVisualStyle}]`)
          if (!(el instanceof HTMLStyleElement)) { return }
          el.media = "not all"
        }
      }}
      storage={new Proxy(localStorage, {
        get(target, property, receiver) {
          if (property === 'getItem') {
            const sp = new URLSearchParams(location.search)
            const theme = sp.getAll("theme").at(-1)
            if (theme != null) {
              return (_key: string): string | null => theme
            }
          }

          const value = Reflect.get(target, property, receiver)
          if (typeof value === 'function') {
            return value.bind(target)
          }
          return value
        }
      })}
      {...props}
    />
  )
}
