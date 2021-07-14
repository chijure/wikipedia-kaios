
export const canonicalizeTitle = (title: string) => {
  return title.split(' ').join('_')
}
