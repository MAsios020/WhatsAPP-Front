import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
// import './assets/main.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Import FontAwesome from plugins file
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// Import the WhatsApp icon separately
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

// Import our configured fontawesome setup
import '@/plugins/fontawesome'

// Import component-specific styles
import './assets/styles/components/accounts-table.css'

// Add extra WhatsApp icon to library
library.add(faWhatsapp)

const app = createApp(App)

// Toast configuration
const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
  // Custom styling
  toastClassName: "custom-toast",
  bodyClassName: "custom-toast-body",
  containerClassName: "custom-toast-container"
}

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(Toast, toastOptions)
app.component('font-awesome-icon', FontAwesomeIcon)

// Preload CSS files
const preloadCSS = (href: string) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = resolve
    link.onerror = reject
    document.head.appendChild(link)
  })
}

// Preload all CSS files
Promise.all([
  preloadCSS('/src/assets/auth.css'),
  preloadCSS('/src/assets/styles/dashboard.css')
]).catch(console.error)

// Load correct CSS based on route
router.beforeEach(async (to, from, next) => {
  // Auth routes (login, register, etc.)
  const authRoutes = ['/login', '/register', '/']
  
  // Remove any previously loaded stylesheets
  const existingAuthStyle = document.getElementById('auth-style')
  const existingDashboardStyle = document.getElementById('dashboard-style')
  
  if (existingAuthStyle) {
    existingAuthStyle.remove()
  }
  
  if (existingDashboardStyle) {
    existingDashboardStyle.remove()
  }
  
  try {
    // Determine which CSS to load based on the route
    if (authRoutes.includes(to.path)) {
      // Load auth CSS for login, register, home
      await preloadCSS('/src/assets/auth.css')
    } else {
      // Load dashboard CSS for all other routes
      await preloadCSS('/src/assets/styles/dashboard.css')
    }
    next()
  } catch (error) {
    console.error('Error loading CSS:', error)
    next()
  }
})

// Handle search query from header
const handleSearch = (query: string) => {
  if (!query.trim()) return
  
  // Here you would implement actual search logic
  console.log('Searching for:', query)
  
  // Example implementation could be:
  if (router.currentRoute.value.name === 'accounts') {
    // Filter accounts by name or phone number
    const searchTerm = query.toLowerCase()
    // filteredAccounts.value = accounts.value.filter(account => 
    //   account.name.toLowerCase().includes(searchTerm) || 
    //   account.phoneNumber.includes(searchTerm)
    // )
  } else if (router.currentRoute.value.name === 'messages') {
    // Filter messages by content or recipient
  } else {
    // Global search across app
    router.push({ path: '/search', query: { q: query }})
  }
}

app.mount('#app') 