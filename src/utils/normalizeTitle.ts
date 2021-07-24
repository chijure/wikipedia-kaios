export const normalizeTitle = (title: string) : string => {
  return title.split('_').join(' ')
}
