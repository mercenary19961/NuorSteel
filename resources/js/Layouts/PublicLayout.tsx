import type { ReactNode } from 'react';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

interface Props {
  children: ReactNode;
}

export default function PublicLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
