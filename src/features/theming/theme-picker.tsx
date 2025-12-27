'use client'

import React from "react"
import { Stopwatch as StopwatchComponent } from "../stopwatch/component"
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
} from "@/components/responsive-modal"
import { cn } from "@/lib/utils"
import { useDarkModePreferenceContext, useVisualStylePreferenceContext } from "@/lib/theme-preference-facilitator"
import { SaturateFaintColors } from "./saturate-faint-colors"


let themesDataMap: Map<string, { displayName: string, css: string }> | null = null

export function getThemesDataMap() {
  if (themesDataMap != null) { return themesDataMap }

  const selector = 'style[id^="theme["][data-visual-style-slug-name][data-visual-style-display-name]'
  const elements = document.querySelectorAll(selector)
  return themesDataMap = Array.from(elements).reduce((acc, x) => {
    if (!(x instanceof HTMLStyleElement)) { return acc }
    const slugName = x.dataset.visualStyleSlugName
    const displayName = x.dataset.visualStyleDisplayName
    if (slugName == null || displayName == null) { return acc }
    acc.set(slugName, { displayName, css: x.textContent || "" })
    return acc
  }, new Map())
}

export function ThemeGalleryItems() {
  const themesDataMap = getThemesDataMap()

  const { darkModeActive } = useDarkModePreferenceContext()

  const {
    userVisualStylePreference,
    commitUserVisualStylePreference,
  } = useVisualStylePreferenceContext()

  return <>
    {Array.from(themesDataMap.entries()).map(([themeSlugName, { displayName, css }], index) => {
      const selected = userVisualStylePreference === themeSlugName
      return (
        <div
          key={themeSlugName}
          role="button"
          tabIndex={0}
          onClick={_ev => { commitUserVisualStylePreference(selected ? null : themeSlugName) }}
          onKeyDown={ev => {
            if (ev.key === 'Enter' || ev.key === ' ') {
              commitUserVisualStylePreference(selected ? null : themeSlugName)
            }
          }}
          className={cn(
            "focus-visible:ring-primary flex flex-col items-center gap-1 rounded-xl p-2 transition-all outline-none focus-visible:ring-2",
            selected
                ? "bg-accent/50 ring-primary shadow-lg ring-2"
                : "hover:bg-accent/30 scale-99",
          )}
        >
          <style
            id={`theme-preview[${themeSlugName}]`}
            dangerouslySetInnerHTML={{
              __html: css
                  .replace(/^:root\b/gm, `.theme-preview\\[${themeSlugName}\\]`)
                  .replace(/^\.dark\b/gm, `.theme-preview\\[${themeSlugName}\\].dark`)
                  .trim(),
            }}
          />
          <div
            className={cn(
              `theme-preview\[${themeSlugName}\]`,
              "pointer-events-none flex w-full scale-90 justify-center [&>div]:w-full",
              darkModeActive && "dark",
            )}
            inert
          >
            <StopwatchComponent
              label={String(index + 1)}
              initialTimeValue={375_000}
            />
          </div>
          <SaturateFaintColors>
            <span className={cn(
              "text-sm font-semibold tracking-tight",
              selected ? "text-primary" : "text-muted-foreground",
            )}>
              {displayName}
            </span>
          </SaturateFaintColors>
        </div>
      )
    })}
  </>
}

export function ThemeGalleryGrid() {
  return (
    <div className={[
      "grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 min-[56rem]:grid-cols-4 lg:grid-cols-5",
      "*:snap-start",
    ].join(" ")}>
      <ThemeGalleryItems />
    </div>
  )
}

export function ThemePicker({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: React.Dispatch<boolean>
}) {
  const scrollPositionRef = React.useRef(0)

  return (
    <ResponsiveModal open={open} onOpenChange={setOpen}>
      <ResponsiveModalContent
        className={[
          "z-51",
          `\
data-[slot=dialog-content]:max-w-3xl
data-[slot=dialog-content]:md:max-w-4xl
data-[slot=dialog-content]:gap-2
data-[slot=dialog-content]:md:w-[calc(100%-6rem)]
`.trim().split("\n").join(" "),
        ].join(" ")}
        onOpenAutoFocus={ev => ev.preventDefault()}
      >
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Select Theme</ResponsiveModalTitle>
          <ResponsiveModalDescription>Choose a visual style</ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div
          className={[
            "overflow-y-auto",
            "snap-y snap-proximity scroll-py-1",
            `\
in-data-[slot=dialog-content]:my-2
in-data-[slot=dialog-content]:max-h-[60lvh]
in-data-[slot=dialog-content]:lg:max-h-[66vh]
`.match(/\S+/g)?.join(" ") ?? "",
          ].join(" ")}
          ref={el => {
            if (el == null) { return }
            el.scrollTop = scrollPositionRef.current
          }}
          onScroll={ev => { scrollPositionRef.current = ev.currentTarget.scrollTop }}
        >
          <ThemeGalleryGrid />
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
