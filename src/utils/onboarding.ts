const KEY = 'has-onboard-before'

const isDone = () => {
  return !!localStorage.getItem(KEY)
}

const markAsDone = () => {
  localStorage.setItem(KEY, String(true))
}

export const onboarding = { isDone, markAsDone }
