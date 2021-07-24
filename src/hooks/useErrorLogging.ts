import { useErrorBoundary } from 'preact/hooks'
import { isProd, sendErrorLog } from '../utils/index'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useErrorLogging = () => {
  if (!isProd()) {
    return
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return useErrorBoundary(sendErrorLog)
}
