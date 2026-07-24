<script setup lang="ts">
import { TaskStatus } from '@/types'

interface Props {
  status: TaskStatus
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
})

const statusConfig: Record<TaskStatus, { label: string; class: string; dot: string }> = {
  [TaskStatus.PENDING]: {
    label: 'Pending',
    class: 'bg-warning-light text-warning-text',
    dot: 'bg-warning',
  },
  [TaskStatus.IN_PROGRESS]: {
    label: 'In Progress',
    class: 'bg-info-light text-info-text',
    dot: 'bg-info',
  },
  [TaskStatus.DONE]: {
    label: 'Done',
    class: 'bg-success-light text-success-text',
    dot: 'bg-success',
  },
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-medium rounded-full',
      statusConfig[status].class,
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
    ]"
  >
    <span :class="['rounded-full shrink-0', statusConfig[status].dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2']" />
    {{ statusConfig[status].label }}
  </span>
</template>
