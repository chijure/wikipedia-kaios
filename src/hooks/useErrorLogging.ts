import { useErrorBoundary } from 'preact/hooks'
import { isProd, sendErrorLog } from '../utils/index'

export const useErrorLogging = () => {
  if (!isProd()) {
    return
  }

  // @ts-ignore
  return useErrorBoundary(sendErrorLog)
}
