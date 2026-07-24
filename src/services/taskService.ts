import { TaskStatus } from '@/types'
import type { Task, TodoApiItem } from '@/types'
import { TASKS_LIMIT, DUMMYJSON_URL } from '@/constants'

export const taskService = {
  async fetchTasks(): Promise<Task[]> {
    // Simulate realistic loading time between 800 and 1200ms
    const delay = Math.floor(Math.random() * 401) + 800
    await new Promise((resolve) => setTimeout(resolve, delay))

    const response = await fetch(`${DUMMYJSON_URL}?limit=${TASKS_LIMIT}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.statusText}`)
    }

    const data = await response.json()
    const todos: TodoApiItem[] = data.todos

    return todos.map((todo) => {
      const now = new Date()
      // Random future date within the next 30 days
      const dueDateDays = Math.floor(Math.random() * 30) + 1
      const dueDateObj = new Date(now.getTime() + dueDateDays * 24 * 60 * 60 * 1000)
      const dueDate = dueDateObj.toISOString().split('T')[0]

      return {
        id: String(todo.id),
        title: todo.todo,
        description: '',
        status: todo.completed ? TaskStatus.DONE : TaskStatus.PENDING,
        dueDate,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      }
    })
  },
}
