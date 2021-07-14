const USER_COUNTRY_STORAGE_KEY = 'user-country'

export const setUserCountry = (country: string): void => {
  localStorage.setItem(USER_COUNTRY_STORAGE_KEY, country)
}

export const getUserCountry = () => localStorage.getItem(USER_COUNTRY_STORAGE_KEY)
