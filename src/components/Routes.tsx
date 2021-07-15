import {FunctionalComponent, h} from 'preact'
import { Router, route } from 'preact-router'
import { createHashHistory } from 'history'
import { Article, Search, Settings, Tips, Language, Onboarding } from './index'
import { onboarding } from '../utils/index'

interface RoutesProps {
  onRouteChange: (url: string) => void;
}

export const Routes: FunctionalComponent<RoutesProps> = ({ onRouteChange }: RoutesProps) => {
  const onChange = ({ url }: any) => {
    if (!onboarding.isDone()) {
      route('/onboarding')
    }
    onRouteChange(url)
  }
  return (
    <Router history={createHashHistory()} onChange={onChange}>
      <Onboarding path='/onboarding' />
      <Search path='/' />
      <Settings path='/settings' />
      <Tips path='/tips' />
      <Article path='/article/:lang/:title/:anchor?' />
      <Language path='/language' />
    </Router>
  )
}
