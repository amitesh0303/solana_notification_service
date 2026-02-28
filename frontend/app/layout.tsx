import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'SolNotify – Solana Push Notifications',
  description:
    'Never miss an on-chain event. Real-time Solana notifications via email, SMS, Telegram, and Discord.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
