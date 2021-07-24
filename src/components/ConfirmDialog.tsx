import { FunctionalComponent, h } from 'preact'
import { useI18n, useSoftkey } from '../hooks/index'

export const ConfirmDialog: FunctionalComponent = ({
  title, message, dir,
  onSubmitText, onSubmit, onDiscardText, onDiscard,
  close, closeAll
}: any) => {
  const i18n = useI18n()

  const onDiscardFn = () => {
    onDiscard()
    close()
  }

  useSoftkey('ConfirmDialog', {
    left: onDiscardText || i18n('softkey-close'),
    onKeyLeft: onDiscardFn,
    onKeyBackspace: onDiscardFn,
    right: onSubmitText || i18n('softkey-ok'),
    onKeyRight: () => { onSubmit(); closeAll() }
  }, [])

  return (
    <div className='confirm-dialog' dir={dir}>
      { title && <div className='header'>{title}</div> }
      <div className='info'>{message}</div>
    </div>
  )
}
