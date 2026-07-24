import { describe, it, expect, beforeEach } from 'vitest'
import { useValidation } from '@/composables/useValidation'
import { TaskStatus } from '@/types'

describe('useValidation', () => {
  let validation: ReturnType<typeof useValidation>

  beforeEach(() => {
    validation = useValidation()
  })

  // ── Title Validation ────────────────────────────────────────────────
  describe('validateTitle', () => {
    it('returns error for empty title', () => {
      expect(validation.validateTitle('')).toBe('Title is required')
    })

    it('returns error for whitespace-only title', () => {
      expect(validation.validateTitle('   ')).toBe('Title is required')
    })

    it('returns error for title shorter than 3 characters', () => {
      expect(validation.validateTitle('Hi')).toBe('Title must be at least 3 characters')
    })

    it('returns error for title longer than 100 characters', () => {
      expect(validation.validateTitle('a'.repeat(101))).toBe('Title must be at most 100 characters')
    })

    it('returns undefined for a valid title', () => {
      expect(validation.validateTitle('Fix navigation bug')).toBeUndefined()
    })

    it('returns undefined for title with exactly 3 characters', () => {
      expect(validation.validateTitle('Fix')).toBeUndefined()
    })

    it('returns undefined for title with exactly 100 characters', () => {
      expect(validation.validateTitle('a'.repeat(100))).toBeUndefined()
    })
  })

  // ── Due Date Validation ─────────────────────────────────────────────
  describe('validateDueDate', () => {
    it('returns undefined for null due date (optional)', () => {
      expect(validation.validateDueDate(null)).toBeUndefined()
    })

    it('returns undefined for done tasks regardless of date', () => {
      expect(validation.validateDueDate('2020-01-01', TaskStatus.DONE)).toBeUndefined()
    })

    it('returns error for past due date on pending task', () => {
      expect(validation.validateDueDate('2020-06-15', TaskStatus.PENDING)).toBe(
        'Due date must be today or in the future',
      )
    })

    it('returns undefined for future date', () => {
      const future = new Date()
      future.setFullYear(future.getFullYear() + 1)
      const dateStr = future.toISOString().split('T')[0]!
      expect(validation.validateDueDate(dateStr, TaskStatus.PENDING)).toBeUndefined()
    })

    it('returns error for invalid date format', () => {
      expect(validation.validateDueDate('not-a-date')).toBe('Invalid date format')
    })
  })

  // ── Description Validation ──────────────────────────────────────────
  describe('validateDescription', () => {
    it('returns undefined for empty description (optional)', () => {
      expect(validation.validateDescription('')).toBeUndefined()
    })

    it('returns error for description over 500 characters', () => {
      expect(validation.validateDescription('a'.repeat(501))).toBe(
        'Description must be at most 500 characters',
      )
    })

    it('returns undefined for description with exactly 500 characters', () => {
      expect(validation.validateDescription('a'.repeat(500))).toBeUndefined()
    })
  })

  // ── Full Form Validation ────────────────────────────────────────────
  describe('validate (full form)', () => {
    it('returns true for a valid form', () => {
      const isValid = validation.validate({
        title: 'Valid Task Title',
        description: 'Some description',
        status: TaskStatus.PENDING,
        dueDate: null,
      })
      expect(isValid).toBe(true)
      expect(Object.keys(validation.errors.value)).toHaveLength(0)
    })

    it('returns false and populates errors for invalid form', () => {
      const isValid = validation.validate({
        title: '',
        description: 'a'.repeat(600),
        status: TaskStatus.PENDING,
        dueDate: '2000-01-01',
      })
      expect(isValid).toBe(false)
      expect(validation.errors.value.title).toBeDefined()
      expect(validation.errors.value.description).toBeDefined()
      expect(validation.errors.value.dueDate).toBeDefined()
    })

    it('isValid computed reflects error state', () => {
      expect(validation.isValid.value).toBe(true)
      validation.validate({ title: '' })
      expect(validation.isValid.value).toBe(false)
    })

    it('clearErrors removes all errors', () => {
      validation.validate({ title: '' })
      expect(Object.keys(validation.errors.value).length).toBeGreaterThan(0)
      validation.clearErrors()
      expect(Object.keys(validation.errors.value)).toHaveLength(0)
    })

    it('clearError removes a specific field error', () => {
      validation.validate({ title: '', description: 'a'.repeat(600) })
      expect(validation.errors.value.title).toBeDefined()
      expect(validation.errors.value.description).toBeDefined()
      validation.clearError('title')
      expect(validation.errors.value.title).toBeUndefined()
      expect(validation.errors.value.description).toBeDefined()
    })
  })
})
