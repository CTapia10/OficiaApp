import { apiFetch } from '@/lib/api/api-client'
import type { JobRequestResponse } from './types'

export const jobRequestsService = {
  // Requiere sesión: la Api expone este endpoint bajo [Authorize] a nivel de
  // controller (es la bolsa de trabajo B2B, exclusiva para usuarios logueados).
  getOpen(): Promise<JobRequestResponse[]> {
    return apiFetch<JobRequestResponse[]>('/api/job-requests/open')
  },
}
