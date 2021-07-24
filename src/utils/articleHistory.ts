import { normalizeTitle } from './index'

export interface ArticleHistory {
  lang: string;
  title: string;
}

const MAX = 100
const list: ArticleHistory[] = []

const add = (lang: string, title: string): void => {
  const normalizedTitle = normalizeTitle(title)
  list.push({
    lang,
    title: normalizedTitle
  })
  if (list.length > MAX) {
    list.shift()
  }
}

const prev = (): ArticleHistory => {
  if (isEmpty()) {
    return
  }

  // remove the current article
  list.pop()

  // return the previous article
  return list.pop()
}

const clear = (): void => {
  list.length = 0
}

const isEmpty = (): boolean => {
  return list.length === 0
}

const hasPrev = (): boolean => {
  return list.length > 1
}

const getPrev = (): ArticleHistory => {
  return list[list.length - 2]
}

export const articleHistory = {
  add,
  prev,
  clear,
  isEmpty,
  hasPrev,
  getPrev
}
