import { FunctionalComponent, h } from 'preact'
import { memo } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'

interface SoftkeyButtonProps {
  className: string;
  text: string;
  handler: () => void;
}

const SoftkeyButton = memo(({ className, text, handler }: SoftkeyButtonProps) => {
  return <label className={className} onClick={handler}>{text}</label>
})

interface SoftkeyProps {
  left: string;
  center: string;
  right: string;
  onKeyLeft: () => void;
  onKeyCenter: () => void;
  onKeyRight: () => void;
  onKeyArrowDown: () => void;
  onKeyArrowUp: () => void;
  onKeyArrowLeft: () => void;
  onKeyArrowRight: () => void;
  onKeyBackspace: () => void;
  // direction related prop
  dir: 'ltr' | 'rtl';
  onKeyFixedArrowLeft: () => void;
  onKeyFixedArrowRight: () => void;
}

export const Softkey: FunctionalComponent<SoftkeyProps> = ({
  left,
  center,
  right,
  onKeyLeft,
  onKeyCenter,
  onKeyRight,
  onKeyArrowDown,
  onKeyArrowUp,
  onKeyArrowLeft,
  onKeyArrowRight,
  onKeyBackspace,
  dir = 'ltr',
  onKeyFixedArrowLeft,
  onKeyFixedArrowRight
}: SoftkeyProps) => {
  const handlersRef = useRef()

  if (dir === 'rtl') {
    [left, right] = [right, left];
    [onKeyLeft, onKeyRight] = [onKeyRight, onKeyLeft];
    [onKeyArrowLeft, onKeyArrowRight] = [onKeyArrowRight, onKeyArrowLeft]
  }

  handlersRef.current = {
    SoftLeft: onKeyLeft,
    Enter: onKeyCenter,
    SoftRight: onKeyRight,
    ArrowDown: onKeyArrowDown,
    ArrowUp: onKeyArrowUp,
    ArrowLeft: onKeyFixedArrowLeft || onKeyArrowLeft,
    ArrowRight: onKeyFixedArrowRight || onKeyArrowRight,
    Backspace: onKeyBackspace
  }
  const onKeyDown = (e) => {
    const key = e.key.toString()
    if (handlersRef.current[key]) {
      handlersRef.current[key](e)
      e.stopPropagation()
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className='softkey'>
      <SoftkeyButton key='left' className='left' text={left} handler={onKeyLeft} />
      <SoftkeyButton key='center' className='center' text={center} handler={onKeyCenter} />
      <SoftkeyButton key='right' className='right' text={right} handler={onKeyRight} />
    </div>
  )
}
