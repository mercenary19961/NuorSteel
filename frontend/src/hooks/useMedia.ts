import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, Media } from '../types';

interface MediaListResponse {
  success: boolean;
  data: Media[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function useMedia(params: { page?: number; folder?: string; type?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'media', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.folder) searchParams.set('folder', params.folder);
      if (params.type) searchParams.set('type', params.type);

      const { data } = await api.get<MediaListResponse>(
        `/admin/media?${searchParams.toString()}`,
      );
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useMediaFolders() {
  return useQuery({
    queryKey: ['admin', 'media', 'folders'],
    queryFn: async (): Promise<string[]> => {
      const { data } = await api.get<ApiResponse<string[]>>('/admin/media/folders');
      return data.data!;
    },
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      file: File;
      folder?: string;
      alt_text_en?: string;
      alt_text_ar?: string;
    }) => {
      const formData = new FormData();
      formData.append('file', payload.file);
      if (payload.folder) formData.append('folder', payload.folder);
      if (payload.alt_text_en) formData.append('alt_text_en', payload.alt_text_en);
      if (payload.alt_text_ar) formData.append('alt_text_ar', payload.alt_text_ar);

      const { data } = await api.post<ApiResponse<{ id: number; url: string; filename: string }>>(
        '/admin/media',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
}

export function useUpdateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: number;
      alt_text_en?: string;
      alt_text_ar?: string;
      folder?: string;
    }) => {
      const { data } = await api.put<ApiResponse<Media>>(`/admin/media/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/admin/media/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'media'] });
    },
  });
}
