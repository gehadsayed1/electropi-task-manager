<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Task, TaskFormData } from '@/types'
import { TaskStatus } from '@/types'
import { useValidation } from '@/composables'
import BaseInput from './base/BaseInput.vue'
import BaseTextarea from './base/BaseTextarea.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseButton from './base/BaseButton.vue'

interface Props {
  task?: Task | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  task: null,
  loading: false,
})

const emit = defineEmits<{
  submit: [formData: TaskFormData]
  cancel: []
}>()

const { errors, validate, clearError } = useValidation()

const isEdit = computed(() => !!props.task)
const title = computed(() => (isEdit.value ? 'Edit Task' : 'Create New Task'))

const form = ref<TaskFormData>({
  title: props.task?.title ?? '',
  description: props.task?.description ?? '',
  status: props.task?.status ?? TaskStatus.PENDING,
  dueDate: props.task?.dueDate ?? null,
})

const statusOptions = [
  { value: TaskStatus.PENDING, label: 'Pending' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
]

const todayStr = computed(() => new Date().toISOString().split('T')[0])

function onSubmit(): void {
  if (validate(form.value)) {
    emit('submit', { ...form.value })
  }
}

function onCancel(): void {
  emit('cancel')
}
</script>

<template>
  <Transition name="modal">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="onCancel"
      />

      <!-- Content -->
      <div
        class="modal-content relative w-full max-w-lg bg-surface rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.25)] border border-border"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div>
            <h2 class="text-base font-semibold text-text-main">{{ title }}</h2>
            <p class="text-xs text-text-muted mt-0.5">
              {{ isEdit ? 'Update task details below' : 'Fill in the details to create a new task' }}
            </p>
          </div>
          <button
            id="close-task-modal"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-background transition-colors cursor-pointer"
            aria-label="Close modal"
            @click="onCancel"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form class="p-6 space-y-4" @submit.prevent="onSubmit">
          <BaseInput
            id="task-title"
            v-model="form.title"
            label="Title"
            placeholder="Enter task title..."
            :error="errors.title"
            required
            autocomplete="off"
            @input="clearError('title')"
          />

          <BaseTextarea
            id="task-description"
            v-model="form.description"
            label="Description"
            placeholder="Enter task description (optional)..."
            :error="errors.description"
            :rows="3"
            :maxlength="500"
            @input="clearError('description')"
          />

          <div class="grid grid-cols-2 gap-4">
            <BaseSelect
              id="task-status"
              v-model="form.status"
              label="Status"
              :options="statusOptions"
            />
            <BaseInput
              id="task-due-date"
              v-model="form.dueDate as string"
              label="Due Date"
              type="date"
              :error="errors.dueDate"
              :min="todayStr"
              @input="clearError('dueDate')"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 pt-2">
            <BaseButton
              id="cancel-task-btn"
              variant="outline"
              type="button"
              @click="onCancel"
            >
              Cancel
            </BaseButton>
            <BaseButton
              id="submit-task-btn"
              variant="primary"
              type="submit"
              :loading="loading"
            >
              {{ isEdit ? 'Save Changes' : 'Create Task' }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>
