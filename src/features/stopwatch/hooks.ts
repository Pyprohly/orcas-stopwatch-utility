'use client'

import React from "react"
import * as persistence from "@/utils/persistence"
import type { ReactifiedStopwatch } from "./component"

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
  setTimeValue,
  running,
}: {
  stopwatchRef: React.RefObject<ReactifiedStopwatch>
  setTimeValue: React.Dispatch<number>
  running: boolean
}) {
  const rafHandleRef: React.RefObject<number | null> = React.useRef(null)

  React.useEffect(() => {
    function animate(timestamp: DOMHighResTimeStamp) {
      setTimeValue(stopwatchRef.current.getElapsedTime(timestamp))
      rafHandleRef.current = running ? requestAnimationFrame(animate) : null
    }
    rafHandleRef.current = requestAnimationFrame(animate)
    return () => {
      if (rafHandleRef.current == null) { return }
      cancelAnimationFrame(rafHandleRef.current)
    }
  }, [stopwatchRef, setTimeValue, running])
}
