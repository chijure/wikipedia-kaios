import 'preact/debug'
import { createElement, render } from 'preact'
import 'intl-pluralrules'
import Banana from 'banana-i18n'
import {
  setAppLanguage, getAppLanguage, setDeviceLanguage, getDeviceLanguage,
  checkHasDeviceLanguageChanged, loadAllLanguagesMessages, consentMessages,
  getDirection
} from './utils'

import '../style/style.less'
import App, { AppProps } from './components/App'

if (checkHasDeviceLanguageChanged()) {
  setDeviceLanguage()
  setAppLanguage(getDeviceLanguage())
}
const lang = getAppLanguage()
const banana = new Banana(lang)
const dir = getDirection(lang)
banana.load(loadAllLanguagesMessages())
banana.load(consentMessages)

const props: AppProps = { dir: dir, i18n: banana }

render(createElement(App, props), document.querySelector('.root'))
