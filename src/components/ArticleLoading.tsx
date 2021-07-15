import {FunctionalComponent, h} from 'preact'
import { Loading } from './index'
import { useSoftkey, useI18n } from '../hooks/index'
import { goto } from '../utils/goto'

interface ArticleLoadingProps {
  onClose?: () => void;
}

export const ArticleLoading: FunctionalComponent<ArticleLoadingProps> = ({ onClose }: ArticleLoadingProps) => {
  const i18n = useI18n()
  const message = i18n('article-loading-message')

  useSoftkey('Loading', {
    left: i18n('softkey-close'),
    onKeyLeft: () => {
      if (onClose) {
        onClose()
      } else {
        goto.back()
      }
    },
    onKeyBackspace: () => {
      if (onClose) {
        onClose()
      } else {
        goto.back()
      }
    }
  }, [])

  return <Loading message={message} />
}
