'use client'

import React from 'react'


// <https://usehooks-ts.com/react-hook/use-is-mounted>
// <https://react-hookz.github.io/web/?path=/docs/lifecycle-useismounted--example>
// <https://github.com/streamich/react-use/blob/master/src/useMountedState.ts>
// <https://github.com/streamich/react-use/blob/master/docs/useMountedState.md>
// <https://stackoverflow.com/questions/39767482/is-there-a-way-to-check-if-the-react-component-is-unmounted>
// <https://react-hooked.vercel.app/docs/useIsFirstRender>
// <https://mantine.dev/hooks/use-is-first-render/>

// With `useIsMounted`, its position relative to other `useEffect`s is
// significant. Place this hook last to behave like `useHasMounted`. Place it
// first for its value to be more technically correct (since effects only run
// on mounted components).

export function useIsMountedRef(): React.RefObject<boolean> {
  const isMountedRef = React.useRef(false)
  React.useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])
  return isMountedRef
}

// `useIsMountedRef` and `useGetIsMounted` are practically the same:
// `useIsMountedRef` returns a ref, while `useGetIsMounted` returns a function
// returning the ref value. Maybe prefer `useGetIsMounted`.

export function useGetIsMounted(): () => boolean {
  const isMountedRef = React.useRef(false)
  React.useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])
  return React.useCallback(() => isMountedRef.current, [])
}


// <https://www.joshwcomeau.com/snippets/react-hooks/use-has-mounted/>
// <https://usehooks-ts.com/react-hook/use-is-client>
// <https://github.com/streamich/react-use/blob/master/src/useFirstMountState.ts>
// <https://www.joshwcomeau.com/react/the-perils-of-rehydration/>
// <https://mantine.dev/hooks/use-mounted/>

// The `useHasMounted` hook can be placed anywhere relative to other hooks and
// its value will be the same. The down side, in contrast to `useIsMounted`, is
// that `useHasMounted` always causes a rerender.

// Typically you’ll use `useHasMounted` when you want to read the mounted state
// inside effects since it retains the stale mounted state value until
// completion of first render cycle, whereas with `useIsMounted`, especially if
// the hook is placed first relative to other `useEffect` hooks, you may not
// get a chance to read the mounted state false value before it flips.

export function useHasMounted(): boolean {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => { setHasMounted(true) }, [])
  return hasMounted
}

// Between `useIsMounted` and `useHasMounted`, their naming is so similar.
// Components mount before their effects have run, so `useIsMounted` is
// technically more deserving of its name.

// The LLMs seem to unanimously agree on the naming scheme of all these hooks.
