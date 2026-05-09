import { useEffect, useRef } from 'react'

export function usePolling(
  callback: () => void,
  interval: number,
  active: boolean
) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    if (!active) return
    const id = setInterval(() => callbackRef.current(), interval)
    return () => clearInterval(id)
  }, [interval, active])
}
