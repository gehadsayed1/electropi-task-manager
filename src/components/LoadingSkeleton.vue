<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 6,
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <div
      v-for="i in count"
      :key="i"
      class="bg-surface rounded-2xl border border-border p-5 space-y-3"
    >
      <div class="flex items-start justify-between">
        <div class="w-20 h-5 bg-border rounded-full skeleton-pulse" />
        <div class="flex gap-1">
          <div class="w-7 h-7 bg-border rounded-lg skeleton-pulse" />
          <div class="w-7 h-7 bg-border rounded-lg skeleton-pulse" />
        </div>
      </div>
      <div class="space-y-2">
        <div class="w-full h-4 bg-border rounded skeleton-pulse" />
        <div class="w-3/4 h-4 bg-border rounded skeleton-pulse" />
      </div>
      <div class="space-y-1.5">
        <div class="w-full h-3 bg-border rounded skeleton-pulse" />
        <div class="w-2/3 h-3 bg-border rounded skeleton-pulse" />
      </div>
      <div class="pt-2 border-t border-border flex justify-between">
        <div class="w-24 h-3 bg-border rounded skeleton-pulse" />
        <div class="w-14 h-3 bg-border rounded skeleton-pulse" />
      </div>
    </div>
  </div>
</template>
