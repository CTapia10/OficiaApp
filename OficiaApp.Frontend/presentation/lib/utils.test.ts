import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('lets the last conflicting Tailwind class win (tailwind-merge behavior)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('drops falsy values (clsx behavior)', () => {
    expect(cn('text-sm', false && 'hidden', undefined, null, 'font-bold')).toBe(
      'text-sm font-bold',
    )
  })
})
