'use client'

// https://github.com/w3c/csswg-drafts/issues/2864

import React from 'react'

export function CSSVariableTransformer({
  transformers,
  children,
}: {
  transformers: Record<string, (value: string) => string | null>
  children: React.ReactNode
}) {
  const outerDivRef = React.useRef<HTMLDivElement | null>(null)
  const [outerDivStyle, setOuterDivStyle] = React.useState<React.CSSProperties>({})
  const [innerDivStyle, setInnerDivStyle] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (outerDivRef.current == null) { throw Error() }

    const style = getComputedStyle(outerDivRef.current)
    const outerDivStyle: Record<string, string> = {}
    const innerDivStyle: Record<string, string> = {}
    for (const [propertyName, transformer] of Object.entries(transformers)) {
      if (!propertyName.startsWith("--")) {
        throw new Error("Property must be a CSS variable")
      }
      const value = style.getPropertyValue(propertyName)
      const transformedValue = transformer(value)
      if (transformedValue == null) { continue }
      const tempPropertyName = `--temp-${propertyName.slice(2)}`
      outerDivStyle[tempPropertyName] = transformedValue
      innerDivStyle[propertyName] = `var(${tempPropertyName})`
    }
    setOuterDivStyle(outerDivStyle)
    setInnerDivStyle(innerDivStyle)
  }, [transformers])

  return (
    <div
      ref={outerDivRef}
      className="contents"
      style={outerDivStyle}
    >
      <div
        className="contents"
        style={innerDivStyle}
      >
        {children}
      </div>
    </div>
  )
}
