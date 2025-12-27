
import { THEMES_DATA_MAP } from "@/utils/themes"

export function ThemeStyleElements() {
  return Array.from(THEMES_DATA_MAP, ([slugName, { displayName, css }]) => (
    <style
      key={slugName}
      id={`theme[${slugName}]`}
      data-visual-style-slug-name={slugName}
      data-visual-style-display-name={displayName}
      media="not all"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: css }}
    />
  ))
}
