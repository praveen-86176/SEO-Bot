import client from './client'
import type { Recommendation } from '../types'
import type { ApiResponse } from './organizations'

export const recommendationApi = {
  getAll: (reportId: string, filters?: {
    category?: string
    priority?: string
    effort?: string
  }) =>
    client.get<any, ApiResponse<{ recommendations: Recommendation[], meta: any }>>(
      `/recommendations/${reportId}`,
      { params: filters }
    ),

  getSummary: (reportId: string) =>
    client.get<any, ApiResponse<any>>(`/recommendations/${reportId}/summary`)
}
