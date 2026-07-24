<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

const slotCounts = computed(() => {
  const total = pageSize.value
  const cols = statuses.length
  const base = Math.floor(total / cols)
  const rem = total % cols
  const counts: Record<string, number> = {}
  for (let i = 0; i < cols; i++) {
    const key = statuses[i].key
    counts[key] = base + (i < rem ? 1 : 0)
  }
  return counts
})

const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
  'create-task': []
}>()

const store = useTaskStore()

// Order rows as requested: In Progress (top), Pending (middle), Done (bottom)
const statuses = [
  { key: 'in_progress', label: 'In Progress' },
  { key: 'pending', label: 'Pending' },
  { key: 'done', label: 'Done' },
]

const groups = ref<Record<string, Task[]>>({
  pending: [],
  in_progress: [],
  done: [],
})

function rebuildGroups() {
  // group only the currently paginated tasks
  const source = pagedTasks.value
  groups.value.pending = source.filter((t) => t.status === 'pending')
  groups.value.in_progress = source.filter((t) => t.status === 'in_progress')
  groups.value.done = source.filter((t) => t.status === 'done')
}

watch(
  () => [props.tasks, currentPage.value, pageSize.value],
  () => rebuildGroups(),
  { immediate: true, deep: true },
)

function onChange(e: any, destStatus: string) {
  if (e && e.added) {
    const task: Task = e.added.element
    store.updateTask(task.id, { status: destStatus })
  }

  setTimeout(() => rebuildGroups(), 0)
}

</script>

<template>
  <div>
    <div v-if="props.tasks.length === 0">
      <EmptyState @action="() => emit('create-task')" />
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="s in statuses" :key="s.key" class="">
        <div class="mb-2">
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
          @change="(e) => onChange(e, s.key)"
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
        <!-- placeholders to keep column height stable when there are fewer items -->
        <template v-if="(slotCounts[s.key] ?? 0) > groups[s.key].length">
          <div
            v-for="n in (slotCounts[s.key] - groups[s.key].length)"
            :key="`ph-${s.key}-${n}`"
            class="invisible border border-transparent rounded-xl p-4 min-h-[140px]"
          />
        </template>
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
