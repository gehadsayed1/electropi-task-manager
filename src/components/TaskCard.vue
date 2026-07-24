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

const statusTriangleStyle = computed(() => {
  const color =
    props.task.status === TaskStatus.DONE
      ? 'var(--color-success)'
      : props.task.status === TaskStatus.IN_PROGRESS
      ? 'var(--color-info)'
      : 'var(--color-warning)'

  return {
    borderBottomColor: color,
  }
})

const shouldShowMore = computed(() => props.task.description.length > 100)

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
    class="group relative overflow-hidden rounded-[24px] border border-border bg-surface shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-text-muted/30 hover:shadow-lg cursor-pointer h-[240px]"
    :aria-label="`Task: ${task.title}`"
    @click="openDetail"
  >
    <div class="absolute top-0 right-0 overflow-hidden">
      <div
        class="w-0 h-0 border-l-[60px] border-b-[60px] border-l-transparent border-b-transparent"
        :style="statusTriangleStyle"
      />
    </div>

    <div class="relative flex flex-col h-full min-h-[160px] p-5">
      <div class="flex items-start justify-between gap-3 mb-4">
        <h3
          :class="[
            'text-base font-semibold leading-snug line-clamp-2 flex-1',
            task.status === TaskStatus.DONE
              ? 'text-text-muted/60 line-through'
              : 'text-text-main',
          ]"
        >
          {{ task.title }}
        </h3>
        <StatusBadge :status="task.status" size="sm" class="shrink-0" />
      </div>

      <div class="mb-5 flex-1 overflow-hidden">
        <p
          v-if="task.description"
          class="text-sm text-text-muted line-clamp-3 leading-relaxed break-words"
        >
          {{ task.description }}
        </p>
        <div v-if="shouldShowMore" class="mt-2 text-xs font-semibold text-info">
          More
        </div>
        <div v-else-if="!task.description" class="flex-1" />
      </div>

      <div class="mt-auto pt-4 border-t border-border/70">
        <div class="flex items-center justify-between gap-3">
          <div
            :class="[
              'inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface px-3 py-2 text-xs font-medium shadow-sm',
              overdue ? 'text-danger' : dueToday ? 'text-warning' : 'text-text-muted',
            ]"
          >
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ dueDateLabel }}
          </div>

          <div class="flex items-center gap-2">
            <span v-if="overdue" class="w-2.5 h-2.5 rounded-full bg-danger"></span>
            <span v-else-if="dueToday" class="w-2.5 h-2.5 rounded-full bg-warning"></span>
            <span v-else-if="recentlyUpdated" class="w-2.5 h-2.5 rounded-full bg-info"></span>
          </div>
        </div>

        <div class="mt-3 flex items-center justify-end gap-2">
          <button
            :id="`edit-task-${task.id}`"
            class="w-9 h-9 flex items-center justify-center rounded-full bg-surface text-info shadow-sm hover:text-text-main hover:bg-background transition-colors"
            aria-label="Edit task"
            @click="onEdit"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            :id="`delete-task-${task.id}`"
            class="w-9 h-9 flex items-center justify-center rounded-full bg-surface text-danger shadow-sm hover:bg-danger-light/20 dark:hover:bg-danger-light/10 transition-colors"
            aria-label="Delete task"
            @click="onDelete"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>
