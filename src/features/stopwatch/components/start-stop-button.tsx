"use client"

import * as lucide from "lucide-react"
import { Button } from "@/components/ui/button"

export function StartStopButton({
  isRunning,
  onStart,
  onStop,
}: {
  isRunning: boolean
  onStart: () => void
  onStop: () => void
}) {
  return isRunning ? (
    <Button
      type="button"
      onClick={onStop}
      onTouchEnd={ev => {
        ev.preventDefault()
        const touch = ev.changedTouches[0]
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY)
        if (ev.currentTarget.contains(elementAtPoint)) {
          onStop()
        }
      }}
      variant="default"
      size="icon"
      className={[
        "bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/20 hover:border-destructive/30",
        "rounded-full border-2 px-5.5 [@media(hover:hover)]:active:scale-90",
      ].join(" ")}
      aria-label="Stop Timer"
    >
      <lucide.Square fill="currentColor" className="opacity-90" />
    </Button>
  ) : (
    <Button
      type="button"
      onClick={onStart}
      onTouchEnd={ev => {
        ev.preventDefault()

        const touch = ev.changedTouches[0]
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY)
        if (ev.currentTarget.contains(elementAtPoint)) {
          onStart()
        }
      }}
      variant="default"
      size="icon"
      className={[
        "bg-primary/10 hover:bg-primary/20 text-primary border-primary/20 hover:border-primary/30",
        "rounded-full border-2 px-5.5 [@media(hover:hover)]:active:scale-90",
      ].join(" ")}
      aria-label="Start Timer"
    >
      <lucide.Play fill="currentColor" className="opacity-90" />
    </Button>
  )
}
