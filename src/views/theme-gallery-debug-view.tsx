
import { ThemeGalleryItems } from "../features/theming/theme-picker"

function ThemeGalleryFlex() {
  return (
    <div className="flex flex-wrap justify-around gap-1 p-1 *:grow">
      <ThemeGalleryItems />
    </div>
  )
}

export function View() {
  return (
    <main>
      <ThemeGalleryFlex />
    </main>
  )
}
