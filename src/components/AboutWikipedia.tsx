import { FunctionalComponent, h } from 'preact'
import { useSoftkey, useI18n, useRange } from '../hooks/index'

interface AboutWikipediaProps {
  close: () => void;
}

export const AboutWikipedia: FunctionalComponent<AboutWikipediaProps> = ({ close }: AboutWikipediaProps) => {
  const i18n = useI18n()
  const [currentIndex, prevOnboard, nextOnboard] = useRange(0, 3)

  const getImageBackgroundStyle = (index: number) => {
    // only the first onboard image doesn't have background image
    return index ? { backgroundImage: `url(images/onboarding-${index}-background.png)` } : {}
  }

  const softkeyConfig = [
    {
      left: i18n('softkey-close'),
      onKeyLeft: close,
      right: i18n('softkey-next'),
      onKeyRight: nextOnboard,
      onKeyArrowRight: nextOnboard,
      onKeyBackspace: close
    },
    {
      left: i18n('softkey-back'),
      onKeyLeft: prevOnboard,
      onKeyArrowLeft: prevOnboard,
      right: i18n('softkey-next'),
      onKeyRight: nextOnboard,
      onKeyArrowRight: nextOnboard,
      onKeyBackspace: prevOnboard
    },
    {
      left: i18n('softkey-back'),
      onKeyLeft: prevOnboard,
      onKeyArrowLeft: prevOnboard,
      center: i18n('softkey-close'),
      onKeyCenter: close,
      onKeyBackspace: prevOnboard
    }
  ]
  useSoftkey('AboutWikipedia', softkeyConfig[currentIndex], [currentIndex], true)

  return (
    <div className='about-wikipedia'>
      <div className='header'>{i18n('about-wikipedia-header')}</div>
      <div className='body'>
        <div className='image' style={getImageBackgroundStyle(currentIndex)}>
          <img src={`images/onboarding-${currentIndex}.png`} alt={`OnBoarding-${currentIndex}`} />
        </div>
        <div className='title'>
          {i18n(`onboarding-${currentIndex}-title`)}
        </div>
        <div className='description'>
          {i18n(`onboarding-${currentIndex}-description`)}
        </div>
      </div>
    </div>
  )
}
