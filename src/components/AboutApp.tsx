import { FunctionalComponent, h } from 'preact'
import { useI18n, useSoftkey } from '../hooks/index'
import { appVersion, appInstallId } from '../utils/index'

interface AboutAppProps {
  close?: () => void;
}

export const AboutApp: FunctionalComponent<AboutAppProps> = ({ close }: AboutAppProps) => {
  const i18n = useI18n()

  useSoftkey('AboutApp', {
    right: i18n('softkey-read-more'),
    onKeyRight: () => window.open('https://wikimediafoundation.org/'),
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close
  }, [])

  return (
    <div className='aboutapp'>
      <div className='header'>{i18n('about-header')}</div>
      <div className='body'>
        <div className='image'>
          <img src='images/onboarding-0.png' alt='onBoarding' />
        </div>
        <div className='image'>
          <img src='images/wikipedia-wordmark-en.png' alt='wikipedia-wordmark' />
        </div>
        <div className='version'>
          <p>{appVersion()} ({appInstallId()})</p>
        </div>
        <div className='message'>
          <p>{i18n('about-app-message')}</p>
        </div>
      </div>
    </div>
  )
}
