<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import TaskModal from '@/components/TaskModal.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useTasks, useToast } from '@/composables'
import type { Task, TaskFormData } from '@/types'
import { formatDate, formatDateTime, isOverdue, isDueToday, isRecentlyUpdated } from '@/utils'

const route = useRoute()
const router = useRouter()

const { getTaskById, updateTask, deleteTask, fetchTasks } = useTasks()
const toast = useToast()

const taskId = computed(() => route.params.id as string)
const task = computed<Task | undefined>(() => getTaskById(taskId.value))

const showEditModal = ref(false)
const showDeleteDialog = ref(false)
const submitting = ref(false)
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await fetchTasks()
  isLoading.value = false
  if (!task.value) {
    router.push({ name: 'NotFound' })
  }
})

function goBack(): void {
  router.push({ name: 'Dashboard' })
}

async function onTaskUpdate(formData: TaskFormData): Promise<void> {
  submitting.value = true
  try {
    updateTask(taskId.value, formData)
    toast.success('Task updated successfully!')
    showEditModal.value = false
  } finally {
    submitting.value = false
  }
}

async function onDeleteConfirm(): Promise<void> {
  submitting.value = true
  try {
    deleteTask(taskId.value)
    toast.success('Task deleted!')
    router.push({ name: 'Dashboard' })
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <AppLayout>
    <div class="p-6 lg:p-8 max-w-2xl mx-auto">
      <button
        id="back-btn"
        class="flex items-center gap-1.5 text-sm text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#9D6638] dark:hover:text-[#c4935a] mb-6 transition-colors cursor-pointer group"
        @click="goBack"
      >
        <svg
          class="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Dashboard
      </button>

      <div v-if="isLoading" class="space-y-4">
        <div class="w-32 h-6 bg-[#F3F4F6] dark:bg-[#2A2A30] rounded skeleton-pulse" />
        <div class="w-full h-8 bg-[#F3F4F6] dark:bg-[#2A2A30] rounded skeleton-pulse" />
        <div class="w-3/4 h-4 bg-[#F3F4F6] dark:bg-[#2A2A30] rounded skeleton-pulse" />
      </div>

      <div
        v-else-if="task"
        class="bg-white dark:bg-[#1A1A1E] rounded-2xl border border-[#E5E7EB] dark:border-[#2A2A30] shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
      >
        <div class="p-6 border-b border-[#F3F4F6] dark:border-[#2A2A30]">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <StatusBadge :status="task.status" />
                <span
                  v-if="isOverdue(task)"
                  class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#EF4444] dark:bg-[#2d0a0a] dark:text-[#F87171]"
                >
                  Overdue
                </span>
                <span
                  v-else-if="isDueToday(task)"
                  class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706] dark:bg-[#2d2200] dark:text-[#FBBF24]"
                >
                  Due Today
                </span>
                <span
                  v-if="isRecentlyUpdated(task)"
                  class="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#1D4ED8] dark:bg-[#0f1f3d] dark:text-[#60A5FA]"
                >
                  Recently Updated
                </span>
              </div>
              <h1 class="text-xl font-bold text-[#1F2937] dark:text-[#F9FAFB] leading-snug">
                {{ task.title }}
              </h1>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <BaseButton
                id="edit-task-detail-btn"
                variant="secondary"
                size="sm"
                @click="showEditModal = true"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit
              </BaseButton>
              <BaseButton
                id="delete-task-detail-btn"
                variant="danger"
                size="sm"
                @click="showDeleteDialog = true"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </BaseButton>
            </div>
          </div>
        </div>

        <div class="p-6 space-y-6">
          
          <div>
            <h2 class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-2">
              Description
            </h2>
            <p
              v-if="task.description"
              class="text-sm text-[#1F2937] dark:text-[#D1D5DB] leading-relaxed"
            >
              {{ task.description }}
            </p>
            <p v-else class="text-sm text-[#9CA3AF] italic">No description provided.</p>
          </div>

          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <p class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Due Date</p>
              <p
                :class="[
                  'text-sm font-medium',
                  isOverdue(task)
                    ? 'text-[#EF4444]'
                    : isDueToday(task)
                      ? 'text-[#F59E0B]'
                      : 'text-[#1F2937] dark:text-[#F9FAFB]',
                ]"
              >
                {{ formatDate(task.dueDate) }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Status</p>
              <StatusBadge :status="task.status" size="sm" />
            </div>

            <div class="space-y-1">
              <p class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Created</p>
              <p class="text-sm text-[#1F2937] dark:text-[#F9FAFB]">
                {{ formatDateTime(task.createdAt) }}
              </p>
            </div>

            <div class="space-y-1">
              <p class="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider">Last Updated</p>
              <p class="text-sm text-[#1F2937] dark:text-[#F9FAFB]">
                {{ formatDateTime(task.updatedAt) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <TaskModal
      v-if="showEditModal && task"
      :task="task"
      :loading="submitting"
      @submit="onTaskUpdate"
      @cancel="showEditModal = false"
    />

    
    <DeleteDialog
      :task="showDeleteDialog ? (task ?? null) : null"
      :loading="submitting"
      @confirm="onDeleteConfirm"
      @cancel="showDeleteDialog = false"
    />
  </AppLayout>
</template>
