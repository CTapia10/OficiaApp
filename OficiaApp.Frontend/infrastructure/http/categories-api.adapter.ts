import type { CategoriesApiPort } from '@/application/ports/out/categories-api.port'
import type { Category } from '@/domain/categories/types'
import { apiFetch } from './api-client'

export const categoriesApi: CategoriesApiPort = {
  getAll(): Promise<Category[]> {
    return apiFetch<Category[]>('/api/categories')
  },
}
