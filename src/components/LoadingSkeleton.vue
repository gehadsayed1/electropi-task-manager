<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 6,
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="relative bg-surface rounded-[24px] border border-border p-5 h-[240px] flex flex-col shadow-card overflow-hidden"
    >
      <!-- top-right triangle placeholder -->
      <div class="absolute top-0 right-0 overflow-hidden pointer-events-none">
        <div class="w-0 h-0 border-l-[48px] border-b-[48px] border-l-transparent border-b-transparent bg-transparent"></div>
        <div class="absolute -top-[48px] right-0 block w-0 h-0 border-l-[48px] border-b-[48px] border-l-transparent"
             :class="['bg-border']" />
      </div>

      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="w-28 h-5 bg-border rounded-full skeleton-pulse" />
        <div class="flex gap-2">
          <div class="w-9 h-9 bg-border rounded-full skeleton-pulse" />
          <div class="w-9 h-9 bg-border rounded-full skeleton-pulse" />
        </div>
      </div>

      <div class="mb-3 flex-1 overflow-hidden">
        <div class="w-full h-4 bg-border rounded skeleton-pulse mb-2" />
        <div class="w-full h-4 bg-border rounded skeleton-pulse mb-2" />
        <div class="w-3/4 h-4 bg-border rounded skeleton-pulse" />
      </div>

      <div class="mt-auto pt-3 border-t border-border flex items-center justify-between">
        <div class="inline-flex items-center gap-2">
          <div class="w-5 h-3 bg-border rounded skeleton-pulse" />
          <div class="w-2.5 h-2.5 bg-border rounded-full skeleton-pulse" />
        </div>

        <div class="flex items-center gap-2">
          <div class="w-9 h-9 bg-border rounded-full skeleton-pulse" />
          <div class="w-9 h-9 bg-border rounded-full skeleton-pulse" />
        </div>
      </div>
    </div>
  </div>
</template>
