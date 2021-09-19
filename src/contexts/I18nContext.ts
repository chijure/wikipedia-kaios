import { createContext } from 'preact'

export interface I18nContextModel {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  i18n?: any;
}

export const I18nContext = createContext<I18nContextModel>({})
