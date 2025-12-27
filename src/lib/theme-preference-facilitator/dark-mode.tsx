"use client"

import React from "react"
import {
  useHasMounted,
  usingDisableTransitions,
  usingNullResourceManager,
} from "./utils"


export function defaultOnDarkModeChange(darkModeActive: boolean): void {
  const cll = document.documentElement.classList
  if (darkModeActive) { cll.add('dark') } else { cll.remove('dark') }
}


export type UserDarkModePreference = 'system' | 'light' | 'dark'

export function isUserDarkModePreference(value: string): value is UserDarkModePreference {
  return ['system', 'light', 'dark'].includes(value)
}


export function quicklyDeployDarkModePreference({
  storageKey,
  defaultUserDarkModePreference,
}: {
  storageKey: string | null
  defaultUserDarkModePreference: UserDarkModePreference
}): void {
  if (storageKey == null) { return }
  const cll = document.documentElement.classList
  const value = localStorage.getItem(storageKey) ?? defaultUserDarkModePreference
  if (
    value === 'dark'
    || (
      value === 'system'
      && matchMedia("(prefers-color-scheme: dark)").matches
    )
  ) { cll.add('dark') } else { cll.remove('dark') }
}

export const DarkModeNoFoucScript: React.ExoticComponent = React.memo(function DarkModeNoFoucScript() {
  const {
    storageKey,
    defaultUserDarkModePreference,
    onDarkModeChange,
  } = useDarkModePreferenceContext()
  if (onDarkModeChange !== defaultOnDarkModeChange) {
    throw new Error("You must write you own no-FOUC script if the default `onDarkModeChange` is not used")
  }
  const scriptArg = JSON.stringify({ storageKey, defaultUserDarkModePreference })
  const scriptFunc = quicklyDeployDarkModePreference.toString()
  const scriptContent = `;(${scriptFunc})(${scriptArg})`
  return (
    <script
      id="dark-mode-no-fouc-script"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  )
})


export type ContextValue = {
  storageKey: string | null
  defaultUserDarkModePreference: UserDarkModePreference
  onDarkModeChange: (darkModeActivate: boolean) => void
  hasMounted: boolean
  userDarkModePreference: UserDarkModePreference
  commitUserDarkModePreference: (userDarkModePreference: UserDarkModePreference) => void
  systemPrefersDarkMode: boolean
  darkModeActive: boolean
}

const Context = React.createContext<ContextValue | null>(null)

export function useDarkModePreferenceContext(): ContextValue {
  const context = React.useContext(Context)
  if (context == null) {
    throw new Error("cannot use context value outside of context provider")
  }
  return context
}

export function DarkModePreferenceFacilitator({
  children,
  storageKey = "user-dark-mode-preference",
  defaultUserDarkModePreference = 'system',
  onDarkModeChange,
  preventTransitions = false,
  disableWatchSystemPreference = false,
  placeholders,
  storage = localStorage,
}: {
  children: React.ReactNode
  storageKey?: string | null
  defaultUserDarkModePreference?: UserDarkModePreference
  onDarkModeChange?: (darkModeActive: boolean) => void
  preventTransitions?: boolean
  disableWatchSystemPreference?: boolean
  placeholders?: {
    userDarkModePreference?: UserDarkModePreference
    commitUserDarkModePreference?: (userDarkModePreference: UserDarkModePreference) => void
    systemPrefersDarkMode?: boolean
  }
  storage?: Storage
}): React.ReactNode {
  onDarkModeChange ??= defaultOnDarkModeChange
  const placeholders1: Required<NonNullable<typeof placeholders>> = {
    userDarkModePreference: defaultUserDarkModePreference,
    commitUserDarkModePreference: (_userDarkModePreference) => {
      throw new Error("cannot apply dark mode before mount")
    },
    systemPrefersDarkMode: false,
    ...placeholders,
  }

  const hasMounted = useHasMounted()

  const [userDarkModePreference, setUserDarkModePreference] =
      React.useState<UserDarkModePreference>(placeholders1.userDarkModePreference)
  const [systemPrefersDarkMode, setSystemPrefersDarkMode] =
      React.useState<boolean>(placeholders1.systemPrefersDarkMode)

  const darkModeActive = userDarkModePreference === 'dark'
      || (userDarkModePreference === 'system' && systemPrefersDarkMode)

  React.useEffect(function load() {
    setSystemPrefersDarkMode(matchMedia("(prefers-color-scheme: dark)").matches)

    if (storageKey == null) { return }
    const value = storage.getItem(storageKey)
    let userDarkModePreference = defaultUserDarkModePreference
    if (value != null && !isUserDarkModePreference(value)) {
      storage.removeItem(storageKey)
    } else if (value != null) {
      userDarkModePreference = value
    }
    setUserDarkModePreference(userDarkModePreference)
  }, [storage, storageKey, defaultUserDarkModePreference])

  const onDarkModeChangeEffectEvent = React.useEffectEvent(onDarkModeChange)

  React.useEffect(function apply() {
    if (!hasMounted) { return }
    const cm = preventTransitions ? usingDisableTransitions() : usingNullResourceManager()
    for (const _ of cm) {
      onDarkModeChangeEffectEvent(darkModeActive)
    }
  }, [hasMounted, preventTransitions, darkModeActive])

  React.useEffect(function matchMediaListener() {
    if (disableWatchSystemPreference) { return }
    if (userDarkModePreference !== 'system') { return }

    function listener(ev: MediaQueryListEvent) { setSystemPrefersDarkMode(ev.matches) }
    const media = matchMedia("(prefers-color-scheme: dark)")
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [disableWatchSystemPreference, userDarkModePreference])

  function setAndSaveUserDarkModePreference(userDarkModePreference: UserDarkModePreference): void {
    setUserDarkModePreference(userDarkModePreference)
    if (storageKey == null) { return }
    storage.setItem(storageKey, userDarkModePreference)
  }
  const commitUserDarkModePreference: (userDarkModePreference: UserDarkModePreference) => void =
      hasMounted
          ? storageKey == null
              ? setUserDarkModePreference
              : setAndSaveUserDarkModePreference
          : placeholders1.commitUserDarkModePreference

  const contextValue = {
    storageKey,
    defaultUserDarkModePreference,
    onDarkModeChange,
    hasMounted,
    userDarkModePreference,
    commitUserDarkModePreference,
    systemPrefersDarkMode,
    darkModeActive,
  }
  return (
    <Context value={contextValue}>
      {children}
    </Context>
  )
}
