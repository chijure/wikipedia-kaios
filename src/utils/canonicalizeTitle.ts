export const canonicalizeTitle = (title: string): string => {
  return title.split(' ').join('_')
}
