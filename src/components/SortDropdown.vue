<script setup lang="ts">
import type { SortOption } from '@/types'
import { SORT_OPTIONS } from '@/constants'

interface Props {
  modelValue: SortOption
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: SortOption]
}>()

function onChange(e: Event): void {
  emit('update:modelValue', (e.target as HTMLSelectElement).value as SortOption)
}
</script>

<template>
  <div class="relative">
    <svg
      class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
      />
    </svg>
    <select
      id="sort-dropdown"
      :value="modelValue"
      class="h-9 pl-9 pr-8 text-xs font-medium appearance-none cursor-pointer bg-surface border border-border rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
      aria-label="Sort tasks"
      @change="onChange"
    >
      <option v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <svg
      class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</template>
