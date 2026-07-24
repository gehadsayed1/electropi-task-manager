<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  bordered?: boolean
}

withDefaults(defineProps<Props>(), {
  padding: 'md',
  hoverable: false,
  bordered: true,
})
</script>

<template>
  <div
    :class="[
      'bg-white dark:bg-[#1A1A1E] rounded-2xl transition-all duration-200',
      bordered ? 'border border-[#E5E7EB] dark:border-[#2A2A30]' : '',
      hoverable
        ? 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
        : 'shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]',
      {
        'p-0': padding === 'none',
        'p-4': padding === 'sm',
        'p-5': padding === 'md',
        'p-6': padding === 'lg',
      },
    ]"
  >
    <slot />
  </div>
</template>
