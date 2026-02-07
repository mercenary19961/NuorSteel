import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, TimelineEvent } from '../types';

export function useTimeline() {
  return useQuery({
    queryKey: ['admin', 'timeline'],
    queryFn: async (): Promise<TimelineEvent[]> => {
      const { data } = await api.get<ApiResponse<TimelineEvent[]>>('/admin/timeline');
      return data.data!;
    },
  });
}

export function useCreateTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      year: string;
      title_en: string;
      title_ar: string;
      description_en: string;
      description_ar: string;
      image_id?: number | null;
      sort_order?: number;
    }) => {
      const { data } = await api.post<ApiResponse<TimelineEvent>>('/admin/timeline', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'timeline'] });
    },
  });
}

export function useUpdateTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: number;
      year: string;
      title_en: string;
      title_ar: string;
      description_en: string;
      description_ar: string;
      image_id?: number | null;
      sort_order?: number;
    }) => {
      const { data } = await api.put<ApiResponse<TimelineEvent>>(`/admin/timeline/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'timeline'] });
    },
  });
}

export function useDeleteTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/admin/timeline/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'timeline'] });
    },
  });
}

export function useReorderTimeline() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: number[]) => {
      const { data } = await api.post<ApiResponse<null>>('/admin/timeline/reorder', { order });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'timeline'] });
    },
  });
}
