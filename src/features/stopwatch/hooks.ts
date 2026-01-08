'use client'

import React from "react"
import * as persistence from "@/utils/persistence"
import { computeDisplayData, type ReactifiedStopwatch } from "./component"

export function useStopwatchPersistence({
  idt,
  stopwatchRef,
  setTimeValue,
  running,
  setRunning,
  amberFlag,
  setAmberFlag,
  greenFlag,
  setGreenFlag,
  restoreStateEffectTrigger,
  setRestoreStateEffectTrigger,
}: {
  idt?: string | null
  stopwatchRef: React.RefObject<ReactifiedStopwatch>
  setTimeValue: React.Dispatch<number>
  running: boolean
  setRunning: React.Dispatch<boolean>
  amberFlag: boolean
  setAmberFlag: React.Dispatch<boolean>
  greenFlag: boolean
  setGreenFlag: React.Dispatch<boolean>
  restoreStateEffectTrigger: symbol
  setRestoreStateEffectTrigger: React.Dispatch<symbol>
}) {
  const restoreStateEffectJammerRef = React.useRef(1)

  React.useEffect(function restoreState() {
    if (idt == null) { return }

    const state = persistence.load(idt)
    if (state == null) { return }

    let adjustedStartedTime: number | null = null
    if (state.started != null) {
      const delta = performance.timeOrigin - state.origin
      adjustedStartedTime = state.started - delta
    }
    stopwatchRef.current.setState([adjustedStartedTime, state.elapsed])

    setTimeValue(stopwatchRef.current.getElapsedTime())
    setRunning(stopwatchRef.current.running)
    setAmberFlag(state.amberFlag)
    setGreenFlag(state.greenFlag)
    setRestoreStateEffectTrigger(Symbol())
    restoreStateEffectJammerRef.current += 1
  }, [
    idt,
    stopwatchRef,
    setTimeValue,
    setRunning,
    setAmberFlag,
    setGreenFlag,
    setRestoreStateEffectTrigger,
  ])

  React.useEffect(function storeState() {
    void running
    void restoreStateEffectTrigger

    if (restoreStateEffectJammerRef.current > 0) {
      restoreStateEffectJammerRef.current -= 1
      return
    }

    if (idt == null) { return }

    const [started, elapsed] = stopwatchRef.current.getState()
    if (
      started == null
      && elapsed === 0
      && !amberFlag
      && !greenFlag
    ) {
      persistence.clear(idt)
      return
    }
    persistence.save(
      idt,
      {
        origin: performance.timeOrigin,
        started,
        elapsed,
        amberFlag,
        greenFlag,
      },
    )
  }, [
    idt,
    stopwatchRef,
    amberFlag,
    greenFlag,
    running,
    restoreStateEffectTrigger,
  ])
}

export function useStopwatchAnimation({
  stopwatchRef,
  running,
  progressRef,
  timerDisplayRef,
  wholePartRef,
  fractionalPartRef,
}: {
  stopwatchRef: React.RefObject<ReactifiedStopwatch>
  running: boolean
  progressRef: React.RefObject<HTMLDivElement | null>
  timerDisplayRef: React.RefObject<HTMLDivElement | null>
  wholePartRef: React.RefObject<HTMLSpanElement | null>
  fractionalPartRef: React.RefObject<HTMLSpanElement | null>
}) {
  const rafHandleRef: React.RefObject<number | null> = React.useRef(null)

  React.useEffect(() => {
    if (!running) { return }

    function animate(timestamp: DOMHighResTimeStamp) {
      if (
        progressRef.current != null
        && timerDisplayRef.current != null
        && wholePartRef.current != null
        && fractionalPartRef.current != null
      ) {
        const timeValue = stopwatchRef.current.getElapsedTime(timestamp)
        const {
          formattedTimeParts,
          fontSizeClass,
          radialWipeProgress,
        } = computeDisplayData(timeValue)

        let el: HTMLElement
        el = progressRef.current
        if (el.style.getPropertyValue('--progress') !== `${radialWipeProgress}%`) {
          el.style.setProperty('--progress', `${radialWipeProgress}%`)
        }
        el = timerDisplayRef.current
        if (!el.classList.contains(fontSizeClass)) {
          el.classList.remove("text-lg", "text-xl", "text-2xl")
          el.classList.add(fontSizeClass)
        }
        el = wholePartRef.current
        if (el.textContent !== formattedTimeParts.whole) {
          el.textContent = formattedTimeParts.whole
        }
        el = fractionalPartRef.current
        if (el.textContent !== formattedTimeParts.fractional) {
          el.textContent = formattedTimeParts.fractional
        }
      }

      rafHandleRef.current = running ? requestAnimationFrame(animate) : null
    }
    rafHandleRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafHandleRef.current == null) { return }
      cancelAnimationFrame(rafHandleRef.current)
    }
  }, [
    stopwatchRef,
    running,
    progressRef,
    timerDisplayRef,
    wholePartRef,
    fractionalPartRef,
  ])
}
