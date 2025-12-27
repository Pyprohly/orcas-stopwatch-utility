
export function formatStopwatchTime(
  totalSeconds: number,
  precision: number = 2,
): string {
  if (precision < 0) {
    throw new Error("`precision` must be non-negative")
  }

  const sign = totalSeconds < 0 ? "-" : ""
  totalSeconds = Math.abs(totalSeconds)

  const scaleFactor = 10 ** precision
  const wholeUnits = Math.round(totalSeconds * scaleFactor)
  const [wholeSeconds, partUnits] = [Math.floor(wholeUnits / scaleFactor), wholeUnits % scaleFactor]
  const [wholeMinutes, partSeconds] = [Math.floor(wholeSeconds / 60), wholeSeconds % 60]
  const [wholeHours, partMinutes] = [Math.floor(wholeMinutes / 60), wholeMinutes % 60]
  const [wholeDays, partHours] = [Math.floor(wholeHours / 24), wholeHours % 24]

  return (
    sign
    + (wholeDays ? `${wholeDays}.` : "")
    + (wholeDays || partHours ? `${String(partHours).padStart(2, "0")}:` : "")
    + `${String(partMinutes).padStart(2, "0")}:${String(partSeconds).padStart(2, "0")}`
    + (precision > 0 ? `.${String(partUnits).padStart(precision, "0")}` : "")
  )
}
