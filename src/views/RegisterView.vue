<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style="background-image: url('/src/assets/hero-bg.jpg')">
    <div class="w-full max-w-4xl relative z-10 scale-90">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
        <!-- Left Side - Form -->
        <div class="bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-lg p-8 rounded-l-3xl rtl:rounded-l-none rtl:rounded-r-3xl shadow-2xl">
          <div class="text-center mb-8">
            <div class="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <font-awesome-icon :icon="['fab', 'whatsapp']" class="w-16 h-16 text-[#25D366]" />
            </div>
            <h1 class="text-4xl font-bold text-[#1e293b] dark:text-white mb-2">
              {{ $t('auth.registerTitle') }}
            </h1>
            <p class="text-base text-gray-600 dark:text-gray-300">{{ $t('auth.registerSubtitle') }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="form-group">
              <div class="relative">
                <input
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  :class="{ 'border-red-500': errors.name }"
                  :placeholder="$t('common.name')"
                />
                <div class="input-icon">
                  <font-awesome-icon icon="user" />
                </div>
              </div>
              <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
            </div>

            <div class="form-group">
              <div class="relative">
                <input
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  :class="{ 'border-red-500': errors.email }"
                  :placeholder="$t('common.email')"
                />
                <div class="input-icon">
                  <font-awesome-icon icon="envelope" />
                </div>
              </div>
              <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
            </div>

            <div class="form-group">
              <div class="relative">
                <input
                  v-model="formData.phone"
                  type="tel"
                  class="form-input"
                  :class="{ 'border-red-500': errors.phone }"
                  :placeholder="$t('common.phone')"
                />
                <div class="input-icon">
                  <font-awesome-icon icon="phone" />
                </div>
              </div>
              <p v-if="errors.phone" class="error-message">{{ errors.phone }}</p>
            </div>

            <div class="form-group">
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'border-red-500': errors.password }"
                  :placeholder="$t('common.password')"
                />
                <div class="input-icon">
                  <font-awesome-icon icon="lock" />
                </div>
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  @click="togglePasswordVisibility"
                >
                  <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
                </button>
              </div>
              <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
            </div>

            <div class="form-group">
              <div class="relative">
                <input
                  v-model="formData.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'border-red-500': errors.confirmPassword }"
                  :placeholder="$t('common.confirmPassword')"
                />
                <div class="input-icon">
                  <font-awesome-icon icon="lock" />
                </div>
              </div>
              <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
            </div>

            <div class="flex items-center">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  class="w-4 h-4 rounded border-gray-300 text-[#25D366] focus:ring-[#25D366]"
                />
                <span class="text-sm text-gray-600 dark:text-gray-300">{{ $t('auth.agreeTerms') }}</span>
              </label>
            </div>

            <div class="relative my-6">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-4 bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400">
                  {{ $t('auth.orContinueWith') }}
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <button
                type="button"
                class="btn-social"
                @click="handleGoogleLogin"
              >
                <font-awesome-icon :icon="['fab', 'google']" class="w-4 h-4" />
                <span>Google</span>
              </button>
              <button
                type="button"
                class="btn-social"
                @click="handleFacebookLogin"
              >
                <font-awesome-icon :icon="['fab', 'facebook']" class="w-4 h-4" />
                <span>Facebook</span>
              </button>
            </div>

            <button
              type="submit"
              class="btn-primary"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('common.loading') }}
              </span>
              <span v-else class="flex items-center justify-center">
                {{ $t('common.register') }}
                <font-awesome-icon icon="arrow-right" class="ml-2 rtl:ml-0 rtl:mr-2" />
              </span>
            </button>

            <div class="text-center">
              <p class="text-sm text-gray-600 dark:text-gray-300">
                {{ $t('auth.haveAccount') }}
                <router-link to="/login" class="text-[#25D366] hover:text-[#128C7E] font-medium">
                  {{ $t('common.login') }}
                </router-link>
              </p>
            </div>
          </form>
        </div>

        <!-- Right Side - Illustration -->
        <div class="hidden md:flex items-center justify-center bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-r-3xl rtl:rounded-r-none rtl:rounded-l-3xl p-8">
          <div class="text-white text-center">
            <div class="mb-8">
              <h2 class="text-4xl font-bold mb-4">{{ $t('auth.welcomeTitle') }}</h2>
              <p class="text-lg opacity-90">{{ $t('auth.welcomeSubtitle') }}</p>
            </div>
            
            <div class="space-y-6">
              <div class="flex items-center space-x-4 rtl:space-x-reverse">
                <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <font-awesome-icon :icon="['fas', 'paper-plane']" class="text-xl" />
                </div>
                <div class="text-left rtl:text-right">
                  <h3 class="text-lg font-semibold">{{ $t('auth.benefit1') }}</h3>
                  <p class="text-gray-100 opacity-80 text-sm">{{ $t('auth.benefit1Desc') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4 rtl:space-x-reverse">
                <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <font-awesome-icon :icon="['fas', 'clock']" class="text-xl" />
                </div>
                <div class="text-left rtl:text-right">
                  <h3 class="text-lg font-semibold">{{ $t('auth.benefit2') }}</h3>
                  <p class="text-gray-100 opacity-80 text-sm">{{ $t('auth.benefit2Desc') }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4 rtl:space-x-reverse">
                <div class="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <font-awesome-icon :icon="['fas', 'chart-bar']" class="text-xl" />
                </div>
                <div class="text-left rtl:text-right">
                  <h3 class="text-lg font-semibold">{{ $t('auth.benefit3') }}</h3>
                  <p class="text-gray-100 opacity-80 text-sm">{{ $t('auth.benefit3Desc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { faGoogle, faFacebook, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'
import authService from '@/services/authService'
import { useToast } from 'vue-toastification'

// Add icons to library
library.add(faGoogle, faFacebook, faWhatsapp)

const router = useRouter()
const { t } = useI18n()
const toast = useToast()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const showPassword = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  }

  if (!formData.value.name) {
    errors.value.name = t('errors.required', { field: t('common.name') })
    isValid = false
  }

  if (!formData.value.email) {
    errors.value.email = t('errors.required', { field: t('common.email') })
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = t('errors.invalidEmail')
    isValid = false
  }

  if (!formData.value.phone) {
    errors.value.phone = t('errors.required', { field: t('common.phone') })
    isValid = false
  }

  if (!formData.value.password) {
    errors.value.password = t('errors.required', { field: t('common.password') })
    isValid = false
  } else if (formData.value.password.length < 6) {
    errors.value.password = t('errors.passwordLength')
    isValid = false
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = t('errors.passwordMismatch')
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    await authService.register({
      email: formData.value.email,
      password: formData.value.password,
      phone: formData.value.phone,
      accountName: formData.value.name
    })
    toast.success(t('auth.registerSuccess'))
    router.push('/dashboard')
  } catch (error: any) {
    toast.error( t('auth.'+error.message))
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleGoogleLogin = () => {
  // TODO: Implement Google login
  console.log('Google login clicked')
}

const handleFacebookLogin = () => {
  // TODO: Implement Facebook login
  console.log('Facebook login clicked')
}
</script>

<style scoped>
.min-h-screen {
  background-image: url('/src/assets/hero-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.form-input {
  @apply w-full px-10 py-3 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#25D366] transition-all duration-300;
  background-color: transparent;
}

.form-input:focus {
  @apply shadow-lg;
  transform: translateY(-1px);
}

.form-input::placeholder {
  @apply text-gray-400 dark:text-gray-500;
}

.input-icon {
  @apply absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 rtl:left-auto rtl:right-3;
}

.form-group {
  @apply mb-4 relative;
}

.error-message {
  @apply text-red-500 text-xs mt-1;
}

.btn-primary {
  @apply bg-[#25D366] hover:bg-[#128C7E] text-white;
  @apply w-full py-3 text-base font-medium rounded-xl transition-all duration-300;
  @apply flex items-center justify-center;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed;
}

/* Dark mode styles */
.dark .form-input {
  @apply bg-[#1e293b] text-white;
}

.dark .form-input:focus {
  @apply border-[#25D366] !important;
}

/* RTL support */
[dir="rtl"] .form-input {
  padding-left: 1rem;
  padding-right: 2.5rem;
}

[dir="rtl"] .input-icon {
  left: auto;
  right: 0.75rem;
}

[dir="rtl"] .btn-primary span {
  @apply flex-row-reverse;
}

[dir="rtl"] .btn-primary span svg {
  @apply mr-0 ml-2;
}

.btn-social {
  @apply bg-white dark:bg-[#1e293b] text-gray-500 dark:text-gray-400 hover:bg-[#25D366] hover:text-white;
  @apply w-full py-3 text-base font-medium rounded-xl transition-all duration-300;
  @apply flex items-center justify-center space-x-2;
}
</style> 