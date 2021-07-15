// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const gitHash = () => {
  /* eslint-disable-next-line no-undef,@typescript-eslint/ban-ts-comment */
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return CIRCLE_SHA1
}
