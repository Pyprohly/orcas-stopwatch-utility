'use client'

import React from "react"
import { cn } from "@/lib/utils"
import { Stopwatch as StopwatchUtility } from "@/utils/stopwatch"
import { formatStopwatchTime } from "@/utils/format-stopwatch-time"
import {
  StartStopButton,
  ResetButton,
  TimeAdjustButton,
  FlagButton,
} from "./components"
import * as stopwatchHooks from "./hooks"
import { useDarkModePreferenceContext } from "@/lib/theme-preference-facilitator"
import { SaturateFaintColors } from "../theming/saturate-faint-colors"

function splitTime(formattedTime: string): { whole: string; fractional: string } {
  const lastDotIndex = formattedTime.lastIndexOf(".")
  if (lastDotIndex < 0) {
    throw new Error("dot separator missing")
  }
  return {
    whole: formattedTime.slice(0, lastDotIndex),
    fractional: formattedTime.slice(lastDotIndex + 1),
  }
}

function getFontSize(len: number): string {
  if (len > 10) { return "text-lg" }
  if (len > 7) { return "text-xl" }
  return "text-2xl"
}

export type ComputeDisplayDataResult = {
  formattedTimeParts: { whole: string; fractional: string }
  fontSizeClass: string
  radialWipeProgress: number
}
export function computeDisplayData(timeMs: number): ComputeDisplayDataResult {
  const seconds = timeMs / 1000
  const formattedTime = formatStopwatchTime(seconds)
  const formattedTimeParts = splitTime(formattedTime)
  const fontSizeClass = getFontSize(formattedTime.length)
  const radialWipeProgress = Math.min(seconds / (15 * 60), 1) * 100
  return {
    formattedTimeParts,
    fontSizeClass,
    radialWipeProgress,
  }
}

type DispatchActions =
    | 'start'
    | 'stop'
    | 'reset'
    | 'adjust'

export class ReactifiedStopwatch extends StopwatchUtility {
  public constructor(
    private readonly dispatch: React.Dispatch<DispatchActions>,
  ) { super() }

  public override start(): void {
    super.start()
    this.dispatch('start')
  }

  public override stop(): void {
    super.stop()
    this.dispatch('stop')
  }

  public override reset(): void {
    super.reset()
    this.dispatch('reset')
  }

  public override getElapsedTime(timestamp?: DOMHighResTimeStamp): number {
    if (timestamp == null) { return super.getElapsedTime() }

    let e = this.elapsedTime
    if (this.running) {
      if (this.startedTime == null) { throw Error() }
      e += Math.max(0, timestamp - this.startedTime)
    }
    return e
  }

  public override adjustElapsedTime(delta: number): void {
    super.adjustElapsedTime(delta)
    this.dispatch('adjust')
  }

  public getState(): [startedTime: number | null, elapsedTime: number] {
    return [this.startedTime, this.elapsedTime]
  }

  public setState(state: [startedTime: number | null, elapsedTime: number]): void {
    this.startedTime = state[0]
    this.elapsedTime = state[1]
  }
}

export type Handle = {
  stopwatch: StopwatchUtility
  amberFlag: boolean
  setAmberFlag: React.Dispatch<boolean>
  greenFlag: boolean
  setGreenFlag: React.Dispatch<boolean>
  reset: () => void
}

