import { appVersion, gitHash, isProd } from './index'

const intakeUrl = 'https://intake-logging.wikimedia.org/v1/events' + (isProd() ? '?hasty=true' : '')

interface SendErrorLogProps {
  message: string;
  stack?: string;
  url?: string;
}

export const sendErrorLog = ({ message, stack = '', url = '' }: SendErrorLogProps): boolean =>
  navigator.sendBeacon(intakeUrl, JSON.stringify({
    $schema: '/mediawiki/client/error/1.0.0',
    meta: {
      stream: 'kaios_app.error'
    },
    stack_trace: stack,
    message: message,
    url,
    tags: { app_version: appVersion(), git_hash: gitHash() }
  })
  )
