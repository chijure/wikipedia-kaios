export const skipIntroAnchor = 'wpSkipIntro'

export const isAnchorIntroSkip = (anchor: string): boolean => {
  return anchor === skipIntroAnchor
}
