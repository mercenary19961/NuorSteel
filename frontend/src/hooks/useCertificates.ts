import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, Certificate } from '../types';

interface CertificateListResponse {
  success: boolean;
  data: Certificate[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function useCertificates(
  params: { page?: number; category?: string; active?: boolean } = {},
) {
  return useQuery({
    queryKey: ['admin', 'certificates', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.category) searchParams.set('category', params.category);
      if (params.active !== undefined) searchParams.set('active', String(params.active));

      const { data } = await api.get<CertificateListResponse>(
        `/admin/certificates?${searchParams.toString()}`,
      );
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useCertificate(id: number | null) {
  return useQuery({
    queryKey: ['admin', 'certificates', id],
    queryFn: async (): Promise<Certificate> => {
      const { data } = await api.get<ApiResponse<Certificate>>(`/admin/certificates/${id}`);
      return data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: FormData) => {
      const { data } = await api.post<ApiResponse<Certificate>>('/admin/certificates', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'certificates'] });
    },
  });
}

export function useUpdateCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: FormData }) => {
      // Laravel doesn't support PUT with FormData natively, use POST with _method
      payload.append('_method', 'PUT');
      const { data } = await api.post<ApiResponse<Certificate>>(
        `/admin/certificates/${id}`,
        payload,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'certificates'] });
    },
  });
}

export function useDeleteCertificate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/admin/certificates/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'certificates'] });
    },
  });
}
