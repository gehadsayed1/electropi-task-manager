import { computed } from 'vue'
import { useTaskStore } from '@/stores'
import type { Task, TaskFormData } from '@/types'

export function useTasks() {
  const store = useTaskStore()

  const tasks = computed(() => store.tasks)
  const filteredTasks = computed(() => store.filteredTasks)
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)
  const statistics = computed(() => store.statistics)
  const search = computed(() => store.search)
  const filter = computed(() => store.filter)
  const sort = computed(() => store.sort)

  function getTaskById(id: string): Task | undefined {
    return store.getTaskById(id)
  }

  async function fetchTasks(): Promise<void> {
    await store.fetchTasks()
  }

  function createTask(formData: TaskFormData): Task {
    return store.createTask(formData)
  }

  function updateTask(id: string, formData: Partial<TaskFormData>): Task | null {
    return store.updateTask(id, formData)
  }

  function deleteTask(id: string): boolean {
    return store.deleteTask(id)
  }

  return {
    tasks,
    filteredTasks,
    loading,
    error,
    statistics,
    search,
    filter,
    sort,
    getTaskById,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setSearch: store.setSearch,
    setFilter: store.setFilter,
    setSort: store.setSort,
    reorderTasks: store.reorderTasks,
  }
}
