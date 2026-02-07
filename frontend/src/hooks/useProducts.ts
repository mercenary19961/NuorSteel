import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import type { ApiResponse, Product, ProductImage, ProductSpecification } from '../types';

interface ProductListResponse {
  success: boolean;
  data: Product[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export function useProducts(params: { page?: number; category?: string; active?: boolean } = {}) {
  return useQuery({
    queryKey: ['admin', 'products', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.set('page', String(params.page));
      if (params.category) searchParams.set('category', params.category);
      if (params.active !== undefined) searchParams.set('active', String(params.active));

      const { data } = await api.get<ProductListResponse>(
        `/admin/products?${searchParams.toString()}`,
      );
      return { items: data.data, meta: data.meta };
    },
  });
}

export function useProduct(id: number | null) {
  return useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: async (): Promise<Product> => {
      const { data } = await api.get<ApiResponse<Product>>(`/admin/products/${id}`);
      return data.data!;
    },
    enabled: !!id,
  });
}

export function useProductCategories() {
  return useQuery({
    queryKey: ['admin', 'products', 'categories'],
    queryFn: async (): Promise<string[]> => {
      const { data } = await api.get<ApiResponse<string[]>>('/admin/products/categories');
      return data.data!;
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      name_en: string;
      name_ar: string;
      slug?: string;
      short_description_en?: string;
      short_description_ar?: string;
      description_en?: string;
      description_ar?: string;
      category?: string;
      featured_image_id?: number | null;
      is_active?: boolean;
      is_featured?: boolean;
      sort_order?: number;
    }) => {
      const { data } = await api.post<ApiResponse<Product>>('/admin/products', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: number;
      name_en: string;
      name_ar: string;
      slug?: string;
      short_description_en?: string;
      short_description_ar?: string;
      description_en?: string;
      description_ar?: string;
      category?: string;
      featured_image_id?: number | null;
      is_active?: boolean;
      is_featured?: boolean;
      sort_order?: number;
    }) => {
      const { data } = await api.put<ApiResponse<Product>>(`/admin/products/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/admin/products/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useAddProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      media_id,
      is_primary,
      sort_order,
    }: {
      productId: number;
      media_id: number;
      is_primary?: boolean;
      sort_order?: number;
    }) => {
      const { data } = await api.post<ApiResponse<ProductImage>>(
        `/admin/products/${productId}/images`,
        { media_id, is_primary, sort_order },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useRemoveProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, imageId }: { productId: number; imageId: number }) => {
      const { data } = await api.delete<ApiResponse<null>>(
        `/admin/products/${productId}/images/${imageId}`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}

export function useUpdateProductSpecifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      specifications,
    }: {
      productId: number;
      specifications: Omit<ProductSpecification, 'id' | 'product_id'>[];
    }) => {
      const { data } = await api.put<ApiResponse<ProductSpecification[]>>(
        `/admin/products/${productId}/specifications`,
        { specifications },
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
    },
  });
}
