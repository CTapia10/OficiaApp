/**
 * Typed error for non-OK HTTP responses. Lets UI distinguish 401 vs 500
 * without parsing strings.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
