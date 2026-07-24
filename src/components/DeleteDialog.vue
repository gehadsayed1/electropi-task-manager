<script setup lang="ts">
import type { Task } from '@/types'
import BaseButton from './base/BaseButton.vue'

interface Props {
  task: Task | null
  loading?: boolean
}

withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Transition name="modal">
    <div
      v-if="task"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="emit('cancel')"
      />

      <div
        class="modal-content relative w-full max-w-sm bg-white dark:bg-[#1A1A1E] rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] border border-[#E5E7EB] dark:border-[#2A2A30] p-6"
      >
        <div class="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[#FEE2E2] dark:bg-[#2d0a0a] flex items-center justify-center">
          <svg class="w-6 h-6 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        <h2
          id="delete-dialog-title"
          class="text-base font-semibold text-center text-[#1F2937] dark:text-[#F9FAFB] mb-1"
        >
          Delete Task
        </h2>
        <p class="text-sm text-[#6B7280] dark:text-[#9CA3AF] text-center mb-6">
          Are you sure you want to delete
          <span class="font-medium text-[#1F2937] dark:text-[#F9FAFB]">"{{ task.title }}"</span>?
          This action cannot be undone.
        </p>

        <div class="flex gap-3">
          <BaseButton
            id="cancel-delete-btn"
            variant="outline"
            class="flex-1"
            @click="emit('cancel')"
          >
            Cancel
          </BaseButton>
          <BaseButton
            id="confirm-delete-btn"
            variant="danger"
            :loading="loading"
            class="flex-1"
            @click="emit('confirm')"
          >
            Delete
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
