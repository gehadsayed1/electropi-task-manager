import { computed, ref } from 'vue'
import type { TaskFormData } from '@/types'
import { TaskStatus } from '@/types'

export interface ValidationErrors {
  title?: string
  dueDate?: string
  description?: string
}

export function useValidation() {
  const errors = ref<ValidationErrors>({})

  function validateTitle(title: string): string | undefined {
    if (!title || !title.trim()) return 'Title is required'
    if (title.trim().length < 3) return 'Title must be at least 3 characters'
    if (title.trim().length > 100) return 'Title must be at most 100 characters'
    return undefined
  }

  function validateDueDate(dueDate: string | null, status?: TaskStatus): string | undefined {
    if (!dueDate) return undefined
    if (status === TaskStatus.DONE) return undefined

    const due = new Date(dueDate)
    if (Number.isNaN(due.getTime())) return 'Invalid date format'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (due < today) return 'Due date must be today or in the future'

    return undefined
  }

  function validateDescription(description: string): string | undefined {
    if (description.length > 500) return 'Description must be at most 500 characters'
    return undefined
  }

  function validate(formData: Partial<TaskFormData>): boolean {
    errors.value = {}

    const titleError = validateTitle(formData.title ?? '')
    if (titleError) errors.value.title = titleError

    const dueDateError = validateDueDate(formData.dueDate ?? null, formData.status)
    if (dueDateError) errors.value.dueDate = dueDateError

    const descriptionError = validateDescription(formData.description ?? '')
    if (descriptionError) errors.value.description = descriptionError

    return Object.keys(errors.value).length === 0
  }

  function clearErrors(): void {
    errors.value = {}
  }

  function clearError(field: keyof ValidationErrors): void {
    delete errors.value[field]
  }

  const isValid = computed(() => Object.keys(errors.value).length === 0)

  return {
    errors,
    isValid,
    validate,
    validateTitle,
    validateDueDate,
    validateDescription,
    clearErrors,
    clearError,
  }
}
