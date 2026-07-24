<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: number | string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
})

const dotColor = computed(() => {
  switch (props.color) {
    case 'success': return 'bg-success'
    case 'warning': return 'bg-warning'
    case 'danger': return 'bg-danger'
    case 'info': return 'bg-info'
    default: return 'bg-text-muted' // neutral dot for total
  }
})
</script>

<template>
  <div class="shrink-0 min-w-[120px] bg-surface rounded-xl border border-border px-4 py-3 flex flex-col justify-center">
    <div class="flex items-center gap-1.5 mb-1">
      <div :class="['w-1.5 h-1.5 rounded-full', dotColor]"></div>
      <p class="text-xs font-medium text-text-muted">{{ title }}</p>
    </div>
    <p class="text-lg font-semibold text-text-main">{{ value }}</p>
  </div>
</template>
