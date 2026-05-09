import client from './client'
import type { CreateOrgPayload, Organization } from '../types'

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const organizationApi = {
  create: (payload: CreateOrgPayload) =>
    client.post<any, ApiResponse<{ orgId: string, reportId: string }>>(
      '/organizations', payload
    ),
  getById: (id: string) =>
    client.get<any, ApiResponse<Organization>>(`/organizations/${id}`)
}
