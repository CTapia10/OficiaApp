import { apiFetch } from '@/lib/api/api-client'
import type { Category } from './types'

export const categoriesService = {
  getAll(): Promise<Category[]> {
    return apiFetch<Category[]>('/api/categories')
  },
}
