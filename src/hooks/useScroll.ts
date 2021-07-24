import { useState } from 'preact/hooks'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useScroll = (
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  elementRef: any,
  step: number,
  axis: string
) => {
  const [position, setPosition] = useState(0)
  const prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'
  const scrollDown = () => {
    setPosition(elementRef.current[prop] += step)
  }
  const scrollUp = () => {
    setPosition(elementRef.current[prop] -= step)
  }
  return [scrollDown, scrollUp, position]
}
