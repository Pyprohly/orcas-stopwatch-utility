"use client"

import React from "react"
import {
  useHasMounted,
  usingDisableTransitions,
  usingNullResourceManager,
} from "./utils"


export function defaultOnVisualStyleChange(visualStyle: string | null): void {
  if (visualStyle == null) {
    document.documentElement.removeAttribute('data-visual-style')
  } else {
    document.documentElement.setAttribute('data-visual-style', visualStyle)
  }
}


export function quicklyDeployVisualStylePreference({
  storageKey,
  defaultUserVisualStylePreference,
}: {
  storageKey: string | null
  defaultUserVisualStylePreference: string | null
}): void {
  if (storageKey == null) { return }
  const value = localStorage.getItem(storageKey) ?? defaultUserVisualStylePreference
  if (value == null) {
    document.documentElement.removeAttribute('data-visual-style')
  } else {
    document.documentElement.setAttribute('data-visual-style', value)
  }
}

export const VisualStyleNoFoucScript: React.ExoticComponent = React.memo(function VisualStyleNoFoucScript() {
  const {
    storageKey,
    defaultUserVisualStylePreference,
    onVisualStyleChange,
  } = useVisualStylePreferenceContext()
  if (onVisualStyleChange !== defaultOnVisualStyleChange) {
    throw new Error("You must write you own no-FOUC script if the default `onVisualStyleChange` is not used")
  }
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


export type ContextValue = {
  storageKey: string | null
  defaultUserVisualStylePreference: string | null
  onVisualStyleChange: (visualStyle: string | null) => void
  hasMounted: boolean
  userVisualStylePreference: string | null
  commitUserVisualStylePreference: (userVisualStylePreference: string | null) => void
}

const Context = React.createContext<ContextValue | null>(null)

export function useVisualStylePreferenceContext(): ContextValue {
  const context = React.useContext(Context)
  if (context == null) {
    throw new Error("cannot use context value outside of context provider")
  }
  return context
}

export function VisualStylePreferenceFacilitator({
  children,
  storageKey = "user-visual-style-preference",
  defaultUserVisualStylePreference = null,
  onVisualStyleChange,
  preventTransitions = false,
  placeholders,
  storage = localStorage,
}: {
  children: React.ReactNode
  storageKey?: string | null
  defaultUserVisualStylePreference?: string | null
  onVisualStyleChange?: (visualStyle: string | null) => void
  preventTransitions?: boolean
  placeholders?: {
    userVisualStylePreference?: string | null
    commitUserVisualStylePreference?: (userVisualStylePreference: string | null) => void
  }
  storage?: Storage
}): React.ReactNode {
  onVisualStyleChange ??= defaultOnVisualStyleChange
  const placeholders1: Required<NonNullable<typeof placeholders>> = {
    userVisualStylePreference: defaultUserVisualStylePreference,
    commitUserVisualStylePreference: (_userVisualStylePreference) => {
      throw new Error("cannot apply visual style before mount")
    },
    ...placeholders,
  }

  const hasMounted = useHasMounted()

  const [userVisualStylePreference, setUserVisualStylePreference] =
      React.useState<string | null>(placeholders1.userVisualStylePreference)

  React.useEffect(function load() {
    if (storageKey == null) { return }
    const value = storage.getItem(storageKey)
    const userVisualStylePreference = value == null ? defaultUserVisualStylePreference : value
    setUserVisualStylePreference(userVisualStylePreference)
  }, [storage, storageKey, defaultUserVisualStylePreference])

  const onVisualStyleChangeEffectEvent = React.useEffectEvent(onVisualStyleChange)

  React.useEffect(function apply() {
    if (!hasMounted) { return }
    const cm = preventTransitions ? usingDisableTransitions() : usingNullResourceManager()
    for (const _ of cm) {
      onVisualStyleChangeEffectEvent(userVisualStylePreference)
    }
  }, [hasMounted, preventTransitions, userVisualStylePreference])

  function setAndSaveUserVisualStylePreference(userVisualStylePreference: string | null): void {
    setUserVisualStylePreference(userVisualStylePreference)
    if (storageKey == null) { return }
    if (userVisualStylePreference == null) {
      storage.removeItem(storageKey)
    } else {
      storage.setItem(storageKey, userVisualStylePreference)
    }
  }
  const commitUserVisualStylePreference: (userVisualStylePreference: string | null) => void =
      hasMounted
          ? storageKey == null
              ? setUserVisualStylePreference
              : setAndSaveUserVisualStylePreference
          : placeholders1.commitUserVisualStylePreference

  const contextValue = {
    storageKey,
    defaultUserVisualStylePreference,
    onVisualStyleChange,
    hasMounted,
    userVisualStylePreference,
    commitUserVisualStylePreference,
  }
  return (
    <Context value={contextValue}>
      {children}
    </Context>
  )
}
