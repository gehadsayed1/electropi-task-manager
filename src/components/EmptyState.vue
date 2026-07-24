<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  icon?: 'empty' | 'search'
}

withDefaults(defineProps<Props>(), {
  title: 'No tasks found',
  message: 'Create your first task to get started.',
  icon: 'empty',
})

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div class="w-20 h-20 rounded-2xl bg-[#F5EEE7] dark:bg-[#2a1f14] flex items-center justify-center mb-5">
      <svg
        v-if="icon === 'empty'"
        class="w-10 h-10 text-[#9D6638]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
      <svg
        v-else
        class="w-10 h-10 text-[#9D6638]"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>

    <h3 class="text-base font-semibold text-[#1F2937] dark:text-[#F9FAFB] mb-1.5">{{ title }}</h3>
    <p class="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-xs">{{ message }}</p>

    <button
      v-if="icon === 'empty'"
      id="empty-state-action"
      class="mt-6 h-9 px-4 text-sm font-medium bg-[#9D6638] hover:bg-[#85552E] text-white rounded-xl transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]"
      @click="emit('action')"
    >
      Create First Task
    </button>
  </div>
</template>
