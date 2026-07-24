<script setup lang="ts">
import { TransitionGroup } from 'vue'
import { useToast } from '@/composables'
import type { ToastType } from '@/composables'

const { toasts, remove } = useToast()

const toastIcons: Record<ToastType, string> = {
  success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
  warning:
    'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
}

const toastColors: Record<ToastType, string> = {
  success: 'bg-[#22C55E] text-white',
  error: 'bg-[#EF4444] text-white',
  warning: 'bg-[#F59E0B] text-white',
  info: 'bg-[#3B82F6] text-white',
}
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 items-end pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] max-w-sm',
          toastColors[toast.type],
        ]"
        role="alert"
        aria-live="polite"
      >
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            :d="toastIcons[toast.type]"
          />
        </svg>
        <p class="text-sm font-medium flex-1">{{ toast.message }}</p>
        <button
          class="shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Close notification"
          @click="remove(toast.id)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
