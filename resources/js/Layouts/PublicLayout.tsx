import type { ReactNode } from 'react';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';
import ScrollToTop from '@/Components/ui/scroll-to-top';

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
