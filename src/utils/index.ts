import { TaskStatus } from '@/types'
import type { Task } from '@/types'

export function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function isOverdue(task: Task): boolean {
  if (!task.dueDate || task.status === TaskStatus.DONE) return false
  return new Date(task.dueDate) < new Date()
}

export function isDueToday(task: Task): boolean {
  if (!task.dueDate || task.status === TaskStatus.DONE) return false
  const today = new Date().toISOString().split('T')[0]
  return task.dueDate === today
}

export function isRecentlyUpdated(task: Task, thresholdMs = 3600000): boolean {
  return Date.now() - new Date(task.updatedAt).getTime() < thresholdMs
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'No due date'
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
