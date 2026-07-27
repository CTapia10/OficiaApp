import { ApiError } from './api-error'

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Extrae un mensaje legible de las dos formas de error que devuelve la Api:
 * 1. `{ message: string }` — los `catch` manuales de los controllers.
 * 2. `{ errors: { Campo: string[] } }` — ValidationProblemDetails automático
 *    de [ApiController] cuando falla una DataAnnotation (ver RegisterUserDto).
 */
function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object') {
    if ('message' in body && typeof body.message === 'string') {
      return body.message
    }
    if ('errors' in body && body.errors && typeof body.errors === 'object') {
      const firstError = Object.values(body.errors as Record<string, string[]>)[0]
      if (firstError?.[0]) return firstError[0]
    }
  }
  return fallback
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) {
    throw new Error(
      'NEXT_PUBLIC_API_URL no está definida. Revisá tu archivo .env.local (ver .env.local.example).',
    )
  }

  const hasBody = options.body !== undefined
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    // Imprescindible: le dice al navegador que adjunte la cookie httpOnly con
    // el JWT en este request, aunque Api y Frontend sean orígenes distintos.
    credentials: 'include',
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(response.status, extractErrorMessage(body, response.statusText))
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
