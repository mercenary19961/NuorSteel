import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, ContactSubmission } from '../types';

interface ContactListResponse {
  success: boolean;
  data: ContactSubmission[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ContactStats {
  total: number;
  unread: number;
  by_type: Record<string, number>;
}

export function useContacts(
  params: { page?: number; request_type?: string; is_read?: boolean; archived?: boolean } = {},
) {
  return useQuery({
    queryKey: ['admin', 'contacts', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.request_type) searchParams.set('request_type', params.request_type);
      if (params.is_read !== undefined) searchParams.set('is_read', String(params.is_read));
      if (params.archived) searchParams.set('archived', '1');

      const { data } = await api.get<ContactListResponse>(
        `/admin/contacts?${searchParams.toString()}`,
      );
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useContactStats() {
  return useQuery({
    queryKey: ['admin', 'contacts', 'stats'],
    queryFn: async (): Promise<ContactStats> => {
      const { data } = await api.get<ApiResponse<ContactStats>>('/admin/contacts/stats');
      return data.data!;
    },
  });
}

export function useContact(id: number | null) {
  return useQuery({
    queryKey: ['admin', 'contacts', id],
    queryFn: async (): Promise<ContactSubmission> => {
      const { data } = await api.get<ApiResponse<ContactSubmission>>(`/admin/contacts/${id}`);
      return data.data!;
    },
    enabled: !!id,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<ContactSubmission>>(
        `/admin/contacts/${id}/read`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useArchiveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<null>>(`/admin/contacts/${id}/archive`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
  });
}

export function useUnarchiveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<null>>(`/admin/contacts/${id}/unarchive`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/admin/contacts/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    },
  });
}
