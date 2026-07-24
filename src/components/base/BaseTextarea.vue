<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  id?: string
  required?: boolean
  rows?: number
  maxlength?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onInput(e: Event): void {
  emit('update:modelValue', (e.target as HTMLTextAreaElement).value)
}
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <div class="flex items-center justify-between">
      <label
        v-if="label"
        :for="props.id"
        class="text-sm font-medium text-text-main"
      >
        {{ label }}
        <span v-if="required" class="text-danger ml-0.5">*</span>
      </label>
      <span
        v-if="maxlength"
        class="text-xs text-text-muted"
      >
        {{ modelValue.length }}/{{ maxlength }}
      </span>
    </div>
    <textarea
      :id="props.id"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxlength"
      :class="[
        'w-full px-3.5 py-2.5 text-sm rounded-xl border transition-all duration-200 resize-none',
        'bg-surface text-text-main',
        'placeholder:text-text-muted',
        'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        error
          ? 'border-danger focus:ring-danger/20'
          : 'border-border',
      ]"
      @input="onInput"
    />
    <Transition name="fade">
      <p v-if="error" class="text-xs text-danger flex items-center gap-1">
        <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        {{ error }}
      </p>
    </Transition>
  </div>
</template>
