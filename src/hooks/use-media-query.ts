'use client'

import React from "react"

export function useMediaQuery(
  query: string,
  opts?: { placeholder?: boolean },
): boolean {
  const [value, setValue] = React.useState<boolean>(opts?.placeholder ?? false)

  React.useEffect(() => {
    setValue(matchMedia(query).matches)

    function listener(event: MediaQueryListEvent) { setValue(event.matches) }
    const media = matchMedia(query)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return value
}
