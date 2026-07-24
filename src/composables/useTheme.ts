import { ref, watch } from 'vue'
import { THEME_STORAGE_KEY } from '@/constants'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  const theme = ref<Theme>(stored ?? 'light')

  function applyTheme(t: Theme) {
    if (t === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(THEME_STORAGE_KEY, t)
  }

  function toggleTheme(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setTheme(t: Theme): void {
    theme.value = t
  }

  watch(theme, applyTheme, { immediate: true })

  return { theme, toggleTheme, setTheme }
}
