import { ref, watch } from 'vue'

export function useLocalStorageComposable<T>(key: string, defaultValue: T) {
  const stored = localStorage.getItem(key)
  const value = ref<T>(stored ? (JSON.parse(stored) as T) : defaultValue)

  watch(
    value,
    (newVal) => {
      localStorage.setItem(key, JSON.stringify(newVal))
    },
    { deep: true },
  )

  function remove(): void {
    localStorage.removeItem(key)
    value.value = defaultValue
  }

  return { value, remove }
}
