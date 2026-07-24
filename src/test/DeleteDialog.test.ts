import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import DeleteDialog from '@/components/DeleteDialog.vue'
import { TaskStatus } from '@/types'

const task = {
  id: 'task-1',
  title: 'Draft launch plan',
  description: 'Prepare release communications.',
  status: TaskStatus.PENDING,
  dueDate: '2026-07-25',
  createdAt: '2026-07-24T10:00:00.000Z',
  updatedAt: '2026-07-24T10:00:00.000Z',
}

describe('DeleteDialog', () => {
  it('renders theme-aware content and actions', () => {
    const wrapper = mount(DeleteDialog, {
      props: { task },
    })

    expect(wrapper.find('.bg-surface').exists()).toBe(true)
    expect(wrapper.find('.text-text-main').exists()).toBe(true)
    expect(wrapper.find('.text-text-muted').exists()).toBe(true)
    expect(wrapper.find('#confirm-delete-btn').exists()).toBe(true)
  })
})
