export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskFormData {
  title: string
  description: string
  status: TaskStatus
  dueDate: string | null
}

export type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'dueDate'
export type FilterOption = 'all' | 'new' | 'old' | TaskStatus

export interface Statistics {
  total: number
  pending: number
  inProgress: number
  completed: number
  completedPercentage: number
}

export interface TodoApiItem {
  userId: number
  id: number
  todo: string
  completed: boolean
}
