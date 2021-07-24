const KEY = 'has-onboard-before'

const isDone = (): boolean => {
  return !!localStorage.getItem(KEY)
}

const markAsDone = (): void => {
  localStorage.setItem(KEY, String(true))
}

export const onboarding = { isDone, markAsDone }
