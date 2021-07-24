import { FunctionalComponent, h } from 'preact'
import { Loading } from './index'
import { useI18n } from '../hooks/index'

export const SearchLoading: FunctionalComponent = () => {
  const i18n = useI18n()
  const message = i18n('search-loading-message')

  return <Loading message={message} />
}
