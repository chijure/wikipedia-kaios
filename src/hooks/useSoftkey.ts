import { useContext, useEffect } from 'preact/hooks'
import { SoftkeyContext } from '../contexts/index'

export const useSoftkey = (origin: string, config = null, dependencies = [], replace = false) => {
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
