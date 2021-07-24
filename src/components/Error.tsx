import { FunctionalComponent, h } from 'preact'
import { useSoftkey, useI18n } from '../hooks/index'
import { goto } from '../utils/goto'

interface ErrorProps {
  message: string;
  onRefresh: any;
}

export const Error: FunctionalComponent<ErrorProps> = ({ message, onRefresh }: ErrorProps) => {
  const i18n = useI18n()

  useSoftkey('Error', {
    center: i18n('softkey-refresh'),
    onKeyCenter: onRefresh,
    left: i18n('softkey-close'),
    onKeyLeft: () => goto.back()
  })

  return (
    <div className='error'>
      <img src='images/article-error.png' alt='article-error' />
      <p className='message'>{message}</p>
    </div>
  )
}
