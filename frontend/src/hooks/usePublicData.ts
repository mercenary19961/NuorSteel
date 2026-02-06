import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/axios';

// --- Page Data Hooks ---

interface PageContent {
  [section: string]: {
    [key: string]: string;
  };
}

interface HomeData {
  content: PageContent;
  featured_products: { id: number; name: string; slug: string; short_description: string; image: string | null }[];
  certificates: { id: number; title: string; category: string; thumbnail: string | null }[];
  linkedin_posts: unknown[];
}

interface AboutData {
  content: PageContent;
  timeline: { id: number; year: string; title: string; description: string | null; image: string | null }[];
  governance: { id: number; title: string; file_url: string }[];
}

interface QualityData {
  content: PageContent;
  certificates: { id: number; title: string; description: string | null; file_url: string; thumbnail: string | null; issue_date: string | null; expiry_date: string | null }[];
}

interface CertificateItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  thumbnail: string | null;
  issue_date: string | null;
  expiry_date: string | null;
}

interface CertificatesData {
  content: PageContent;
  esg: CertificateItem[];
  quality: CertificateItem[];
  governance: CertificateItem[];
}

interface ContactPageData {
  content: PageContent;
  settings: { phone: string | null; email: string | null; address: string | null };
}

interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string | null;
  category: string | null;
  image: string | null;
}

interface ProductDetail {
  id: number;
  name: string;
  name_en: string;
  name_ar: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  category: string | null;
  featured_image: string | null;
  images: { id: number; url: string; alt: string; is_primary: boolean }[];
  specifications: {
    chemical: { property: string; value: string }[];
    mechanical: { property: string; value: string }[];
    dimensional: { property: string; value: string }[];
  };
}

interface CareerListItem {
  id: number;
  title: string;
  slug: string;
  location: string | null;
  employment_type: string;
  expires_at: string | null;
  created_at: string;
}

interface CareersPageData {
  content: PageContent;
  listings: CareerListItem[];
}

interface CareerDetail {
  id: number;
  title: string;
  title_en: string;
  title_ar: string;
  slug: string;
  description: string;
  requirements: string | null;
  location: string | null;
  employment_type: string;
  expires_at: string | null;
  created_at: string;
}

export function useHomePage() {
  return useQuery({
    queryKey: ['public', 'home'],
    queryFn: async () => {
      const { data } = await api.get('/pages/home');
      return data.data as HomeData;
    },
  });
}

export function useAboutPage() {
  return useQuery({
    queryKey: ['public', 'about'],
    queryFn: async () => {
      const { data } = await api.get('/pages/about');
      return data.data as AboutData;
    },
  });
}

export function useRecyclingPage() {
  return useQuery({
    queryKey: ['public', 'recycling'],
    queryFn: async () => {
      const { data } = await api.get('/pages/recycling');
      return data.data as { content: PageContent };
    },
  });
}

export function useQualityPage() {
  return useQuery({
    queryKey: ['public', 'quality'],
    queryFn: async () => {
      const { data } = await api.get('/pages/quality');
      return data.data as QualityData;
    },
  });
}

export function useCertificatesPage() {
  return useQuery({
    queryKey: ['public', 'certificates'],
    queryFn: async () => {
      const { data } = await api.get('/pages/certificates');
      return data.data as CertificatesData;
    },
  });
}

export function useContactPage() {
  return useQuery({
    queryKey: ['public', 'contact'],
    queryFn: async () => {
      const { data } = await api.get('/pages/contact');
      return data.data as ContactPageData;
    },
  });
}

export function usePublicProducts() {
  return useQuery({
    queryKey: ['public', 'products'],
    queryFn: async () => {
      const { data } = await api.get('/products');
      return data.data as ProductListItem[];
    },
  });
}

export function usePublicProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['public', 'products', slug],
    queryFn: async () => {
      const { data } = await api.get(`/products/${slug}`);
      return data.data as ProductDetail;
    },
    enabled: !!slug,
  });
}

export function useCareersPage() {
  return useQuery({
    queryKey: ['public', 'careers'],
    queryFn: async () => {
      const { data } = await api.get('/careers');
      return data.data as CareersPageData;
    },
  });
}

export function usePublicCareer(slug: string | undefined) {
  return useQuery({
    queryKey: ['public', 'careers', slug],
    queryFn: async () => {
      const { data } = await api.get(`/careers/${slug}`);
      return data.data as CareerDetail;
    },
    enabled: !!slug,
  });
}

// --- Form Submission Hooks ---

export function useSubmitContact() {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await api.post('/contact', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
  });
}

export function useSubmitApplication() {
  return useMutation({
    mutationFn: async ({ slug, formData }: { slug?: string; formData: FormData }) => {
      const url = slug ? `/careers/${slug}/apply` : '/careers/apply';
      const { data } = await api.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
  });
}

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post('/newsletter/subscribe', { email });
      return data;
    },
  });
}
