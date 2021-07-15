import {FunctionalComponent, h} from 'preact'
import { useSoftkey, useI18n } from '../hooks/index'
import { onboarding, goto } from '../utils/index'

export const Onboarding: FunctionalComponent = () => {
  const i18n = useI18n()

  const exitOnboard = () => {
    onboarding.markAsDone()
    goto.search()
  }

  useSoftkey('Onboarding', {
    center: i18n('softkey-get-started'),
    onKeyCenter: exitOnboard
  })

  return (
    <div class='onboarding'>
      <div class='image'>
        <img src='images/onboarding-0.png' alt="OnBoarding" />
      </div>
      <div class='title'>
        {i18n('onboarding-0-title')}
      </div>
      <div class='description'>
        {i18n('onboarding-0-description')}
      </div>
    </div>
  )
}
