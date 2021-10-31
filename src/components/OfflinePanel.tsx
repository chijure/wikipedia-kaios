import { FunctionalComponent, h } from 'preact'
import { memo } from 'preact/compat'
import { useI18n } from '../hooks/index'

export const OfflinePanel: FunctionalComponent = memo(() => {
  const i18n = useI18n()
  return (
    <div className='offline-panel'>
      <div className='offline-content'>
        <img src='images/offline.svg' alt='offline' />
        <div className='message'>{i18n('offline-message')}</div>
      </div>
    </div>
  )
})
