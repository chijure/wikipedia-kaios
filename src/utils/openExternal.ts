export const openExternal = (url: string): void => {
  if (window.MozActivity) {
    // eslint-disable-next-line no-new
    new window.MozActivity({
      name: 'view',
      data: {
        type: 'url',
        url
      }
    })
  } else {
    window.open(url)
  }
}
