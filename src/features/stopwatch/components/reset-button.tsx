'use client'

import * as lucide from "lucide-react"
import { Button } from "@/components/ui/button"

export function ResetButton({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled: boolean
}) {
  return (
    <Button
      type="button"
      onClick={(_ev) => onClick()}
      onTouchEnd={(ev) => {
        ev.preventDefault()
        const touch = ev.changedTouches[0]
        const elementAtPoint = document.elementFromPoint(touch.clientX, touch.clientY)
        if (ev.currentTarget.contains(elementAtPoint)) {
          onClick()
        }
      }}
      suppressHydrationWarning  // Firefox
      disabled={disabled}
      variant="ghost"
      size="icon"
      className={[
        "bg-secondary/20 hover:bg-secondary/30 text-foreground border-border/50",
        "rounded-full border-2 px-5.5 [&&_svg]:size-5 [@media(hover:hover)]:active:scale-90",
      ].join(" ")}
      aria-label="Reset Timer"
    >
      <lucide.RotateCcw className="opacity-80" />
    </Button>
  )
}
