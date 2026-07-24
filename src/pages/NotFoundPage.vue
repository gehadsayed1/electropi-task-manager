<script setup lang="ts">
import { useRouter } from 'vue-router'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()

function goHome(): void {
  router.push({ name: 'Dashboard' })
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] dark:bg-[#0F0F10] flex items-center justify-center p-6">
    <div class="text-center max-w-md">
      <!-- 404 Graphic -->
      <div
        class="text-[120px] font-black leading-none bg-gradient-to-br from-[#9D6638] to-[#F5EEE7] bg-clip-text text-transparent select-none mb-4"
      >
        404
      </div>

      <h1 class="text-2xl font-bold text-[#1F2937] dark:text-[#F9FAFB] mb-2">Page not found</h1>
      <p class="text-sm text-[#6B7280] dark:text-[#9CA3AF] mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <BaseButton id="go-home-btn" variant="primary" size="lg" @click="goHome">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Go to Dashboard
      </BaseButton>
    </div>
  </div>
</template>
