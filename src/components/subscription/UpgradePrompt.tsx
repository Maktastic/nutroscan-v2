'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface UpgradePromptProps {
  feature: string
  requiredPlan: 'starter' | 'professional' | 'enterprise'
  onClose?: () => void
}

export function UpgradePrompt({ feature, requiredPlan, onClose }: UpgradePromptProps) {
  const planNames = {
    starter: 'Starter',
    professional: 'Professional',
    enterprise: 'Enterprise',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Upgrade to Unlock
          </h3>

          <p className="text-gray-600 mb-6">
            {feature} is available on the {planNames[requiredPlan]} plan and above.
            Upgrade now to access this feature and more!
          </p>

          <div className="space-y-3">
            <Link href="/pricing" className="block">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                View Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            {onClose && (
              <Button variant="outline" onClick={onClose} className="w-full">
                Maybe Later
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
