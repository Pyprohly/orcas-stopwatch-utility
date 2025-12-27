'use client'

import React from "react"
import { useDarkModePreferenceContext } from "@/lib/theme-preference-facilitator"
import { CSSVariableTransformer } from "@/utils/css-variable-transformer"

export function SaturateFaintColors({ children }: { children: React.ReactNode }) {
  const { darkModeActive } = useDarkModePreferenceContext()

  const transformClosure = React.useCallback((propertyName: string) => {
    return (value: string) => {
      const m = value.match(/oklch\(([0-9.]+) ([0-9.]+) ([0-9.]+)\)/)
      if (m == null) { return null }

      const l = Number(m[1])
      const c = Number(m[2])
      const h = Number(m[3])
      if (Number.isNaN(l) || Number.isNaN(c) || Number.isNaN(h)) { return null }

      const colorFaint = !darkModeActive
          ? l > 0.8 && c < 0.14
          : l < 0.5 && c < 0.14

      if (!colorFaint) { return `var(${propertyName})` }

      return !darkModeActive
          ? `oklch(from var(${propertyName}) min(l, 0.7) 0.14 h)`
          : `oklch(from var(${propertyName}) max(l, 0.6) 0.14 h)`
    }
  }, [darkModeActive])

  const transformers = React.useMemo(() => Object.fromEntries(
    ["--primary", "--destructive"].map(x => [x, transformClosure(x)]),
  ), [transformClosure])

  return (
    <CSSVariableTransformer transformers={transformers}>
      {children}
    </CSSVariableTransformer>
  )
}
