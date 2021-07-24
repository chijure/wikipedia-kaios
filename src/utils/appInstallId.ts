import { generateRandomId } from './index'

const APP_INSTALL_ID_KEY = 'app-install-id'

export const appInstallId = (): string => {
  let id = localStorage.getItem(APP_INSTALL_ID_KEY)
  if (!id) {
    id = generateRandomId()
    localStorage.setItem(APP_INSTALL_ID_KEY, String(id))
  }
  return id
}
