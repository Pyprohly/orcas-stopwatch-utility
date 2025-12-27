throw Error()

'use client'

import { useDarkModePreferenceContext, useVisualStylePreferenceContext } from "@/lib/theme-preference-facilitator"
import React from "react"

// let c = 2

function getDelay() {
  return 100

  // if (c === 0) { return 0 }
  // if (c > 0) {
  //   c--
  //   const standalone = matchMedia('(display-mode: standalone)').matches
  //   const browserIsChrome = (window as any).chrome && navigator.vendor === "Google Inc."
  //   if (standalone && browserIsChrome) {
  //     return 100
  //   }
  // }
  // return 0
}

export function ThemeColorMetaTagMutator() {
  const { userDarkModePreference } = useDarkModePreferenceContext()
  const { userVisualStylePreference } = useVisualStylePreferenceContext()

  function fn() {
    let el = document.head.querySelector('meta[name="theme-color"]')
    if (el == null) {
      el = document.createElement('meta')
      el.setAttribute('name', 'theme-color')
    }

    const bg = getComputedStyle(document.body).backgroundColor
    el.setAttribute('content', bg)

    if (!el.isConnected) {
      document.head.appendChild(el)
    }
  }

  React.useEffect(() => {
    void userDarkModePreference
    void userVisualStylePreference

    setTimeout(fn, getDelay())
  }, [userDarkModePreference, userVisualStylePreference])

  return null
}
