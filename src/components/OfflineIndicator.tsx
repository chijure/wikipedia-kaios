import {FunctionalComponent, h} from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { useI18n, useOnlineStatus } from 'hooks'

export const OfflineIndicator: FunctionalComponent = ({ routeUrl }: any) => {
  const i18n = useI18n()
  const isOnline = useOnlineStatus()
  const [isVisible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    setVisible(!isOnline)
    if (!isOnline) {
      setTimeout(() => { setVisible(false) }, 3000)
    }
  }, [isOnline, routeUrl])

  if (isVisible) {
    return <div class='offline'>{i18n('offline-message')}</div>
  }
}
