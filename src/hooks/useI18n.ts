import { useContext } from 'preact/hooks'
import { I18nContext } from '../contexts/index'
import { getAppLanguage, sendErrorLog } from '../utils/index'

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useI18n = (lang = getAppLanguage()) => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const banana: any = useContext(I18nContext)

  const i18n = (lang: string, key: string, ...args) => {
    if (lang !== banana.locale) {
      banana.setLocale(lang)
    }

    return banana.i18n(key, ...args)
  }

  return (key, ...args) => {
    try {
      // Try it in the requested language
      return i18n(lang, key, ...args)
    } catch (e) {
      sendErrorLog(e)
    }
    try {
      if (lang !== 'en') {
        // If it failed and it was not English,
        // Try it in English
        return i18n('en', key, ...args)
      }
    } catch (e) {
      sendErrorLog(e)
    }
    // Give up, return the key
    return key
  }
}
