'use client'

import React from "react"
import {
  type Handle as StopwatchHandle,
  Stopwatch as StopwatchComponent,
} from "../features/stopwatch/component"
import { ThemePicker } from "../features/theming/theme-picker"
import * as viewHooks from "./primary-view-hooks"


export function View() {
  const [handlesRef, _setHandlesRef] = React.useState<
    React.RefObject<Map<string, StopwatchHandle>>
  >(() => ({ current: new Map() }))

  React.useEffect(() => {
    ;(window as any).handles = handlesRef.current
    ;(window as any).stopwatches = new Map(Array.from(
      handlesRef.current,
      ([k, v]) => [k, v.stopwatch],
    ))
  }, [handlesRef])


  const [themePickerOpen, setThemePickerOpen] = React.useState(false)
  const saveThemePickerOpenStateEffectJammerRef = React.useRef(1)

  React.useEffect(function loadThemePickerOpenState() {
    setThemePickerOpen(sessionStorage.getItem('theme-picker-open') === '1')
  }, [])

  React.useEffect(function saveThemePickerOpenState() {
    if (saveThemePickerOpenStateEffectJammerRef.current > 0) {
      saveThemePickerOpenStateEffectJammerRef.current -= 1
      return
    }
    sessionStorage.setItem('theme-picker-open', themePickerOpen ? '1' : '0')
  }, [themePickerOpen])


  viewHooks.useViewKeyboardShortcuts({
    handlesRef,
    setThemePickerOpen,
  })

  viewHooks.useViewTouchGestures({
    themePickerOpen,
    setThemePickerOpen,
  })


  return (
    <main className="flex items-center justify-center p-2 sm:min-h-dvh">
      <div className="grid grid-cols-[repeat(2,minmax(auto,200px))] grid-rows-5 gap-1">
        {"17 21 16 20 15 19 14 18 13".split(' ')
            .map(label => (
              <StopwatchComponent
                key={label}
                idt={label}
                label={label}
                ref={(handle) => {
                  if (handle == null) { throw Error() }
                  handlesRef.current.set(label, handle)
                  return () => { handlesRef.current.delete(label) }
                }}
              />
            ))}
      </div>

      <ThemePicker
        open={themePickerOpen}
        setOpen={setThemePickerOpen}
      />
    </main>
  )
}
