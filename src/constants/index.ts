import { TaskStatus } from '@/types'
import type { FilterOption, SortOption } from '@/types'

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'alphabetical', label: 'Alphabetical' },
  { value: 'dueDate', label: 'Due Date' },
]

export const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: TaskStatus.PENDING, label: 'Pending' },
  { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
  { value: TaskStatus.DONE, label: 'Done' },
]

export const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  done: 'Done',
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'warning',
  in_progress: 'info',
  done: 'success',
}

export const DUMMYJSON_URL = 'https://dummyjson.com/todos'
export const LOCAL_STORAGE_KEY = 'electropi-tasks'
export const THEME_STORAGE_KEY = 'electropi-theme'
export const TASKS_LIMIT = 20

export const RECENTLY_UPDATED_THRESHOLD_MS = 60 * 60 * 1000 // 1 hour
