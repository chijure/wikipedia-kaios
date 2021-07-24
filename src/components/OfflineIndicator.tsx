import { FunctionalComponent, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { useI18n, useOnlineStatus } from '../hooks/index'

interface OfflineIndicatorProps {
  routeUrl: string;
}

export const OfflineIndicator: FunctionalComponent<OfflineIndicatorProps> = ({ routeUrl }: OfflineIndicatorProps) => {
  const i18n = useI18n()
  const isOnline = useOnlineStatus(undefined)
  const [isVisible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    setVisible(!isOnline)
    if (!isOnline) {
      setTimeout(() => { setVisible(false) }, 3000)
    }
  }, [isOnline, routeUrl])

  if (isVisible) {
    return <div className='offline'>{i18n('offline-message')}</div>
  }
}
