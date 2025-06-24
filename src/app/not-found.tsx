'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <motion.h1
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-9xl font-bold text-gray-200"
          >
            404
          </motion.h1>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Here are some helpful links:</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/dashboard" className="text-emerald-600 hover:underline">
              Dashboard
            </Link>
            <Link href="/meal-plans" className="text-emerald-600 hover:underline">
              Meal Plans
            </Link>
            <Link href="/settings" className="text-emerald-600 hover:underline">
              Settings
            </Link>
            <Link href="/contact" className="text-emerald-600 hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
