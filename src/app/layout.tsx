import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Navigation } from '@/components/navigation/Navigation'
import { Footer } from '@/components/navigation/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NutroScan Pro - AI-Powered Meal Planning for Better Health',
  description: 'Transform your health with personalized AI-powered meal plans designed for your specific health conditions.',
  keywords: 'meal planning, AI nutrition, health conditions, diabetes meal plan, PCOS diet',
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
          <Navigation />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
