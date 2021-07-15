import {FunctionalComponent, h} from 'preact'
import { useI18n } from '../hooks/index'

export const OfflinePanel: FunctionalComponent = () => {
  const i18n = useI18n()
  return (
    <div class='offline-panel'>
      <div class='offline-content'>
        <img src='images/offline.svg' alt='offline' />
        <div class='message'>{i18n('offline-message')}</div>
      </div>
    </div>
  )
}
