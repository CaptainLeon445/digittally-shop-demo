import type { Metadata } from 'next';
import LandingPage from '@/components/landing/LandingPage';

export const metadata: Metadata = {
  title: 'Digit-Tally — Launch Your Online Shop in Minutes | Sell Smarter, Grow Faster',
  description:
    'Create your online shop, manage bookings, sell products, and track orders — all in one place. Perfect for Nigerian businesses, vendors, consultants, and hospitality brands. Start free today.',
  keywords: [
    'online shop Nigeria', 'create online store Nigeria', 'sell online Nigeria',
    'small business management', 'shop management software', 'order tracking Nigeria',
    'booking system Nigeria', 'online vendor platform', 'ecommerce Nigeria',
  ],
  openGraph: {
    title: 'Digit-Tally — Sell Online in 5 Minutes',
    description: 'Your all-in-one storefront. Launch shops, take bookings, track orders, pay your team.',
    type: 'website',
  },
};

export default function Home() {
  return <LandingPage />;
}
