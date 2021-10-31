import { FunctionalComponent, h } from 'preact'
import { useRef } from 'preact/hooks'
import { memo } from 'preact/compat'
import { useI18n, useSoftkey, useScroll } from '../hooks/index'
import { grantConsent, goto } from '../utils/index'

interface ConsentProps {
  close: () => void;
}

export const Consent: FunctionalComponent<ConsentProps> = memo(({ close }: ConsentProps) => {
  const i18n = useI18n()
  const bodyRef = useRef<HTMLDivElement>(undefined)
  const [scrollDown, scrollUp] = useScroll(bodyRef, 10, 'y')

  const onAgree = () => {
    grantConsent()
    close()
  }

  useSoftkey('ConsentMessage', {
    center: i18n('consent-softkeys-agree'),
    onKeyCenter: onAgree,
    left: i18n('consent-softkeys-terms'),
    onKeyLeft: goto.termsOfUse,
    right: i18n('consent-softkeys-policy'),
    onKeyRight: goto.privacyPolicy,
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp,
    onKeyBackspace: () => { window.close() }
  })

  return (
    <div className='consent'>
      <div className='header'>{i18n('consent-privacy-terms')}</div>
      <div className='body' ref={bodyRef}>
        <div className='messages' dir='auto'>
          <div className='message'>{i18n('consent-message-policy')}</div>
          <div className='message'>{i18n('consent-message-and')}</div>
          <div className='message'>{i18n('consent-message-terms')}</div>
        </div>
      </div>
    </div>
  )
})
