import { FunctionalComponent, h } from 'preact'
import { useI18n, useSoftkey } from '../hooks/index'

interface ConfirmDialogProps {
  title: string;
  message: string;
  dir: 'ltr' | 'rtl';
  onSubmitText: string;
  onSubmit: () => void;
  onDiscardText: string;
  onDiscard: () => void;
  close: () => void;
  closeAll: () => void;
}

export const ConfirmDialog: FunctionalComponent<ConfirmDialogProps> = ({
  title, message, dir,
  onSubmitText, onSubmit, onDiscardText, onDiscard,
  close, closeAll
}: ConfirmDialogProps) => {
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
