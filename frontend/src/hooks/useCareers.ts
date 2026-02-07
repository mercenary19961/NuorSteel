import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, CareerListing, CareerApplication } from '../types';

interface CareerListResponse {
  success: boolean;
  data: CareerListing[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ApplicationListResponse {
  success: boolean;
  data: CareerApplication[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Career Listings
export function useCareers(params: { page?: number; status?: string } = {}) {
  return useQuery({
    queryKey: ['admin', 'careers', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.status) searchParams.set('status', params.status);

      const { data } = await api.get<CareerListResponse>(
        `/admin/careers?${searchParams.toString()}`,
      );
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useCareer(id: number | null) {
  return useQuery({
    queryKey: ['admin', 'careers', id],
    queryFn: async (): Promise<CareerListing> => {
      const { data } = await api.get<ApiResponse<CareerListing>>(`/admin/careers/${id}`);
      return data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      title_en: string;
      title_ar: string;
      slug?: string;
      description_en: string;
      description_ar: string;
      requirements_en?: string;
      requirements_ar?: string;
      location?: string;
      employment_type: 'full-time' | 'part-time' | 'contract';
      status: 'draft' | 'open' | 'closed';
      expires_at?: string;
    }) => {
      const { data } = await api.post<ApiResponse<CareerListing>>('/admin/careers', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'careers'] });
    },
  });
}

export function useUpdateCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: number;
      title_en: string;
      title_ar: string;
      slug?: string;
      description_en: string;
      description_ar: string;
      requirements_en?: string;
      requirements_ar?: string;
      location?: string;
      employment_type: 'full-time' | 'part-time' | 'contract';
      status: 'draft' | 'open' | 'closed';
      expires_at?: string;
    }) => {
      const { data } = await api.put<ApiResponse<CareerListing>>(`/admin/careers/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'careers'] });
    },
  });
}

export function useDeleteCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/admin/careers/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'careers'] });
    },
  });
}

// Applications
export function useApplications(
  params: { page?: number; status?: string; listing_id?: number } = {},
) {
  return useQuery({
    queryKey: ['admin', 'applications', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.status) searchParams.set('status', params.status);
      if (params.listing_id) searchParams.set('listing_id', String(params.listing_id));

      const { data } = await api.get<ApplicationListResponse>(
        `/admin/applications?${searchParams.toString()}`,
      );
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
      admin_notes,
    }: {
      id: number;
      status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
      admin_notes?: string;
    }) => {
      const { data } = await api.put<ApiResponse<CareerApplication>>(
        `/admin/applications/${id}`,
        { status, admin_notes },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/admin/applications/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'applications'] });
    },
  });
}
