import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import "./i18n";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";

// Public Pages
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import ProductsPage from "./pages/public/ProductsPage";
import QualityPage from "./pages/public/QualityPage";
import CareerPage from "./pages/public/CareerPage";
import CertificatesPage from "./pages/public/CertificatesPage";
import ContactPage from "./pages/public/ContactPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/about/recycling" element={<div>Recycling Page</div>} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<div>Product Detail</div>} />
                <Route path="/quality" element={<QualityPage />} />
                <Route path="/career" element={<CareerPage />} />
                <Route path="/career/:slug" element={<div>Job Detail</div>} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<div>Admin Login</div>} />
              <Route path="/admin/*" element={<div>Admin Dashboard</div>} />

              {/* 404 */}
              <Route path="*" element={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600">Page Not Found</p>
                  </div>
                </div>
              } />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