export function Stopwatch({
  ref,
  idt,
  label,
  initialTimeValue = 0,
}: {
  ref?: React.Ref<Handle>
  idt?: string | null
  label: string
  initialTimeValue?: number
}) {
  React.useImperativeHandle(ref, () => ({
    stopwatch: stopwatchRef.current,
    amberFlag,
    setAmberFlag,
    greenFlag,
    setGreenFlag,
    reset: () => {
      stopwatchRef.current.reset()
      setGreenFlag(false)
      setAmberFlag(false)
    },
  }))

  const [timeValue, setTimeValue] = React.useState(initialTimeValue)
  const [running, setRunning] = React.useState(false)
  const [amberFlag, setAmberFlag] = React.useState(false)
  const [greenFlag, setGreenFlag] = React.useState(false)

  const [stopwatchRef, _setStopwatchRef] = React.useState<React.RefObject<ReactifiedStopwatch>>(() => {
    function stopwatchSynchronizeDispatch(action: DispatchActions): void {
      switch (action) {
        case 'start':
          setRunning(true)
          break
        case 'stop':
          setRunning(false)
          setTimeValue(stopwatchRef.current.getElapsedTime())
          break
        case 'reset':
          setTimeValue(0)
          setRunning(false)
          setRestoreStateEffectTrigger(Symbol())
          break
        case 'adjust':
          setTimeValue(stopwatchRef.current.getElapsedTime())
          setRestoreStateEffectTrigger(Symbol())
          break
        default:
          throw Error()
      }
    }
    const stopwatch = new ReactifiedStopwatch(stopwatchSynchronizeDispatch)
    stopwatch.setState([null, initialTimeValue])
    return { current: stopwatch }
  })

  const [restoreStateEffectTrigger, setRestoreStateEffectTrigger] = React.useState(Symbol())

  stopwatchHooks.useStopwatchPersistence({
    idt,
    stopwatchRef,
    running,
    setTimeValue,
    setRunning,
    amberFlag,
    setAmberFlag,
    greenFlag,
    setGreenFlag,
    restoreStateEffectTrigger,
    setRestoreStateEffectTrigger,
  })

  const progressRef = React.useRef<HTMLDivElement>(null)
  const timerDisplayRef = React.useRef<HTMLDivElement>(null)
  const wholePartRef = React.useRef<HTMLSpanElement>(null)
  const fractionalPartRef = React.useRef<HTMLSpanElement>(null)

  stopwatchHooks.useStopwatchAnimation({
    stopwatchRef,
    running,
    progressRef,
    timerDisplayRef,
    wholePartRef,
    fractionalPartRef,
  })

  const {
    formattedTimeParts,
    fontSizeClass,
    radialWipeProgress,
  } = computeDisplayData(timeValue)

  const {
    hasMounted,
    darkModeActive,
  } = useDarkModePreferenceContext()
  const lightModeActive = !darkModeActive

  if (!hasMounted) { return null }
  return (
    <div
      className={cn(
        "bg-card relative isolate max-w-[200px] min-w-[160px] overflow-hidden border p-2 shadow-sm",
        "rounded-[min(calc(var(--radius)*2),26px)]",
        // Could totally use Tailwind instead of the `style` attribute to reduce
        // pop-in during hydration caused by the need to use `hasMounted`.
        // "bg-[oklch(from_var(--card)_calc((l+1)/2)_c_h)]",
        // "dark:bg-[oklch(from_var(--card)_calc((l+0.21)/2)_c_h)]",
      )}
      style={{
        backgroundColor: lightModeActive
            ? "oklch(from var(--card) calc((l + 1) / 2) c h)"
            : "oklch(from var(--card) calc((l + .21) / 2) c h)"
            ,
      }}
    >
      {/* Background Progress Effect */}
      <div
        ref={progressRef}
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          '--progress': `${radialWipeProgress}%`,
          '--color': lightModeActive
              ? "oklch(from var(--muted) calc((l + .76) / 2) c h)"
              : "oklch(from var(--muted) calc((l + .52) / 2) c h)"
              ,
          background: `conic-gradient(var(--color) var(--progress), transparent var(--progress))`,
        } as React.CSSProperties}
      />

      {/* Decorative Label */}
      <span className="text-muted-foreground/20 absolute -mt-2 -ml-0.5 font-sans text-5xl font-extrabold tracking-tighter italic">
        {label}
      </span>

      {/* Main Content */}
      <div className="isolate">
        {/* Header Controls */}
        <div className="flex justify-end gap-1">
          <FlagButton
            color="amber"
            active={amberFlag}
            onClick={() => setAmberFlag(!amberFlag)}
          />
          <FlagButton
            color="green"
            active={greenFlag}
            onClick={() => setGreenFlag(!greenFlag)}
          />
        </div>

        {/* Timer Display */}
        <div
          ref={timerDisplayRef}
          className={cn(
            "flex items-baseline justify-center font-mono leading-none font-bold tabular-nums select-all",
            fontSizeClass,
          )}
        >
          <SaturateFaintColors>
            <span ref={wholePartRef} className="text-primary">
              {formattedTimeParts.whole}
            </span>
          </SaturateFaintColors>
          <span
            className="text-secondary text-lg"
            style={{
              color: lightModeActive
                  ? "oklch(from var(--secondary) calc((l + .5) / 2) c h)"
                  : "oklch(from var(--secondary) calc((l + .62) / 2) c h)"
                  ,
            }}
          >
            .
            <span ref={fractionalPartRef}>
              {formattedTimeParts.fractional}
            </span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between">
          {/* Left Side Controls */}
          <div>
            {running ? (
              <div className="flex gap-1">
                <TimeAdjustButton
                  seconds={-20}
                  onClick={() => stopwatchRef.current.adjustElapsedTime(-20_000)}
                />
                <TimeAdjustButton
                  seconds={+20}
                  onClick={() => stopwatchRef.current.adjustElapsedTime(20_000)}
                />
              </div>
            ) : (
              <ResetButton onClick={stopwatchRef.current.reset} disabled={timeValue === 0} />
            )}
          </div>

          {/* Right Side Controls (Main Action) */}
          <div className="ml-auto">
            <SaturateFaintColors>
              <StartStopButton
                isRunning={running}
                onStart={stopwatchRef.current.start}
                onStop={stopwatchRef.current.stop}
              />
            </SaturateFaintColors>
          </div>
        </div>
      </div>
    </div>
  )
}
