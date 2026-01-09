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

const FPS = 60
const FPS_INTERVAL_MS = 1000 / FPS

export function useStopwatchAnimation({
  stopwatchRef,
  running,
  containerRef,
  progressRef,
  timerDisplayRef,
  wholePartRef,
  fractionalPartRef,
}: {
  stopwatchRef: React.RefObject<ReactifiedStopwatch>
  running: boolean
  containerRef: React.RefObject<HTMLDivElement | null>
  progressRef: React.RefObject<HTMLDivElement | null>
  timerDisplayRef: React.RefObject<HTMLDivElement | null>
  wholePartRef: React.RefObject<HTMLSpanElement | null>
  fractionalPartRef: React.RefObject<HTMLSpanElement | null>
}) {
  const rafIdRef = React.useRef<number | null>(null)
  const lastTimestampRef = React.useRef<number | null>(null)
  const cacheRef = React.useRef({
    progress: "",
    fontSizeClass: "",
    whole: "",
    fractional: "",
  })

  React.useEffect(() => {
    if (!running) { return }

    function animate(timestamp: DOMHighResTimeStamp) {
      const lastTimestamp = lastTimestampRef.current
      if (lastTimestamp == null || timestamp - lastTimestamp >= FPS_INTERVAL_MS) {
        lastTimestampRef.current = timestamp

        if (
          progressRef.current == null
          || timerDisplayRef.current == null
          || wholePartRef.current == null
          || fractionalPartRef.current == null
        ) { throw Error() }

        const timeValue = stopwatchRef.current.getElapsedTime(timestamp)
        const data = computeDisplayData(timeValue)
        const cache = cacheRef.current

        let v: string
        v = `${data.radialWipeProgress.toFixed(2)}%`
        if (cache.progress !== v) {
          cache.progress = v
          progressRef.current.style.setProperty('--progress', v)
        }
        v = data.fontSizeClass
        if (cache.fontSizeClass !== v) {
          cache.fontSizeClass = v
          timerDisplayRef.current.classList.remove("text-lg", "text-xl", "text-2xl")
          timerDisplayRef.current.classList.add(v)
        }
        v = data.formattedTimeParts.whole
        if (cache.whole !== v) {
          cache.whole = v
          wholePartRef.current.textContent = v
        }
        v = data.formattedTimeParts.fractional
        if (cache.fractional !== v) {
          cache.fractional = v
          fractionalPartRef.current.textContent = v
        }
      }

      rafIdRef.current = requestAnimationFrame(animate)
    }
    rafIdRef.current = requestAnimationFrame(animate)

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (rafIdRef.current == null) {
          rafIdRef.current = requestAnimationFrame(animate)
        }
      } else {
        if (rafIdRef.current != null) {
          cancelAnimationFrame(rafIdRef.current)
          rafIdRef.current = null
        }
      }
    }, { threshold: 0 })
    if (containerRef.current == null) { throw Error() }
    observer.observe(containerRef.current)

    return () => {
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }

      observer.disconnect()
    }
  }, [
    stopwatchRef,
    running,
    containerRef,
    progressRef,
    timerDisplayRef,
    wholePartRef,
    fractionalPartRef,
  ])
}
