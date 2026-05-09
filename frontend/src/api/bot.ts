import client from './client'
import type { ExecutionContent, BotStats } from '../types'
import type { ApiResponse } from './organizations'

export const botApi = {
  generatePlan: (reportId: string) =>
    client.post<any, ApiResponse<any>>(`/bot/generate/${reportId}`),

  getPlan: (reportId: string) =>
    client.get<any, ApiResponse<{ executionAssistant: any[] }>>(`/bot/plan/${reportId}`),

  getStats: (reportId: string) =>
    client.get<any, ApiResponse<BotStats>>(`/bot/stats/${reportId}`),

  updateContent: (contentId: string, content: string) =>
    client.put<any, ApiResponse<ExecutionContent>>(
      `/bot/content/${contentId}`, { content }
    ),

  approveContent: (contentId: string) =>
    client.post<any, ApiResponse<ExecutionContent>>(
      `/bot/content/${contentId}/approve`
    ),

  rejectContent: (contentId: string, reason?: string) =>
    client.post<any, ApiResponse<ExecutionContent>>(
      `/bot/content/${contentId}/reject`, { reason }
    ),

  regenerateContent: (contentId: string) =>
    client.post<any, ApiResponse<ExecutionContent>>(
      `/bot/content/${contentId}/regenerate`
    ),

  getApproved: (reportId: string) =>
    client.get<any, ApiResponse<ExecutionContent[]>>(
      `/bot/approved/${reportId}`
    )
}
