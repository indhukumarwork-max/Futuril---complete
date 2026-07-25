
// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Futuril',
  description: 'Futuril application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-pearlSilver min-h-screen">
      <body className="flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
