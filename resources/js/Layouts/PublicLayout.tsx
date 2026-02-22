import type { ReactNode } from 'react';
import Header from '@/Components/Layout/Header';
import Footer from '@/Components/Layout/Footer';

interface Props {
  children: ReactNode;
  transparentHeader?: boolean;
}

export default function PublicLayout({ children, transparentHeader = false }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header transparent={transparentHeader} />
      <main className={`grow ${!transparentHeader ? 'pt-16 lg:pt-20' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
