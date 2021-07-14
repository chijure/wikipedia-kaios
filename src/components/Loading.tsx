import {FunctionalComponent, h} from 'preact'

interface LoadingProps {
  message: string;
}

export const Loading: FunctionalComponent<LoadingProps> = ({ message }: LoadingProps) => {
  return (
    <div class='loading-planet'>
      <img class='moon' src='images/loading-moon.svg' alt='loading-moon' />
      <img class='earth' src='images/loading-earth.svg' alt='loading-earth' />
      <img class='galaxy' src='images/loading-galaxy.svg' alt='loading-galaxy' />
      <p class='message'>{message}</p>
    </div>
  )
}
