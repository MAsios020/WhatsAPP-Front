import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './assets/main.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faPhone, 
  faEye, 
  faEyeSlash,
  faPaperPlane,
  faClock,
  faChartBar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons'

import { faGoogle, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

/* add icons to the library */
library.add(
  faUser, 
  faEnvelope, 
  faLock, 
  faPhone, 
  faEye, 
  faEyeSlash,
  faPaperPlane,
  faClock,
  faChartBar,
  faArrowRight,
  faGoogle,
  faFacebook,
  faWhatsapp
)

const app = createApp(App)

// Function to update document direction and toast settings
const updateDirection = (locale: string) => {
  const isRTL = locale === 'ar'
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
  document.documentElement.lang = locale
}

// Initial direction setup
updateDirection(i18n.global.locale.value)

// Toast configuration
const toastOptions = {
  // Position
  position: i18n.global.locale.value === 'ar' ? 'top-left' : 'top-right',
  // Timeout
  timeout: 4000,
  // Close button
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  // Draggable
  draggable: true,
  draggablePercent: 0.6,
  // Close button
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  // Icons
  icon: true,
  // Animation
  transition: "Vue-Toastification__bounce",
  // Multiple toasts
  maxToasts: 5,
  newestOnTop: true,
  // RTL support
  rtl: i18n.global.locale.value === 'ar'
}

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast, toastOptions)
app.component('font-awesome-icon', FontAwesomeIcon)

// Watch for language changes
watch(
  () => i18n.global.locale.value,
  (newLocale) => {
    updateDirection(newLocale)
    // Update toast options
    const toast = app.config.globalProperties.$toast
    if (toast) {
      toast.options.rtl = newLocale === 'ar'
      toast.options.position = newLocale === 'ar' ? 'top-left' : 'top-right'
    }
  }
)

app.mount('#app') 