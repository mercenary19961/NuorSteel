import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, SiteContent } from '../types';

export function useContent() {
  return useQuery({
    queryKey: ['admin', 'content'],
    queryFn: async (): Promise<Record<string, SiteContent[]>> => {
      const { data } = await api.get<ApiResponse<Record<string, SiteContent[]>>>('/admin/content');
      return data.data!;
    },
  });
}

export function useContentByPage(page: string) {
  return useQuery({
    queryKey: ['admin', 'content', page],
    queryFn: async (): Promise<Record<string, SiteContent[]>> => {
      const { data } = await api.get<ApiResponse<Record<string, SiteContent[]>>>(
        `/admin/content/${page}`,
      );
      return data.data!;
    },
    enabled: !!page,
  });
}

export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: number; content_en: string; content_ar: string }) => {
      const { data } = await api.put<ApiResponse<SiteContent>>(
        `/admin/content/${payload.id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content'] });
    },
  });
}

export function useBulkUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      contents: { id: number; content_en: string; content_ar: string }[],
    ) => {
      const { data } = await api.put<ApiResponse<null>>('/admin/content', { contents });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'content'] });
    },
  });
}
