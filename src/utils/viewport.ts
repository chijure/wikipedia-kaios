export interface viewportInterface {
  width: number;
  height: number;
}

export const viewport = (): viewportInterface => {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}
