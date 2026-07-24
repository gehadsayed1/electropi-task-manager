<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: string
}

const {
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
} = defineProps<Props>()

const variantClasses: Record<string, string> = {
  primary:
    'bg-[#111827] hover:bg-[#374151] dark:bg-[#F9FAFB] dark:hover:bg-[#E5E7EB] dark:text-[#111827] text-white shadow-sm hover:shadow-md active:scale-[0.98]',
  secondary:
    'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#374151] dark:bg-[#1F2937] dark:hover:bg-[#374151] dark:text-[#F3F4F6]',
  danger:
    'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm hover:shadow-md active:scale-[0.98]',
  ghost:
    'bg-transparent hover:bg-[#F3F4F6] text-[#6B7280] hover:text-[#111827] dark:hover:bg-[#1F2937] dark:text-[#9CA3AF] dark:hover:text-[#F9FAFB]',
  outline:
    'bg-transparent border border-[#E5E7EB] hover:border-[#D1D5DB] text-[#374151] hover:text-[#111827] dark:border-[#374151] dark:text-[#F3F4F6] dark:hover:border-[#4B5563]',
}

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 cursor-pointer select-none touch-manipulation',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      variantClasses[variant],
      sizeClasses[size],
    ]"
  >
    <svg
      v-if="loading"
      class="animate-spin"
      :class="size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
    <slot />
  </button>
</template>
