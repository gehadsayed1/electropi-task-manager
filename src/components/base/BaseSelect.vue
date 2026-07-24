<script setup lang="ts">
interface SelectOption {
  value: string
  label: string
}

interface Props {
  modelValue: string
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  id?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onChange(e: Event): void {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label"
      :for="props.id"
      class="text-sm font-medium text-text-main"
    >
      {{ label }}
      <span v-if="required" class="text-danger ml-0.5">*</span>
    </label>
    <div class="relative">
      <select
        :id="props.id"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="[
          'w-full h-10 pl-3.5 pr-9 text-sm rounded-xl border appearance-none transition-all duration-200 cursor-pointer',
          'bg-surface text-text-main',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error
            ? 'border-danger'
            : 'border-border',
        ]"
        @change="onChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      <svg
        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
    <Transition name="fade">
      <p v-if="error" class="text-xs text-danger">{{ error }}</p>
    </Transition>
  </div>
</template>
