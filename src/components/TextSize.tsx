import { FunctionalComponent, h } from 'preact'
import { useState, useContext } from 'preact/hooks'
import { useI18n, useSoftkey } from '../hooks'
import { articleTextSize } from '../utils'
import { FontContext, DirectionContext, FontContextModel, DirectionContextModel } from '../contexts'

interface TextSizeProps {
  close: () => void;
  closeAll: () => void;
}

export const TextSize: FunctionalComponent<TextSizeProps> = ({
  close,
  closeAll
}: TextSizeProps) => {
  const i18n = useI18n()
  const { dirState } = useContext<DirectionContextModel>(DirectionContext)
  const {
    textSize,
    setTextSize
  } = useContext<FontContextModel>(FontContext)
  const [localTextSize] = useState(textSize)
  const {
    MAX_SIZE,
    MIN_SIZE
  } = articleTextSize
  const sliderPortion = 100 / (MAX_SIZE)
  const sliderValue = Array.from({ length: MAX_SIZE + 1 }, (v, i) => i * sliderPortion)

  const adjust = (step: number) => {
    const newSize = textSize + step
    if (newSize >= MIN_SIZE && newSize <= MAX_SIZE) {
      setTextSize(newSize)
    }
  }

  const onKeyCenter = () => {
    articleTextSize.set(textSize.toString())
    closeAll()
  }

  const onDiscard = () => {
    articleTextSize.set(localTextSize.toString())
    setTextSize(localTextSize)
    close()
  }

  useSoftkey('TextSize', {
    center: i18n('softkey-ok'),
    left: i18n('softkey-cancel'),
    onKeyCenter,
    onKeyLeft: onDiscard,
    onKeyBackspace: onDiscard,
    onKeyArrowLeft: () => {
      adjust(-1)
    },
    onKeyArrowRight: () => {
      adjust(1)
    }
  }, [textSize])

  return <div className='textsize'>
    <div className='header'>{i18n('header-textsize')}</div>
    <div className='content'>
      <bdi className={`textsize-preview font-size-${textSize + 1}`}>
        {i18n('textsize-preview')}
      </bdi>
      <div className='slider-container'>
        <div className='slider'>
          <div className='filling' style={`width: ${sliderValue[textSize]}%`} />
          <div className='circle' style={`${dirState === 'ltr' ? 'left' : 'right'}: ${sliderValue[textSize]}%`} />
        </div>
      </div>
      <div className='labels'>
        <p>{i18n('textsize-label-small')}</p>
        <p>{i18n('textsize-label-large')}</p>
      </div>
    </div>
  </div>
}
