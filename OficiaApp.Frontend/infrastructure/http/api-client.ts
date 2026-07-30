import { ApiError } from './api-error'

const API_URL = process.env.NEXT_PUBLIC_API_URL

/**
 * Extracts a readable message from the two Api error shapes:
 * 1. `{ message: string }` — manual controller catches.
 * 2. `{ errors: { Field: string[] } }` — ValidationProblemDetails from [ApiController].
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
      'NEXT_PUBLIC_API_URL is not defined. Check .env.local (see .env.local.example).',
    )
  }

  const hasBody = options.body !== undefined
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    // Required: browser attaches the httpOnly JWT cookie even across origins.
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
