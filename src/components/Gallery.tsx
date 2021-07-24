import { FunctionalComponent, h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useI18n, useSoftkey, usePopup, useRange, useArticleMediaInfo } from '../hooks/index'

const MAX_DESCRIPTION_HEIGHT = 45

const AboutContainer: FunctionalComponent = ({ lang, dir, title, caption, fromCommon, close }: any) => {
  const i18n = useI18n()
  const containerRef = useRef<HTMLDivElement>(undefined)
  const mediaInfo = useArticleMediaInfo(lang, title, fromCommon)

  useSoftkey('About', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close,
    right: mediaInfo && mediaInfo.filePage ? i18n('softkey-more-info') : '',
    onKeyRight: () => {
      if (mediaInfo && mediaInfo.filePage) {
        window.open(mediaInfo.filePage)
      }
    }
  }, [mediaInfo])

  if (!mediaInfo) {
    return <LoadingAbout />
  }

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return
    }

    const descriptionNode = containerRef.current.querySelector('.description')

    if (descriptionNode && descriptionNode.getBoundingClientRect().height > MAX_DESCRIPTION_HEIGHT) {
      descriptionNode.classList.add('clamp')
    }
  })

  return (
    <div className='gallery-about' ref={containerRef}>
      <div className='header'>{i18n('about-header')}</div>
      <div>
        <div className='sub-header'>{i18n('gallery-description')}</div>
        <p className='description' dir={dir}>
          <bdi>{mediaInfo.description || caption || title}</bdi>
        </p>
      </div>
      <div>
        <div className='sub-header'>{i18n('gallery-author-license')}</div>
        <p dir={dir}>
          <bdi>
            {mediaInfo.author || i18n('gallery-unknown-author')}<br />
            {mediaInfo.license || i18n('gallery-unknown-license')}
          </bdi>
        </p>
      </div>
    </div>
  )
}

const LoadingAbout: FunctionalComponent = () => {
  const i18n = useI18n()
  return (
    <div className='gallery-about loading'>
      <div className='header'>{i18n('about-header')}</div>
      <div>
        <div className='sub-header'>{i18n('gallery-description')}</div>
        <p>
          <div className='loading-block full' />
        </p>
      </div>
      <div>
        <div className='sub-header'>{i18n('gallery-author-license')}</div>
        <p>
          <div className='loading-block full' />
          <div className='loading-block full last' />
        </p>
      </div>
    </div>
  )
}

export const Gallery: FunctionalComponent = ({ close, closeAll, items, startFileName, lang, dir }: any) => {
  const i18n = useI18n()
  const containerRef = useRef<HTMLDivElement>(undefined)
  const [
    currentIndex, onPrevImage, onNextImage
  ] = useRange(getInitialIndex(items, startFileName), items.length - 1)
  const [showAboutPopup] = usePopup(AboutContainer, { stack: true })

  const onImageLoad = ({ target: img }) => {
    const galleryNode = containerRef.current
    const galleryClasses = ['portrait', 'landscape']

    galleryClasses.forEach(galleryClass => {
      galleryNode.classList.remove(galleryClass)
    })

    const orientationClass = img.height >= img.width ? 'portrait' : 'landscape'
    galleryNode.classList.add(orientationClass)
  }

  useSoftkey('Gallery', {
    left: i18n('softkey-close'),
    onKeyLeft: closeAll,
    center: i18n('softkey-about'),
    onKeyCenter: () => showAboutPopup({ ...items[currentIndex], lang, dir }),
    [dir === 'rtl' ? 'onKeyFixedArrowLeft' : 'onKeyFixedArrowRight']: onNextImage,
    [dir === 'rtl' ? 'onKeyFixedArrowRight' : 'onKeyFixedArrowLeft']: onPrevImage,
    onKeyBackspace: close
  }, [currentIndex])

  return (
    <div className='gallery-view' ref={containerRef}>
      {
        currentIndex !== 0 && (
          <img src='images/arrow.svg' alt='arrow' className={`arrow ${dir === 'rtl' ? 'right' : 'left'}`} />
        )
      }
      {
        currentIndex < items.length - 1 && (
          <img src='images/arrow.svg' alt='arrow' className={`arrow ${dir === 'rtl' ? 'left' : 'right'}`} />
        )
      }
      <div className='img'>
        <img onLoad={onImageLoad} src={items[currentIndex].thumbnail} />
      </div>
    </div>
  )
}

const getInitialIndex = (items, fileName) => {
  if (fileName) {
    const index = items.findIndex(media => media.canonicalizedTitle === fileName)
    return index >= 0 ? index : 0
  }
  return 0
}
