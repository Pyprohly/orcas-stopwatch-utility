
import * as lucide from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function FlagButton({
  color,
  active,
  onClick,
}: {
  color: "amber" | "green"
  active: boolean
  onClick: () => void
}) {
  const colorStyle = {
    amber: "var(--color-amber-500)",
    green: "var(--color-green-500)",
  }[color]

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn([
        "flex rounded-full duration-300 [@media(hover:hover)]:active:scale-90",
        active
            ? [
              "bg-(--color-base)/20",
              "text-(--color-base)",
              "hover:bg-(--color-base)/30",
              "hover:text-(--color-base)",
              "dark:hover:bg-(--color-base)/30",
              "shadow-[0_0_10px_color-mix(in_oklch,var(--color-base),transparent_80%)]",
            ].join(" ")
            : "text-muted-foreground/50 hover:text-(--color-base)/60",
      ])}
      style={{ "--color-base": colorStyle } as React.CSSProperties}
      onClick={(_ev) => onClick()}
      onTouchEnd={(ev) => {
        ev.preventDefault()
        onClick()
      }}
      aria-label={`Toggle ${color} flag`}
      aria-pressed={active}
    >
      <lucide.Flag className={cn("size-4", active && "fill-current")} />
    </Button>
  )
}
