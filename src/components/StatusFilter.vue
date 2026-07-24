<script setup lang="ts">
import type { FilterOption } from '@/types'
import { FILTER_OPTIONS } from '@/constants'

interface Props {
  modelValue: FilterOption
}

defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: FilterOption]
}>()
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter tasks by status">
    <button
      v-for="option in FILTER_OPTIONS"
      :id="`filter-${option.value}`"
      :key="option.value"
      :class="[
        'h-9 px-3.5 text-xs font-medium rounded-xl border transition-all duration-200 cursor-pointer',
        modelValue === option.value
          ? 'bg-primary border-primary text-white shadow-sm'
          : 'bg-border/50 border-border text-text-muted hover:border-text-muted/60 hover:text-text-main hover:bg-border',
      ]"
      :aria-pressed="modelValue === option.value"
      @click="emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
