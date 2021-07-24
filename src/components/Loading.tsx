import { FunctionalComponent, h } from 'preact'

interface LoadingProps {
  message: string;
  onClose?: () => void
}

export const Loading: FunctionalComponent<LoadingProps> = ({ message }: LoadingProps) => {
  return (
    <div className='loading-planet'>
      <img className='moon' src='images/loading-moon.svg' alt='loading-moon' />
      <img className='earth' src='images/loading-earth.svg' alt='loading-earth' />
      <img className='galaxy' src='images/loading-galaxy.svg' alt='loading-galaxy' />
      <p className='message'>{message}</p>
    </div>
  )
}
