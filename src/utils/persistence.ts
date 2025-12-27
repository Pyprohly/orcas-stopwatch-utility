'use client'

const storage = localStorage

export const STORAGE_KEY_FORMAT: string = "stopwatch[%s]"
export const STORAGE_KEY_REGEX: RegExp = /^stopwatch\[(.*)\]$/

export type State = {
  origin: number
  started: number | null
  elapsed: number
  amberFlag: boolean
  greenFlag: boolean
}

export function unparse(state: State): string {
  return JSON.stringify(state)
}

export function parse(text: string): State | null {
  function isState(value: object): value is State {
    const data = value as Record<string, unknown>
    return (
      typeof data['origin'] === 'number'
      && (data['started'] === null || typeof data['started'] === 'number')
      && typeof data['elapsed'] === 'number'
      && typeof data['greenFlag'] === 'boolean'
      && typeof data['amberFlag'] === 'boolean'
    )
  }

  const parsed: unknown = JSON.parse(text)
  if (parsed == null) { return null }
  if (!isState(parsed)) { return null }
  return {
    origin: parsed.origin,
    started: parsed.started,
    elapsed: parsed.elapsed,
    greenFlag: parsed.greenFlag,
    amberFlag: parsed.amberFlag,
  }
}

export function save(idt: string, state: State): void {
  const key = STORAGE_KEY_FORMAT.replace("%s", idt)
  storage.setItem(key, unparse(state))
}

export function load(idt: string): State | null {
  const key = STORAGE_KEY_FORMAT.replace("%s", idt)
  const value = storage.getItem(key)
  if (value == null) { return null }
  try {
    return parse(value)
  } catch (err) {
    if (!(err instanceof SyntaxError)) { throw err }
    clear(idt)
  }
  return null
}

export function clear(idt: string): void {
  const key = STORAGE_KEY_FORMAT.replace("%s", idt)
  storage.removeItem(key)
}

export function clearAll(): void {
  for (let i = 0, l = storage.length; i < l; i++) {
    const key = storage.key(i)
    if (key == null) { throw Error() }
    if (STORAGE_KEY_REGEX.test(key)) {
      storage.removeItem(key)
    }
  }
}
