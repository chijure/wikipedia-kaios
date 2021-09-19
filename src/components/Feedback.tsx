import { FunctionalComponent, h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useI18n, useSoftkey, useNavigation, usePopup, useOnlineStatus } from '../hooks/index'
import { sendFeedback, confirmDialog } from '../utils/index'
import { OfflinePanel } from './index'

interface FeedbackProps {
  close: () => void;
}

export const Feedback: FunctionalComponent<FeedbackProps> = ({ close }: FeedbackProps) => {
  const containerRef = useRef<HTMLDivElement>(undefined)
  const i18n = useI18n()
  const [message, setMessage] = useState(undefined)
  const [showSuccessConfirmation] = usePopup(SuccessConfirmationPopup, { stack: true })
  const [current, setNavigation, getCurrent] = useNavigation('Feedback', containerRef, containerRef, 'y')
  const isOnline = useOnlineStatus(undefined)

  const items = [
    {
      text: `<a data-selectable>${i18n('feedback-privacy-policy')}</a>`,
      link: 'https://foundation.m.wikimedia.org/wiki/Privacy_policy'
    },
    {
      text: `<a data-selectable>${i18n('feedback-terms-of-use')}</a>`,
      link: 'https://foundation.m.wikimedia.org/wiki/Terms_of_Use/en'
    }
  ]
  const hyperlinks = items.map(i => i.text)

  const onKeyRight = () => {
    const userMessage = message.trim()
    if (isOnline && userMessage) {
      sendFeedback(userMessage)
      if (getCurrent().type === 'TEXTAREA') {
        blurTextarea()
      }

      showSuccessConfirmation({})
    }
  }

  const showCancelConfirmation = () => {
    confirmDialog({
      title: i18n('feedback-cancel-header'),
      message: i18n('feedback-cancel'),
      onDiscardText: i18n('softkey-no'),
      onSubmitText: i18n('softkey-yes')
    })
  }

  const onKeyBackspaceHandler = () => {
    if (message) {
      showCancelConfirmation()
    } else {
      close()
    }
  }

  const onKeyCenter = () => {
    const { index } = getCurrent()
    if (index > 0) {
      const item = items[index - 1]
      window.open(item.link)
    }
  }

  const onKeyLeft = () => {
    if (message) {
      if (isOnline && getCurrent().type === 'TEXTAREA') {
        blurTextarea()
      }
      showCancelConfirmation()
    } else {
      close()
    }
  }

  const onKeyArrowRightHandler = () => {
    const { index } = getCurrent()
    if (items[index]) {
      setNavigation(index + 1)
    } else {
      setNavigation(1)
    }
  }

  const onKeyArrowLeftHandler = () => {
    const { index } = getCurrent()
    if (items[index - 2]) {
      setNavigation(index - 1)
    } else {
      setNavigation(items.length)
    }
  }

  const getTextareaElement = () => containerRef.current.querySelector('textarea')

  const blurTextarea = () => {
    const element = getTextareaElement()
    element.blur()
  }

  useSoftkey('Feedback', {
    right: isOnline && message && message.trim() ? i18n('softkey-send') : '',
    onKeyRight,
    left: i18n('softkey-cancel'),
    onKeyLeft,
    onKeyBackspace: !(message && current.type === 'TEXTAREA') && (() => onKeyBackspaceHandler()),
    onKeyCenter,
    onKeyArrowRight: !(current.type === 'TEXTAREA') && (() => onKeyArrowRightHandler()),
    onKeyArrowLeft: !(current.type === 'TEXTAREA') && (() => onKeyArrowLeftHandler())
  }, [message, isOnline, current])

  useEffect(() => {
    setNavigation(0)
  }, [isOnline])

  return (
    <div className='feedback' ref={containerRef}>
      <div className='header'>
        {i18n('feedback-header')}
      </div>
      <div className='body'>
        {isOnline
          ? <div>
            <div className='textarea-box'>
              <form>
                <textarea value={message} placeholder={i18n('feedback-placeholder')}
                  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                  onChange={(e: any) => setMessage(e.target.value)} data-selectable='true' />
              </form>
            </div>
            <div className='explanation-box'>
              <p dangerouslySetInnerHTML={{ __html: i18n('feedback-explanation', ...hyperlinks) }} />
            </div>
          </div>
          : <OfflinePanel />
        }
      </div>
    </div>
  )
}

interface SuccessConfirmationPopupProps {
  closeAll: () => void;
}

const SuccessConfirmationPopup: FunctionalComponent<SuccessConfirmationPopupProps> = ({ closeAll }: SuccessConfirmationPopupProps) => {
  const i18n = useI18n()

  useSoftkey('FeedbackSuccessMessage', {
    center: i18n('softkey-ok'),
    onKeyCenter: closeAll,
    onKeyBackspace: closeAll
  }, [])

  return (
    <div className='confirmation-popup'>
      <div className='header'>{i18n('feedback-success-header')}</div>
      <p className='preview-text'>{i18n('feedback-success')}</p>
    </div>
  )
}
