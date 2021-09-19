import { createContext } from 'preact'
import { StateUpdater } from 'preact/hooks'

export interface DirectionContextModel {
  dirState: string;
  setDirState?: (StateUpdater<'rtl' | 'ltr'>)
}

export const DirectionContext = createContext<DirectionContextModel>({ dirState: 'rtl' })
