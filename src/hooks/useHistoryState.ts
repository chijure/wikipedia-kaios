import { useState } from 'preact/hooks'

export const useHistoryState = (key: string, initialValue = null): [string, ((value: string) => void)] => {
  const [current, setCurrent] = useState(() => {
    return (window.history.state && window.history.state[key])
      ? window.history.state[key]
      : initialValue
  })
  const setCurrentWrapper = (value: string) => {
    setCurrent(value)
    const state = window.history.state || {}
    state[key] = value
    window.history.replaceState(state, '', null)
  }
  return [current, setCurrentWrapper]
}
