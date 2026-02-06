import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { NewsletterSubscriber, PaginatedResponse } from '../types';

interface NewsletterFilters {
  page?: number;
}

interface NewsletterStats {
  total: number;
  active: number;
  inactive: number;
  by_source: Record<string, number>;
}

export function useNewsletter(filters: NewsletterFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'newsletter', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.page) params.set('page', String(filters.page));
      const { data } = await api.get(`/admin/newsletter?${params}`);
      return data as PaginatedResponse<NewsletterSubscriber>;
    },
  });
}

export function useNewsletterStats() {
  return useQuery({
    queryKey: ['admin', 'newsletter', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/newsletter/stats');
      return data.data as NewsletterStats;
    },
  });
}

export function useAddSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { email: string; source?: string }) => {
      const { data } = await api.post('/admin/newsletter', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter'] });
    },
  });
}

export function useToggleSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.post(`/admin/newsletter/${id}/toggle`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter'] });
    },
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete(`/admin/newsletter/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'newsletter'] });
    },
  });
}

export function useExportSubscribers() {
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/admin/newsletter/export');
      return data.data as string[];
    },
  });
}
