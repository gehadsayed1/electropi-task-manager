<script setup lang="ts">
import { computed, toRefs } from 'vue'

interface Props {
  percentage: number
  size?: number
  strokeWidth?: number
  color?: string
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 80,
  strokeWidth: 8,
  color: undefined,
  animate: true,
})

const { percentage, size, strokeWidth, color, animate } = toRefs(props)

const radius = computed(() => (size.value - strokeWidth.value) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value - (percentage.value / 100) * circumference.value)
const center = computed(() => size.value / 2)
</script>

<template>
  <div class="relative inline-flex items-center justify-center">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="rotate-[-90deg]"
    >
      <defs>
        <filter id="ring-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.08" />
        </filter>
      </defs>

      <!-- track -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--progress-track, #edf2f7)"
        :stroke-width="strokeWidth"
      />

      <!-- progress -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="color || 'currentColor'"
        class="progress-ring-circle"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :style="{ transition: animate ? 'stroke-dashoffset 600ms cubic-bezier(.2,.9,.2,1), stroke 300ms' : 'none', filter: 'url(#ring-shadow)' }"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-lg font-bold text-text-main leading-none">
        {{ percentage }}%
      </span>
      <span class="text-[9px] text-text-muted mt-0.5">done</span>
    </div>
  </div>
</template>
