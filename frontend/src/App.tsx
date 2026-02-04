import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes - To be implemented */}
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/about" element={<div>About Us</div>} />
          <Route path="/products" element={<div>Products</div>} />
          <Route path="/quality" element={<div>Quality</div>} />
          <Route path="/careers" element={<div>Careers</div>} />
          <Route path="/certificates" element={<div>Certificates</div>} />
          <Route path="/contact" element={<div>Contact</div>} />

          {/* Admin Routes - To be implemented */}
          <Route path="/admin/login" element={<div>Admin Login</div>} />
          <Route path="/admin" element={<div>Admin Dashboard</div>} />

          {/* 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
