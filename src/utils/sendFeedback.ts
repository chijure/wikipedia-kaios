import { appVersion, sendEvent, getDeviceLanguage } from '../utils/index'

export const sendFeedback = (feedback: unknown): void => {
  sendEvent(
    '/analytics/legacy/kaiosappfeedback/1.0.0',
    'eventlogging_KaiOSAppFeedback',
    'KaiOSAppFeedback',
    getDeviceLanguage(),
    {
      version: appVersion(),
      feedback
    }
  )
}
