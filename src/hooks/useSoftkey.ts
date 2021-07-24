import { useContext, useEffect } from 'preact/hooks'
import { SoftkeyContext } from '../contexts/index'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useSoftkey = (origin: string, config = null, dependencies = [], replace = false) => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const softkey: any = useContext(SoftkeyContext)
  useEffect(() => {
    softkey.dispatch({ type: 'push', origin })
    return () => softkey.dispatch({ type: 'pop', origin })
  }, [origin])

  useEffect(() => {
    if (config) {
      const type = replace ? 'replace' : 'set'
      softkey.dispatch({ type, config, origin })
    }
  }, dependencies)
  return softkey
}
