import {FunctionalComponent, h} from 'preact'
import { useSoftkey, useI18n } from 'hooks'
import { goto } from 'utils'

export const Error: FunctionalComponent = ({ message, onRefresh }: any) => {
  const i18n = useI18n()

  useSoftkey('Error', {
    center: i18n('softkey-refresh'),
    onKeyCenter: onRefresh,
    left: i18n('softkey-close'),
    onKeyLeft: () => goto.back()
  })

  return (
    <div class='error'>
      <img src='images/article-error.png' alt='article-error' />
      <p class='message'>{message}</p>
    </div>
  )
}
