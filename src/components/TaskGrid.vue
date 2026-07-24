<script setup lang="ts">
import { computed } from 'vue'
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

const hasSearch = computed(() => !!store.search.trim())
const hasFilter = computed(() => store.filter !== 'all')

const emptyIcon = computed(() => (hasSearch.value || hasFilter.value ? 'search' : 'empty'))
const emptyTitle = computed(() => {
  if (hasSearch.value) return 'No tasks match your search'
  if (hasFilter.value) return 'No tasks with this status'
  return 'No tasks yet'
})
const emptyMessage = computed(() => {
  if (hasSearch.value || hasFilter.value)
    return "Try adjusting your search or filter to find what you're looking for."
  return 'Create your first task to start tracking your progress.'
})

// Local writable computed for vuedraggable
const localTasks = computed({
  get: () => props.tasks,
  set: (newFilteredOrder: Task[]) => {
    // If the list is exactly the full list (no filters, 'newest' sort maybe), we can just replace
    if (!hasSearch.value && !hasFilter.value && store.sort === 'newest') {
      store.reorderTasks(newFilteredOrder)
      return
    }
    
    // Otherwise, figure out a basic reorder based on the new array
    // A robust way to do this with filtered lists is to update the master array 
    // by moving the dragged item.
    // For simplicity, we can tell the store to update the full array 
    // based on the new relative order of the filtered items.
    store.reorderTasksPartially(newFilteredOrder)
  }
})

</script>

<template>
  <div>
    <draggable
      v-if="props.tasks.length > 0"
      v-model="localTasks"
      item-key="id"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      ghost-class="opacity-50"
      drag-class="cursor-grabbing"
      handle=".drag-handle"
      :animation="200"
    >
      <template #item="{ element }">
        <div class="h-full">
          <!-- We can wrap TaskCard in a div to provide h-full if needed, but TaskCard is already h-full -->
          <TaskCard
            :task="element"
            class="drag-handle"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </div>
      </template>
    </draggable>

    <EmptyState
      v-else
      :icon="emptyIcon"
      :title="emptyTitle"
      :message="emptyMessage"
      @action="emit('create-task')"
    />
  </div>
</template>
