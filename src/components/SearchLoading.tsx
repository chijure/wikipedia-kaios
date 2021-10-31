import { FunctionalComponent, h } from 'preact'
import { memo } from 'preact/compat'
import { Loading } from './index'
import { useI18n } from '../hooks/index'

export const SearchLoading: FunctionalComponent = memo(() => {
  const i18n = useI18n()
  const message = i18n('search-loading-message')

  return <Loading message={message} />
})
