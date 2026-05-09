import client from './client'
import type { FullReport, ReportStatus } from '../types'
import type { ApiResponse } from './organizations'

export const reportApi = {
  create: (data: any) => 
    client.post<any, ApiResponse<any>>('/organizations', data),

  getById: (reportId: string) =>
    client.get<any, ApiResponse<FullReport>>(`/reports/${reportId}`),

  getStatus: (reportId: string) =>
    client.get<any, ApiResponse<ReportStatus>>(`/reports/${reportId}/status`),

  getSummary: (reportId: string) =>
    client.get<any, ApiResponse<any>>(`/reports/${reportId}/summary`),

  getProgress: (reportId: string) =>
    client.get<any, ApiResponse<any>>(`/crawler/progress/${reportId}`)
}
