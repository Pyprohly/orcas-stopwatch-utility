
import { Button } from "@/components/ui/button"

export function TimeAdjustButton({
  seconds,
  onClick,
}: {
  seconds: number
  onClick: () => void
}) {
  const label = seconds > 0 ? `+${seconds}s` : `${seconds}s`
  const ariaLabel = seconds > 0 ? `Add ${seconds} seconds` : `Subtract ${Math.abs(seconds)} seconds`

  return (
    <Button
      type="button"
      onClick={(_ev) => onClick()}
      onTouchEnd={(ev) => {
        ev.preventDefault()
        onClick()
      }}
      variant="ghost"
      size="icon"
      className={[
        "bg-secondary/30 text-secondary-foreground/75 border-secondary/50",
        "flex rounded-full border text-[10px] font-bold tracking-normal [@media(hover:hover)]:active:scale-90",
      ].join(" ")}
      aria-label={ariaLabel}
    >
      {label}
    </Button>
  )
}
