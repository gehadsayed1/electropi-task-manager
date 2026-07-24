<script setup lang="ts">
import { useTheme } from '@/composables'

const { theme, toggleTheme } = useTheme()
</script>

<template>
  <div class="min-h-screen flex flex-col  transition-colors duration-300 bg-background">
    <!-- Top Header -->
    <header class="sticky top-0 z-30 bg-surface/80 p-16 backdrop-blur-md border-b border-border p-10  h-16 flex items-center justify-between">
      <!-- Left: Logo & Navigation -->
      <div class="flex items-center gap-4">
        <RouterLink to="/" class="flex items-center gap-2.5 group">
          <div class="w-8 h-8 rounded-lg bg-text-main flex items-center justify-center transition-transform group-hover:scale-105">
            <svg class="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <span class="text-sm font-semibold text-text-main hidden sm:block">ElectroPi</span>
        </RouterLink>
      </div>

      <!-- Center: Search/Filters (Slot) -->
      <div class="flex-1 max-w-2xl mx-4 hidden md:flex justify-center">
        <slot name="header-center" />
      </div>

      <!-- Right: Actions & Theme -->
      <div class="flex items-center gap-3">
        <slot name="header-actions" />

        <div class="w-px h-5 bg-border hidden sm:block"></div>

        <button
          id="theme-toggle"
          class="w-9 h-9 flex items-center justify-center rounded-lg text-text-muted hover:bg-border transition-colors cursor-pointer"
          :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`"
          @click="toggleTheme"
        >
          <!-- Sun icon (show when dark → switch to light) -->
          <svg v-if="theme === 'dark'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon (show when light → switch to dark) -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
    </header>

<main class="bg-red-100">
  <div class="max-w-6xl mx-auto flex items-center justify-center  px-8 py-8 border-4 border-blue-500">
    <slot />
  </div>
</main>
  </div>
</template>
