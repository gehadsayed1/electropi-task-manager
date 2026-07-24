<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import StatCard from '@/components/StatCard.vue'
import TaskGrid from '@/components/TaskGrid.vue'
import TaskModal from '@/components/TaskModal.vue'
import DeleteDialog from '@/components/DeleteDialog.vue'
import SearchInput from '@/components/SearchInput.vue'
import StatusFilter from '@/components/StatusFilter.vue'
import SortDropdown from '@/components/SortDropdown.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton.vue'
import ErrorState from '@/components/ErrorState.vue'
import ProgressRing from '@/components/ProgressRing.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useTasks } from '@/composables'
import { useToast } from '@/composables'
import type { Task, TaskFormData, FilterOption, SortOption } from '@/types'

const {
  filteredTasks,
  loading,
  error,
  statistics,
  search,
  filter,
  sort,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  setSearch,
  setFilter,
  setSort,
} = useTasks()

const toast = useToast()

const showTaskModal = ref(false)
const showDeleteDialog = ref(false)
const editingTask = ref<Task | null>(null)
const deletingTask = ref<Task | null>(null)
const submitting = ref(false)

function openCreateModal(): void {
  editingTask.value = null
  showTaskModal.value = true
}

function openEditModal(task: Task): void {
  editingTask.value = task
  showTaskModal.value = true
}

function openDeleteDialog(task: Task): void {
  deletingTask.value = task
  showDeleteDialog.value = true
}

function closeModal(): void {
  showTaskModal.value = false
  editingTask.value = null
}

function closeDeleteDialog(): void {
  showDeleteDialog.value = false
  deletingTask.value = null
}

async function onTaskSubmit(formData: TaskFormData): Promise<void> {
  submitting.value = true
  try {
    // allow DOM to update so loading spinner appears
    await nextTick()
    if (editingTask.value) {
      await updateTask(editingTask.value.id, formData)
      toast.success('Task updated successfully!')
    } else {
      await new Promise((resolve) => setTimeout(resolve, 650))
      await createTask(formData)
      toast.success('Task created successfully!')
    }
    closeModal()
  } finally {
    submitting.value = false
  }
}

async function onDeleteConfirm(): Promise<void> {
  if (!deletingTask.value) return
  submitting.value = true
  try {
    deleteTask(deletingTask.value.id)
    toast.success('Task deleted successfully!')
    closeDeleteDialog()
  } finally {
    submitting.value = false
  }
}

function onSearchUpdate(value: string): void {
  setSearch(value)
}

function onFilterUpdate(value: FilterOption): void {
  setFilter(value)
}

function onSortUpdate(value: SortOption): void {
  setSort(value)
}

onMounted(async () => {
  await fetchTasks()
})
</script>

<template>
  <AppLayout>
    
    <template #header-center>
      <div class="w-full max-w-md">
        <SearchInput :model-value="search" @update:model-value="onSearchUpdate" />
      </div>
    </template>

    
    <template #header-center-mobile>
      <SearchInput :model-value="search" @update:model-value="onSearchUpdate" />
      <div class="flex flex-col gap-2 w-full">
        <div class="flex gap-2 w-full">
          <StatusFilter :model-value="filter" @update:model-value="onFilterUpdate" />
          <SortDropdown :model-value="sort" @update:model-value="onSortUpdate" />
        </div>
      </div>
    </template>

    
    <template #header-actions>
      <div class="hidden md:flex items-center gap-2 mr-2">
        <StatusFilter :model-value="filter" @update:model-value="onFilterUpdate" />
        <SortDropdown :model-value="sort" @update:model-value="onSortUpdate" />
      </div>
      <BaseButton
        id="create-task-btn"
        variant="primary"
        @click="openCreateModal"
        class="!bg-primary hover:!bg-primary-hover text-white border-none shadow-sm"
      >
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Task
      </BaseButton>
    </template>

    <div class="space-y-8">
      
      <div class="flex items-end justify-between">
        <div>
          <h1 class="text-2xl font-bold text-text-main tracking-tight">Overview</h1>
          <p class="text-sm text-text-muted mt-1">Manage and track your tasks.</p>
        </div>
      </div>

      
      <Transition name="fade">
        <div v-if="!loading && !error">
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4 pb-2">
            <StatCard
              title="Total"
              :value="statistics.total"
              color="primary"
            />
            <StatCard
              title="Pending"
              :value="statistics.pending"
              color="warning"
            />
            <StatCard
              title="In Progress"
              :value="statistics.inProgress"
              color="info"
            />
            <StatCard
              title="Completed"
              :value="statistics.completed"
              color="success"
            />
            <div class="shrink-0 bg-surface rounded-xl border border-border px-6 py-4 flex items-center gap-4 w-40 sm:w-48">
              <ProgressRing :percentage="statistics.completedPercentage" :size="48" :stroke-width="6" />
              <div>
                <p class="text-sm font-medium text-text-muted">Progress</p>
                <p class="text-lg font-semibold text-text-main">{{ statistics.completedPercentage }}%</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      
      <div v-if="!loading && !error" class="flex items-center">
        <p class="text-sm font-medium text-text-muted">
          Showing <span class="text-text-main">{{ filteredTasks.length }}</span> {{ filteredTasks.length === 1 ? 'task' : 'tasks' }}
        </p>
      </div>

      
      <div>
        <LoadingSkeleton v-if="loading" :count="6" />
        <ErrorState
          v-else-if="error"
          :message="error"
          @retry="fetchTasks"
        />
        <TaskGrid
          v-else
          :tasks="filteredTasks"
          @edit="openEditModal"
          @delete="openDeleteDialog"
          @create-task="openCreateModal"
        />
      </div>
    </div>

    
    <TaskModal
      v-if="showTaskModal"
      :task="editingTask"
      :loading="submitting"
      @submit="onTaskSubmit"
      @cancel="closeModal"
    />

    
    <DeleteDialog
      :task="deletingTask"
      :loading="submitting"
      @confirm="onDeleteConfirm"
      @cancel="closeDeleteDialog"
    />
  </AppLayout>
</template>
