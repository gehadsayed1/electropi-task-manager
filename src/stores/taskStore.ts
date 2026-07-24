import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { TaskStatus } from '@/types'
import type { Task, TaskFormData, FilterOption, SortOption, Statistics } from '@/types'
import { taskService } from '@/services'
import { generateId } from '@/utils'
import { LOCAL_STORAGE_KEY } from '@/constants'

export const useTaskStore = defineStore('tasks', () => {
  
  const storedTasks = useLocalStorage<Task[]>(LOCAL_STORAGE_KEY, [])
  const tasks = ref<Task[]>(storedTasks.value)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const search = ref('')
  const filter = ref<FilterOption>('all')
  const sort = ref<SortOption>('newest')
  const taskOrder = ref<string[]>([])

  
  function syncToStorage() {
    storedTasks.value = tasks.value
  }

  
  async function fetchTasks(): Promise<void> {
    if (storedTasks.value.length > 0) {
      tasks.value = storedTasks.value
      taskOrder.value = tasks.value.map((t) => t.id)
      return
    }

    loading.value = true
    error.value = null

    try {
      const fetched = await taskService.fetchTasks()
      tasks.value = fetched
      taskOrder.value = fetched.map((t) => t.id)
      syncToStorage()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  function createTask(formData: TaskFormData): Task {
    const now = new Date().toISOString()
    const task: Task = {
      id: generateId(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      dueDate: formData.dueDate,
      createdAt: now,
      updatedAt: now,
    }
    tasks.value.unshift(task)
    taskOrder.value.unshift(task.id)
    syncToStorage()
    return task
  }

  function updateTask(id: string, formData: Partial<TaskFormData>): Task | null {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index === -1) return null

    const updated: Task = {
      ...tasks.value[index]!,
      ...formData,
      updatedAt: new Date().toISOString(),
    }
    tasks.value[index] = updated
    syncToStorage()
    return updated
  }

  function deleteTask(id: string): boolean {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index === -1) return false
    tasks.value.splice(index, 1)
    taskOrder.value = taskOrder.value.filter((tid) => tid !== id)
    syncToStorage()
    return true
  }

  function reorderTasks(newOrder: Task[]): void {
    tasks.value = newOrder
    taskOrder.value = newOrder.map((t) => t.id)
    syncToStorage()
  }

  function reorderTasksPartially(newFilteredOrder: Task[]): void {
    const indices = newFilteredOrder.map(t => tasks.value.findIndex(gt => gt.id === t.id))

    const sortedIndices = [...indices].sort((a, b) => a - b)

    const updatedTasks = [...tasks.value]

    newFilteredOrder.forEach((task, i) => {
      const slotIndex = sortedIndices[i]
      if (slotIndex !== undefined && slotIndex !== -1) {
        updatedTasks[slotIndex] = task
      }
    })

    tasks.value = updatedTasks
    taskOrder.value = updatedTasks.map(t => t.id)
    syncToStorage()
  }

  function setSearch(value: string): void {
    search.value = value
  }

  function setFilter(value: FilterOption): void {
    filter.value = value
  }

  function setSort(value: SortOption): void {
    sort.value = value
  }

  
  const filteredTasks = computed<Task[]>(() => {
    let result = [...tasks.value]

    // Filter by status
    if (filter.value !== 'all') {
      result = result.filter((t) => t.status === filter.value)
    }

    // Search by title
    if (search.value.trim()) {
      const q = search.value.toLowerCase().trim()
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
      )
    }

    // Sort
    switch (sort.value) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'dueDate':
        result.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
        break
    }

    return result
  })

  const statistics = computed<Statistics>(() => {
    const total = tasks.value.length
    const pending = tasks.value.filter((t) => t.status === TaskStatus.PENDING).length
    const inProgress = tasks.value.filter((t) => t.status === TaskStatus.IN_PROGRESS).length
    const completed = tasks.value.filter((t) => t.status === TaskStatus.DONE).length
    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, pending, inProgress, completed, completedPercentage }
  })

  const getTaskById = computed(() => (id: string) => tasks.value.find((t) => t.id === id))

  return {
    tasks,
    loading,
    error,
    search,
    filter,
    sort,
    
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    reorderTasksPartially,
    setSearch,
    setFilter,
    setSort,
    
    filteredTasks,
    statistics,
    getTaskById,
  }
})
