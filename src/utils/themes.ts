
import path from 'node:path'
import fs from 'node:fs'

export const THEME_SLUG_NAMES: string[] = [
  'amber-minimal',
  'amethyst-haze',
  'bold-tech',
  'bubblegum',
  'caffeine',
  'candyland',
  'catppuccin',
  'claude',
  'claymorphism',
  'clean-slate',
  'cosmic-night',
  'cyberpunk',
  'darkmatter',
  'default',
  'doom-64',
  'elegant-luxury',
  'graphite',
  'kodama-grove',
  'midnight-bloom',
  'mocha-mousse',
  'modern-minimal',
  'mono',
  'nature',
  'neo-brutalism',
  'northern-lights',
  'notebook',
  'ocean-breeze',
  'pastel-dreams',
  'perpetuity',
  'quantum-rose',
  'retro-arcade',
  'sage-garden',
  'soft-pop',
  'solar-dusk',
  'starry-night',
  'sunset-horizon',
  'supabase',
  't3-chat',
  'tangerine',
  'twitter',
  'vercel',
  'vintage-paper',
  'violet-bloom',
]

export function getThemeDisplayName(themeSlugName: string): string {
  return themeSlugName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
}

function loadThemesCssDataMap(): Map<string, { displayName: string, css: string }> {
  const themesDir = path.join(process.cwd(), 'src/themes-css/')
  return new Map<string, { displayName: string, css: string }>(
    THEME_SLUG_NAMES.map(name => {
      const filePath = path.join(themesDir, name + '.css')
      const css = fs.readFileSync(filePath, 'utf-8')
      return [name, { displayName: getThemeDisplayName(name), css }]
    })
  )
}
export const THEMES_DATA_MAP: Map<string, { displayName: string, css: string }> = loadThemesCssDataMap()
