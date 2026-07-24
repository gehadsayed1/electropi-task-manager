import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { TaskStatus } from '@/types'
import TaskCard from '@/components/TaskCard.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push,
  }),
}))

const baseTask = {
  id: 'task-1',
  title: 'Design onboarding flow',
  description: 'Create a polished first-run experience for new users.',
  status: TaskStatus.PENDING,
  dueDate: '2026-07-25',
  createdAt: '2026-07-24T10:00:00.000Z',
  updatedAt: '2026-07-24T10:00:00.000Z',
}

describe('TaskCard', () => {
  beforeEach(() => {
    push.mockReset()
  })

  it('opens the task detail and emits edit/delete actions on touch interactions', async () => {
    const wrapper = mount(TaskCard, {
      props: { task: baseTask },
    })

    await wrapper.find('article').trigger('pointerup', { pointerType: 'touch' })
    expect(push).toHaveBeenCalledWith({
      name: 'TaskDetail',
      params: { id: baseTask.id },
    })

    await wrapper.find('#edit-task-task-1').trigger('pointerup', { pointerType: 'touch' })
    expect(wrapper.emitted('edit')?.[0]?.[0]).toEqual(baseTask)

    await wrapper.find('#delete-task-task-1').trigger('pointerup', { pointerType: 'touch' })
    expect(wrapper.emitted('delete')?.[0]?.[0]).toEqual(baseTask)
  })
})
