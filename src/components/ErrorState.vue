<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Something went wrong. Please try again.',
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="w-20 h-20 rounded-2xl bg-[#FEE2E2] dark:bg-[#2d0a0a] flex items-center justify-center mb-5">
      <svg class="w-10 h-10 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    </div>

    <h3 class="text-base font-semibold text-[#1F2937] dark:text-[#F9FAFB] mb-1.5">
      Oops, something went wrong
    </h3>
    <p class="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-xs">{{ message }}</p>

    <button
      id="error-retry-btn"
      class="mt-6 h-9 px-4 text-sm font-medium bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
      @click="emit('retry')"
    >
      Try Again
    </button>
  </div>
</template>
