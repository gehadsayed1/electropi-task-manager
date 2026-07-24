<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { TaskStatus } from '@/types'
import type { Task } from '@/types'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'
import { useTaskStore } from '@/stores'
import draggable from 'vuedraggable'

interface Props {
  tasks: Task[]
  pageSize?: number
}

const props = defineProps<Props>()

const pageSize = computed(() => props.pageSize ?? 9) // default 9 (3 columns x 3 rows)

const currentPage = ref(1)

const totalPages = computed(() => Math.max(1, Math.ceil(props.tasks.length / pageSize.value)))

function setPage(p: number) {
  if (p < 1) p = 1
  if (p > totalPages.value) p = totalPages.value
  currentPage.value = p
}

const pagedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return props.tasks.slice(start, start + pageSize.value)
})

const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
  'create-task': []
}>()

const store = useTaskStore()

// Order rows as requested: In Progress (top), Pending (middle), Done (bottom)
const statuses: Array<{
  key: TaskStatus
  label: string
  icon: string
  color: string
}> = [
  {
    key: TaskStatus.IN_PROGRESS,
    label: 'In Progress',
    icon: 'M12 4v4l4 4-4 4v4',
    color: 'text-info',
  },
  {
    key: TaskStatus.PENDING,
    label: 'Pending',
    icon: 'M12 6a6 6 0 100 12 6 6 0 000-12zm0 0v4l3 3',
    color: 'text-warning',
  },
  {
    key: TaskStatus.DONE,
    label: 'Done',
    icon: 'M5 13l4 4L19 7',
    color: 'text-success',
  },
]

const groups = ref<Record<TaskStatus, Task[]>>({
  [TaskStatus.PENDING]: [],
  [TaskStatus.IN_PROGRESS]: [],
  [TaskStatus.DONE]: [],
})

function rebuildGroups() {
  // group only the currently paginated tasks
  const source = pagedTasks.value
  groups.value[TaskStatus.PENDING] = source.filter((t) => t.status === TaskStatus.PENDING)
  groups.value[TaskStatus.IN_PROGRESS] = source.filter((t) => t.status === TaskStatus.IN_PROGRESS)
  groups.value[TaskStatus.DONE] = source.filter((t) => t.status === TaskStatus.DONE)
}

watch(
  () => [props.tasks, currentPage.value, pageSize.value],
  () => rebuildGroups(),
  { immediate: true, deep: true },
)

function onChange(e: any, destStatus: TaskStatus) {
  if (e && e.added) {
    const task: Task = e.added.element
    store.updateTask(task.id, { status: destStatus })
  }

  setTimeout(() => rebuildGroups(), 0)
}

const changeHandler = (dest: TaskStatus) => {
  return (evt: any) => onChange(evt, dest)
}

</script>

<template>
  <div>
    <div v-if="props.tasks.length === 0">
      <EmptyState @action="() => emit('create-task')" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="s in statuses" :key="s.key" class="">
        <div class="mb-2 flex items-center gap-2">
          <svg :class="['w-4 h-4', s.color]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="s.icon" />
          </svg>
          <h3 class="text-sm font-semibold text-text-main">{{ s.label }}</h3>
        </div>

        <draggable
          tag="div"
          :list="groups[s.key]"
          item-key="id"
          group="tasks"
          ghost-class="opacity-50"
          drag-class="cursor-grabbing"
          handle=".drag-handle"
          :animation="200"
          class="space-y-3"
          @change="changeHandler(s.key)"
        >
          <template #item="{ element }">
            <div>
              <TaskCard
                :task="element"
                class="drag-handle"
                @edit="emit('edit', $event)"
                @delete="emit('delete', $event)"
              />
            </div>
          </template>
        </draggable>
      </div>
      <!-- Pagination controls -->
      <div class="mt-4 flex items-center justify-center gap-2">
        <button
          class="px-3 py-1 rounded-md border bg-border/50 text-text-muted disabled:opacity-50"
          :disabled="currentPage === 1"
          @click.prevent="setPage(currentPage - 1)"
        >
          Prev
        </button>

        <div class="text-sm text-text-muted">Page {{ currentPage }} / {{ totalPages }}</div>

        <button
          class="px-3 py-1 rounded-md border bg-border/50 text-text-muted disabled:opacity-50"
          :disabled="currentPage === totalPages"
          @click.prevent="setPage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
