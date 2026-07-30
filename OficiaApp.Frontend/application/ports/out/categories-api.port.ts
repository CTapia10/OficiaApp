import type { Category } from '@/domain/categories/types'

export interface CategoriesApiPort {
  getAll(): Promise<Category[]>
}
