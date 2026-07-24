<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'

interface Props {
  modelValue: string
  placeholder?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Search tasks...',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const localValue = ref('')

const emitDebounced = useDebounceFn((val: string) => {
  emit('update:modelValue', val)
}, 350)

function onInput(e: Event): void {
  const val = (e.target as HTMLInputElement).value
  localValue.value = val
  emitDebounced(val)
}

function clear(): void {
  localValue.value = ''
  emit('update:modelValue', '')
}

watch(
  () => '',
  () => {
    localValue.value = ''
  },
)
</script>

<template>
  <div class="relative">
    <svg
      class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      id="task-search-input"
      :value="localValue"
      type="search"
      :placeholder="placeholder"
      class="w-full h-10 pl-10 pr-9 text-sm bg-surface border border-border rounded-xl text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
      @input="onInput"
    />
    <Transition name="fade">
      <button
        v-if="localValue"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-border text-text-muted hover:bg-text-muted/20 transition-colors cursor-pointer"
        aria-label="Clear search"
        @click="clear"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </Transition>
  </div>
</template>
