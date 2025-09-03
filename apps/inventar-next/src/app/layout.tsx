'use client';

import InventarNavigationBar from '@/components/navigationBar/InventarNavigationBar';
import { ApiProvider } from '@/provider/api/apiProvider';
import { AuthProvider } from '@/provider/auth/authProvider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { useState } from 'react';
import FeedbackDialog from '@/components/dialog/FeedbackDialog';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  return (
    <html lang="de">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex flex-col gap-4 justify-between min-h-screen">
          <InventarNavigationBar />
          <div className="grow">
            <AuthProvider>
              <ApiProvider>{children}</ApiProvider>
            </AuthProvider>
          </div>
          <div className="flex flex-row justify-center gap-2 mb-3 flex-wrap px-2">
            <div>©2025 Malte Sehmer</div>
            <div className="text-gray-400">|</div>
            <a
              data-umami-event={'Open Impressum button'}
              href={'https://thw-tools.de/impressum'}
              className="underline"
            >
              Impressum
            </a>
            <div className="text-gray-400">|</div>
            <div
              className="underline cursor-pointer"
              data-umami-event="Open Feedback Dialog"
              onClick={() => setShowFeedbackDialog(true)}
            >
              Feedback
            </div>
            <div className="text-gray-400">|</div>
            <div
              className="underline cursor-pointer"
              data-umami-event="Open Offline Availability Dialog"
            >
              Als App installieren
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-gray-400">Build: TODO</div>
          </div>
        </div>
        {showFeedbackDialog && <FeedbackDialog onClose={() => setShowFeedbackDialog(false)} />}
      </body>
    </html>
  );
}
