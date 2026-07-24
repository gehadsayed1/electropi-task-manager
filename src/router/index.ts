import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/HomePage.vue'),
    meta: { title: 'Home – ElectroPi Task Manager' },
  },
  {
    path: '/task/:id',
    name: 'TaskDetail',
    component: () => import('@/pages/TaskDetailPage.vue'),
    meta: { title: 'Task Details – ElectroPi Task Manager' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404 Not Found – ElectroPi Task Manager' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to) => {
  const title = to.meta.title as string | undefined
  if (title) document.title = title
})
