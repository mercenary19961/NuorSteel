import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { Setting } from '../types';

export function useSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data } = await api.get('/admin/settings');
      return data.data as Record<string, Setting[]>;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: { key: string; value: string }[]) => {
      const { data } = await api.put('/admin/settings', { settings });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
    },
  });
}
