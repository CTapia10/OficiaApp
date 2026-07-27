'use client'

import { useQuery } from '@tanstack/react-query'
import { jobRequestsService } from '@/lib/job-requests/job-requests-service'
import { useAuthStore } from '@/lib/auth/auth-store'

export function useOpenJobRequests() {
  const status = useAuthStore((s) => s.status)

  return useQuery({
    queryKey: ['job-requests', 'open'],
    queryFn: jobRequestsService.getOpen,
    // No tiene sentido pegarle a un endpoint [Authorize] sin sesión: ahorra un
    // 401 esperado y evita parpadear un error apenas se monta la vista.
    enabled: status === 'authenticated',
  })
}
