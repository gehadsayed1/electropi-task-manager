<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Task } from '@/types'
import TaskCard from './TaskCard.vue'
import EmptyState from './EmptyState.vue'
import { useTaskStore } from '@/stores'
import draggable from 'vuedraggable'

interface Props {
  tasks: Task[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [task: Task]
  'create-task': []
}>()

const store = useTaskStore()

const statuses = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
]

const groups = ref<Record<string, Task[]>>({
  pending: [],
  in_progress: [],
  done: [],
})

function rebuildGroups() {
  groups.value.pending = props.tasks.filter((t) => t.status === 'pending')
  groups.value.in_progress = props.tasks.filter((t) => t.status === 'in_progress')
  groups.value.done = props.tasks.filter((t) => t.status === 'done')
}

watch(
  () => props.tasks,
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
      <div v-for="s in statuses" :key="s.key" class="bg-transparent">
        <div class="mb-2 flex items-center justify-between">
          <h3 class="text-sm font-semibold text-text-main">{{ s.label }}</h3>
          <span class="text-xs text-text-muted">{{ groups[s.key].length }}</span>
        </div>

        <draggable
          :list="groups[s.key]"
          item-key="id"
          group="tasks"
          ghost-class="opacity-50"
          drag-class="cursor-grabbing"
          handle=".drag-handle"
          :animation="200"
          @change="(e) => onChange(e, s.key)"
        >
          <template #item="{ element }">
            <div class="mb-3">
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
    </div>
  </div>
</template>
