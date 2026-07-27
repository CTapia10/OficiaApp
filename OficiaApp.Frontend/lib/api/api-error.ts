/**
 * Error tipado para respuestas HTTP no exitosas. Nos permite, por ejemplo,
 * distinguir un 401 (mostrar "iniciá sesión") de un 500 (mostrar error genérico)
 * en los componentes que consumen la API, sin parsear strings.
 */
export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
