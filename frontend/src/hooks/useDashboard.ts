import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, DashboardData } from '../types';

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const { data } = await api.get<ApiResponse<DashboardData>>('/v1/admin/dashboard');
      return data.data!;
    },
    refetchInterval: 60000, // Refresh every minute
  });
}
