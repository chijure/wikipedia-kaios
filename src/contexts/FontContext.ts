import { createContext } from 'preact'

export interface FontContextModel {
  textSize: number;
  setTextSize?: (textSize: number) => void;
}

export const FontContext = createContext<FontContextModel>({ textSize: 2 })
