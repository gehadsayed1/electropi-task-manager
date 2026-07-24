<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Task } from '@/types'
import { TaskStatus } from '@/types'
import StatusBadge from './StatusBadge.vue'
import { isOverdue, isDueToday, isRecentlyUpdated, formatDate } from '@/utils'

interface Props {
  task: Task
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
}>()

const router = useRouter()

const overdue = computed(() => isOverdue(props.task))
const dueToday = computed(() => isDueToday(props.task))
const recentlyUpdated = computed(() => isRecentlyUpdated(props.task))

const dueDateLabel = computed(() => formatDate(props.task.dueDate))

const cardBorderClass = computed(() => {
  if (overdue.value) return 'border-l-4 border-l-danger'
  if (dueToday.value) return 'border-l-4 border-l-warning'
  if (props.task.status === TaskStatus.DONE) return 'border-l-4 border-l-success'
  return ''
})

function openDetail(): void {
  router.push({ name: 'TaskDetail', params: { id: props.task.id } })
}

function onEdit(e: Event): void {
  e.stopPropagation()
  emit('edit', props.task)
}

function onDelete(e: Event): void {
  e.stopPropagation()
  emit('delete', props.task)
}
</script>

<template>
  <article
    :class="[
      'group relative bg-surface rounded-xl border border-border',
      'hover:border-text-muted/40 shadow-sm hover:shadow-md transition-all duration-200',
      'cursor-pointer p-4 flex flex-col h-full min-h-[140px]',
      cardBorderClass,
    ]"
    :aria-label="`Task: ${task.title}`"
    @click="openDetail"
  >
    <div class="flex items-start justify-between gap-3 mb-2">
      <h3
        :class="[
          'text-sm font-medium leading-snug line-clamp-2 flex-1',
          task.status === TaskStatus.DONE
            ? 'text-text-muted/60 line-through'
            : 'text-text-main',
        ]"
      >
        {{ task.title }}
      </h3>
      <StatusBadge :status="task.status" size="sm" class="shrink-0" />
    </div>

    <p
      v-if="task.description"
      class="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4 flex-1"
    >
      {{ task.description }}
    </p>
    <div v-else class="flex-1"></div>

    <div class="flex items-center justify-between mt-auto pt-3 border-t border-border">
      
      <div class="flex items-center gap-2">
        <div
          :class="[
            'flex items-center gap-1 text-xs font-medium',
            overdue ? 'text-danger' : dueToday ? 'text-warning' : 'text-text-muted',
          ]"
        >
          <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ dueDateLabel }}
        </div>
        
        <span v-if="overdue" class="w-1.5 h-1.5 rounded-full bg-danger"></span>
        <span v-else-if="dueToday" class="w-1.5 h-1.5 rounded-full bg-warning"></span>
        <span v-else-if="recentlyUpdated" class="w-1.5 h-1.5 rounded-full bg-info"></span>
      </div>

      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          :id="`edit-task-${task.id}`"
          class="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-main hover:bg-background transition-colors"
          aria-label="Edit task"
          @click="onEdit"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          :id="`delete-task-${task.id}`"
          class="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-danger hover:bg-danger-light/20 dark:hover:bg-danger-light/10 transition-colors"
          aria-label="Delete task"
          @click="onDelete"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>
