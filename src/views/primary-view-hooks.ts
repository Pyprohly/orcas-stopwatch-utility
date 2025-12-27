'use client'

import React from "react"

import { type Handle as StopwatchHandle } from "../features/stopwatch/component"

export function useViewKeyboardShortcuts({
  handlesRef,
  setThemePickerOpen,
}: {
  handlesRef: React.RefObject<Map<string, StopwatchHandle>>
  setThemePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  React.useEffect(() => {
    function handleKeyDown(ev: KeyboardEvent) {
      if (ev.ctrlKey || ev.altKey || ev.metaKey) { return }

      const key = ev.key.toLowerCase()

      if (ev.shiftKey) {
        if (key === 'd') {
          const debugTimes = new Map<string, number>([
            ['17', 750_000],
            ['21', 145_000],
            ['16', 600_000],
            ['20', 285_000],
          ])
          handlesRef.current.forEach((v, k) => {
            v.stopwatch.reset()
            const time = debugTimes.get(k) ?? null
            if (time != null) {
              v.stopwatch.adjustElapsedTime(time)
            }
          })
        }
        return
      }

      switch (key) {
        case 'c':
          handlesRef.current.forEach((v) => { v.reset() })
          break
        case 'p':
          handlesRef.current.forEach((v) => { v.stopwatch.stop() })
          break
        case 'y':
          setThemePickerOpen(x => !x)
          break
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handlesRef, setThemePickerOpen])
}

export function useViewTouchGestures({
  themePickerOpen,
  setThemePickerOpen,
}: {
  themePickerOpen: boolean
  setThemePickerOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  React.useEffect(() => {
    if (themePickerOpen) { return }

    const HOLD_THRESHOLD_MS = 500
    const VERTICAL_THRESHOLD_PX = -200
    const HORIZONTAL_TOLERANCE_PX = 80

    let startX: number | null = null
    let startY: number | null = null
    let holdTimer: ReturnType<typeof setTimeout> | null = null

    function clear() {
      if (holdTimer != null) {
        clearTimeout(holdTimer)
        holdTimer = null
      }
    }
    function reset() {
      clear()
      startX = null
      startY = null
    }
    function cancelHandler(_ev: Event) {
      reset()
    }

    function handleTouchStart(ev: TouchEvent) {
      reset()
      if (ev.touches.length !== 1) { return }
      const touch = ev.touches[0]
      startX = touch.clientX
      startY = touch.clientY
    }
    function handleTouchMove(ev: TouchEvent) {
      if (startX == null || startY == null || ev.touches.length !== 1) { return }

      const touch = ev.touches[0]
      const currentX = touch.clientX
      const currentY = touch.clientY
      const deltaX = currentX - startX
      const deltaY = currentY - startY

      const meetsVerticalThreshold = VERTICAL_THRESHOLD_PX < 0
          ? deltaY <= VERTICAL_THRESHOLD_PX
          : deltaY >= VERTICAL_THRESHOLD_PX
      const meetsHorizontalTolerance = Math.abs(deltaX) < HORIZONTAL_TOLERANCE_PX

      if (meetsVerticalThreshold && meetsHorizontalTolerance) {
        if (holdTimer == null) {
          holdTimer = setTimeout(() => { setThemePickerOpen(true) }, HOLD_THRESHOLD_MS)
        }
      } else {
        clear()
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', cancelHandler)
    document.addEventListener('touchcancel', cancelHandler)
    window.addEventListener('scroll', cancelHandler)
    window.addEventListener('resize', cancelHandler)
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', cancelHandler)
      document.removeEventListener('touchcancel', cancelHandler)
      window.removeEventListener('scroll', cancelHandler)
      window.removeEventListener('resize', cancelHandler)
      clear()
    }
  }, [themePickerOpen, setThemePickerOpen])
}
