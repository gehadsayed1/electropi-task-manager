import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { nextTick } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { TaskStatus } from '@/types'
import type { TaskFormData } from '@/types'

// Mock taskService to avoid network calls
vi.mock('@/services/taskService', () => ({
  taskService: {
    fetchTasks: vi.fn().mockResolvedValue([
      {
        id: '1',
        title: 'Test Task One',
        description: 'First task description',
        status: 'pending',
        dueDate: '2027-01-15',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Test Task Two',
        description: 'Second task description',
        status: 'in_progress',
        dueDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Test Task Three',
        description: 'Third task description',
        status: 'done',
        dueDate: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]),
  },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(global, 'localStorage', { value: localStorageMock })
Object.defineProperty(global, 'window', { value: { localStorage: localStorageMock } })

describe('Task Store', () => {
  beforeEach(() => {
    localStorageMock.clear()
    setActivePinia(createPinia())
  })

  it('initializes with empty state', () => {
    const store = useTaskStore()
    expect(store.tasks).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.search).toBe('')
    expect(store.filter).toBe('all')
    expect(store.sort).toBe('newest')
  })

  it('fetches tasks and populates store', async () => {
    const store = useTaskStore()
    await store.fetchTasks()
    expect(store.tasks).toHaveLength(3)
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('creates a new task', () => {
    const store = useTaskStore()
    const formData: TaskFormData = {
      title: 'New Task',
      description: 'Task description',
      status: TaskStatus.PENDING,
      dueDate: '2027-06-01',
    }
    const task = store.createTask(formData)
    expect(task.title).toBe('New Task')
    expect(task.status).toBe(TaskStatus.PENDING)
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0]?.id).toBe(task.id)
  })

  it('creates task with trimmed title', () => {
    const store = useTaskStore()
    const task = store.createTask({
      title: '  Trimmed Title  ',
      description: '',
      status: TaskStatus.PENDING,
      dueDate: null,
    })
    expect(task.title).toBe('Trimmed Title')
  })

  it('updates an existing task', () => {
    const store = useTaskStore()
    const created = store.createTask({
      title: 'Original',
      description: '',
      status: TaskStatus.PENDING,
      dueDate: null,
    })
    const updated = store.updateTask(created.id, { title: 'Updated', status: TaskStatus.DONE })
    expect(updated).not.toBeNull()
    expect(updated?.title).toBe('Updated')
    expect(updated?.status).toBe(TaskStatus.DONE)
    expect(store.tasks[0]?.title).toBe('Updated')
  })

  it('returns null when updating non-existent task', () => {
    const store = useTaskStore()
    const result = store.updateTask('non-existent-id', { title: 'Test' })
    expect(result).toBeNull()
  })

  it('deletes a task by id', () => {
    const store = useTaskStore()
    const t1 = store.createTask({ title: 'Task 1', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.createTask({ title: 'Task 2', description: '', status: TaskStatus.PENDING, dueDate: null })
    expect(store.tasks).toHaveLength(2)
    const result = store.deleteTask(t1.id)
    expect(result).toBe(true)
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks.find((t) => t.id === t1.id)).toBeUndefined()
  })

  it('returns false when deleting non-existent task', () => {
    const store = useTaskStore()
    expect(store.deleteTask('ghost-id')).toBe(false)
  })

  it('filters tasks by status', () => {
    const store = useTaskStore()
    store.createTask({ title: 'Pending Task', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.createTask({ title: 'Done Task', description: '', status: TaskStatus.DONE, dueDate: null })
    store.setFilter(TaskStatus.PENDING)
    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0]?.status).toBe(TaskStatus.PENDING)
  })

  it('searches tasks by title', () => {
    const store = useTaskStore()
    store.createTask({ title: 'Fix the bug', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.createTask({ title: 'Write tests', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.setSearch('bug')
    expect(store.filteredTasks).toHaveLength(1)
    expect(store.filteredTasks[0]?.title).toBe('Fix the bug')
  })

  it('computes correct statistics', () => {
    const store = useTaskStore()
    store.createTask({ title: 'T1', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.createTask({ title: 'T2', description: '', status: TaskStatus.IN_PROGRESS, dueDate: null })
    store.createTask({ title: 'T3', description: '', status: TaskStatus.DONE, dueDate: null })
    store.createTask({ title: 'T4', description: '', status: TaskStatus.DONE, dueDate: null })

    const stats = store.statistics
    expect(stats.total).toBe(4)
    expect(stats.pending).toBe(1)
    expect(stats.inProgress).toBe(1)
    expect(stats.completed).toBe(2)
    expect(stats.completedPercentage).toBe(50)
  })

  it('persists tasks to localStorage', async () => {
    const store = useTaskStore()
    store.createTask({ title: 'Persist Me', description: '', status: TaskStatus.PENDING, dueDate: null })
    await nextTick()
    const stored = localStorageMock.getItem('electropi-tasks')
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!) as unknown[]
    expect(parsed).toHaveLength(1)
  })

  it('sorts tasks alphabetically', () => {
    const store = useTaskStore()
    store.createTask({ title: 'Zebra', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.createTask({ title: 'Apple', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.createTask({ title: 'Mango', description: '', status: TaskStatus.PENDING, dueDate: null })
    store.setSort('alphabetical')
    expect(store.filteredTasks[0]?.title).toBe('Apple')
    expect(store.filteredTasks[2]?.title).toBe('Zebra')
  })

  it('getTaskById returns correct task', () => {
    const store = useTaskStore()
    const task = store.createTask({ title: 'Find Me', description: '', status: TaskStatus.PENDING, dueDate: null })
    const found = store.getTaskById(task.id)
    expect(found).toBeDefined()
    expect(found?.title).toBe('Find Me')
  })
})
