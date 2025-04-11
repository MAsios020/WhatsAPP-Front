<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <nav class="whatsapp-gradient py-4 fixed w-full z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center">
          <!-- Logo and Brand -->
          <div class="flex items-center space-x-2">
            <img src="@/assets/logo.png" alt="WhatsApp Sender" class="h-8 w-8" />
            <span class="text-white text-xl font-bold">{{ $t('common.appName') }}</span>
          </div>

          <!-- Right Side Controls -->
          <div class="flex items-center space-x-4">
            <!-- Theme and Language Toggles -->
            <div class="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <ThemeToggle />
              <div class="h-6 w-px bg-white/20"></div>
              <LanguageToggle />
            </div>

            <!-- Auth Buttons -->
            <div class="flex items-center space-x-4">
              <router-link to="/login" class="nav-link">
                <font-awesome-icon icon="user" class="mr-2" />
                {{ $t('common.login') }}
              </router-link>
              <router-link to="/register" class="nav-link">
                <font-awesome-icon icon="user-plus" class="mr-2" />
                {{ $t('common.register') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section text-white pt-32 pb-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl md:text-7xl font-bold mb-6">{{ $t('home.heroTitle') }}</h1>
        <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          {{ $t('home.heroSubtitle') }}
        </p>
        <div class="flex justify-center space-x-4">
          <router-link to="/register" class="btn btn-primary text-lg px-8 py-3">
            {{ $t('home.getStarted') }} <font-awesome-icon icon="arrow-right" class="ml-2" />
          </router-link>
          <a href="#features" class="btn btn-secondary text-lg px-8 py-3">
            {{ $t('home.learnMore') }}
          </a>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-16">{{ $t('home.featuresTitle') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Multi-Device Support -->
          <div class="feature-card group">
            <div class="text-whatsapp-green mb-4 text-4xl">
              <font-awesome-icon icon="mobile-screen" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.multiDevice') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.multiDeviceDesc') }}</p>
          </div>

          <!-- Bulk Messaging -->
          <div class="feature-card group">
            <div class="text-whatsapp-green mb-4 text-4xl">
              <font-awesome-icon icon="users" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.bulkMessaging') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.bulkMessagingDesc') }}</p>
          </div>

          <!-- QR Login -->
          <div class="feature-card group">
            <div class="text-whatsapp-green mb-4 text-4xl">
              <font-awesome-icon icon="qrcode" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.qrLogin') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.qrLoginDesc') }}</p>
          </div>

          <!-- Message Types -->
          <div class="feature-card group">
            <div class="text-whatsapp-green mb-4 text-4xl">
              <font-awesome-icon icon="message" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.messageTypes') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.messageTypesDesc') }}</p>
          </div>

          <!-- Scheduling -->
          <div class="feature-card group">
            <div class="text-whatsapp-green mb-4 text-4xl">
              <font-awesome-icon icon="calendar-days" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.scheduling') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.schedulingDesc') }}</p>
          </div>

          <!-- Auto Reply -->
          <div class="feature-card group">
            <div class="text-whatsapp-green mb-4 text-4xl">
              <font-awesome-icon icon="robot" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.autoReply') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.autoReplyDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-16">{{ $t('home.howItWorks') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="bg-white dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <font-awesome-icon icon="qrcode" class="text-3xl text-whatsapp-green" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.scanQR') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.scanQRDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="bg-white dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <font-awesome-icon icon="message" class="text-3xl text-whatsapp-green" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.createMessages') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.createMessagesDesc') }}</p>
          </div>
          <div class="text-center">
            <div class="bg-white dark:bg-gray-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <font-awesome-icon icon="paper-plane" class="text-3xl text-whatsapp-green" />
            </div>
            <h3 class="text-xl font-bold mb-2">{{ $t('home.sendTrack') }}</h3>
            <p class="text-gray-600 dark:text-gray-300">{{ $t('home.sendTrackDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <h2 class="text-4xl font-bold text-center mb-16">{{ $t('home.pricingTitle') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Basic Plan -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <h3 class="text-2xl font-bold mb-4">{{ $t('home.basic') }}</h3>
            <p class="text-4xl font-bold mb-4">$9.99<span class="text-gray-500 text-lg">{{ $t('home.perMonth') }}</span></p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                1000 {{ $t('home.messagesPerMonth') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.basicTemplates') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.singleDevice') }}
              </li>
            </ul>
            <button class="btn btn-primary w-full">{{ $t('home.getStarted') }}</button>
          </div>

          <!-- Pro Plan -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 border-2 border-whatsapp-green transform hover:scale-105 transition-transform duration-300">
            <div class="absolute top-0 right-0 bg-whatsapp-green text-white px-4 py-1 rounded-bl-lg">
              {{ $t('home.popular') }}
            </div>
            <h3 class="text-2xl font-bold mb-4">{{ $t('home.pro') }}</h3>
            <p class="text-4xl font-bold mb-4">$19.99<span class="text-gray-500 text-lg">{{ $t('home.perMonth') }}</span></p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                5000 {{ $t('home.messagesPerMonth') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.advancedTemplates') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.multiDeviceSupport') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.campaignManagement') }}
              </li>
            </ul>
            <button class="btn btn-primary w-full">{{ $t('home.getStarted') }}</button>
          </div>

          <!-- Enterprise Plan -->
          <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
            <h3 class="text-2xl font-bold mb-4">{{ $t('home.enterprise') }}</h3>
            <p class="text-4xl font-bold mb-4">{{ $t('home.contactSales') }}</p>
            <ul class="space-y-3 mb-6">
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.unlimitedMessages') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.customTemplates') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.apiAccess') }}
              </li>
              <li class="flex items-center">
                <font-awesome-icon icon="check" class="text-whatsapp-green mr-2" />
                {{ $t('home.prioritySupport') }}
              </li>
            </ul>
            <button class="btn btn-primary w-full">{{ $t('home.contactSales') }}</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="whatsapp-gradient text-white py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-xl font-bold mb-4">WhatsApp Sender</h3>
            <p class="text-whatsapp-light">Powerful WhatsApp messaging platform for businesses</p>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Features</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-whatsapp-light">Bulk Messaging</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Auto Reply</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Message Templates</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Analytics</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Company</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-whatsapp-light">About Us</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Contact</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Careers</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg font-bold mb-4">Legal</h4>
            <ul class="space-y-2">
              <li><a href="#" class="hover:text-whatsapp-light">Privacy Policy</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Terms of Service</a></li>
              <li><a href="#" class="hover:text-whatsapp-light">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-whatsapp-light mt-8 pt-8 text-center">
          <p>&copy; 2024 WhatsApp Sender. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageToggle from '@/components/LanguageToggle.vue'
// Component logic here
</script>

<style scoped>
.whatsapp-gradient {
  @apply bg-gradient-to-r from-whatsapp-dark to-whatsapp-green;
}

.feature-card {
  @apply bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300;
}

.nav-link {
  @apply text-white hover:text-whatsapp-light transition-colors duration-200;
}

.hero-section {
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
              url('/src/assets/hero-bg.jpg');
  background-size: cover;
  background-position: center;
}
</style> 