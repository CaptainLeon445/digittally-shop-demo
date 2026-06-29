import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/providers/Providers';

export const metadata: Metadata = {
  title: 'Digit-Tally Shop Manager',
  description: 'Manage your Digit-Tally shops and orders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
