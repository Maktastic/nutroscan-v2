import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'  // ← Make sure this import is here!
import { Providers } from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NutroScan Pro - AI-Powered Meal Planning',
  description: 'Transform your health with personalized AI-powered meal plans',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
