import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Futuril',
  description: 'Futuril Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-bg min-h-screen">
      <body className="min-h-screen text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
