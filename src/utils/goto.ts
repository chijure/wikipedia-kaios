import { route } from 'preact-router'
import { canonicalizeTitle, getAppLanguage, openExternal } from './index'

const article = (lang: string, title: string | string[], replace = false): void => {
  if (!Array.isArray(title)) {
    title = [title]
  }
  const titleStr = title.map((t: string) => encodeURIComponent(canonicalizeTitle(t))).join('/')
  route(`/article/${lang}/${titleStr}`, replace)
}

const search = (): boolean => route('/')

const settings = (): boolean => route('/settings')

const tips = (): boolean => route('/tips')

const termsOfUse = (): void => {
  const lang = getAppLanguage()
  openExternal(`https://foundation.m.wikimedia.org/wiki/Terms_of_Use/${lang}`)
}

const privacyPolicy = (): void => {
  openExternal('https://foundation.m.wikimedia.org/wiki/Privacy_policy')
}

const back = (): void => window.history.back()

export const goto = {
  article,
  search,
  termsOfUse,
  privacyPolicy,
  back,
  settings,
  tips
}
